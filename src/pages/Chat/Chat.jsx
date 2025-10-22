import { useState, useEffect, useRef, useMemo } from "react";
import { AiOutlineFileAdd, AiOutlineSearch } from "react-icons/ai";
import { RiSendPlane2Fill } from "react-icons/ri";
import { FiMenu, FiMoreVertical } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { Popconfirm, Tooltip, Modal, Avatar } from "antd";


import { useParams, useNavigate } from "react-router-dom";
import { useSpecificEventWiseConversationQuery } from "../../redux/api/allEventChatRoom";
import { getImageUrl } from "../../config/envConfig";
import { format } from "date-fns";
import { useGetAllEventChatRoomQuery } from "../../redux/api/allEventChatRoom";
import useDebounce from "../../hooks/useDebounce";
import useSocket from "../../hooks/useSocket";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import defaultIMG from "../../assets/defaultImg";
import { useNewMessageMutation, useDeleteMessageMutation } from "../../redux/api/allEventChatRoom";
import { useGetGroupConversationandpeopleQuery } from "../../redux/api/allEventChatRoom";

const Chat = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    totalPage: 1,
  });
  const [rooms, setRooms] = useState([]);
  // message pagination
  const [msgPage, setMsgPage] = useState(1);
  const msgLimit = 10;
  const [msgMeta, setMsgMeta] = useState(null);
  // attachment preview state
  const [pendingAttachment, setPendingAttachment] = useState(null); // { file, url, type }
  // participants modal
  const [showParticipants, setShowParticipants] = useState(false);
  //
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const roomsListRef = useRef(null);

  const { eventId } = useParams();
  const navigate = useNavigate();
  // console.log(eventId);
  const token = useSelector((state) => state?.auth?.token);
  const decoded = token ? jwtDecode(token) : null;
  const currentUserId = decoded?.id;
  const [createMessage, { isLoading: isUploading }] = useNewMessageMutation();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteMessageMutation();
  const { data: groupConvos, isLoading: isGroupLoading } = useGetGroupConversationandpeopleQuery(
    eventId,
    { skip: !eventId }
  );

  const participants = useMemo(() => {
    const list = [];
    const seen = new Set();
    const convos = groupConvos?.data?.allConversations || [];
    for (const c of convos) {
      for (const p of c?.participants || []) {
        const id = p?._id || p?.id;
        if (id && !seen.has(id)) {
          seen.add(id);
          list.push(p);
        }
      }
    }
    return list;
  }, [groupConvos]);
  
  const {
    data: allEventChatRoomData,
    isLoading,
    isError,
  } = useGetAllEventChatRoomQuery({
    page: pagination.current,
    limit: pagination.pageSize,
    searchTerm: debouncedSearch,
  });
  const {
    data: convoMessages,
    isLoading: isMessagesLoading,
    isError: isMessagesError,
  } = useSpecificEventWiseConversationQuery(
    { eventId, page: msgPage, limit: msgLimit },
    { skip: !eventId }
  );

  const { connected, sendMessage: emitMessage, messages: liveMsgs } = useSocket({
    serverUrl: "http://10.10.20.13:3056",
    userId: currentUserId,
    eventId,
    sendEvent: "send-message",
  });

  const initialSendRef = useRef({});

  useEffect(() => {
    if (!connected || !eventId) return;
    const recvId = (convoMessages?.data?.messages || []).find(
      (m) => m?.msgByUserId?._id && m.msgByUserId._id !== currentUserId
    )?.msgByUserId?._id;
    if (!recvId) return;
    if (!initialSendRef.current[eventId]) {
      emitMessage({ text: "hello ", receiverId: recvId, eventId });
      initialSendRef.current[eventId] = true;
    }
  }, [connected, eventId, convoMessages, currentUserId, emitMessage]);

  // Reset messages and pagination when event changes
  useEffect(() => {
    setMsgPage(1);
    setMsgMeta(null);
    setMessages([]);
  }, [eventId]);

  // Handle API messages for current page
  useEffect(() => {
    const apiMsgs = convoMessages?.data?.messages || [];
    const meta = convoMessages?.data?.meta;
    if (meta) setMsgMeta(meta);
    const sorted = [...apiMsgs].sort(
      (a, b) => new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0)
    );
    if (msgPage === 1) {
      setMessages(sorted);
    } else if (sorted.length) {
      setMessages((prev) => {
        const merged = [...prev];
        for (const m of sorted) {
          if (m && m._id && !merged.some((x) => x._id === m._id)) merged.push(m);
        }
        return merged.sort(
          (a, b) => new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0)
        );
      });
    }
  }, [convoMessages, msgPage]);

  // Merge live incoming socket messages into page messages
  useEffect(() => {
    if (!liveMsgs || !liveMsgs.length) return;
    setMessages((prev) => {
      let merged = [...prev];
      for (const m of liveMsgs) {
        if (!m) continue;
        // Add if new by _id
        if (m._id && !merged.some((x) => x._id === m._id)) {
          merged.push(m);
        }
        // If this is an echo of our own message, remove matching optimistic temp
        const fromMe = (m?.msgByUserId?._id || m?.msgByUserId) === currentUserId;
        if (fromMe && m?.text) {
          merged = merged.filter(
            (x) => !(String(x?._id).startsWith("tmp-") && x?.text === m.text && (x?.msgByUserId?._id || x?.msgByUserId) === currentUserId)
          );
        }
      }
      return merged.sort(
        (a, b) => new Date(a?.createdAt || 0) - new Date(b?.createdAt || 0)
      );
    });
  }, [liveMsgs, currentUserId]);

  useEffect(() => {
    console.log("socket.connected:", connected);
  }, [connected]);

  // Reset and refetch when search changes
  useEffect(() => {
    setRooms([]);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [debouncedSearch]);

  // Append fetched rooms and update pagination metadata
  useEffect(() => {
    const fetched = allEventChatRoomData?.data?.all_event_chatroom || [];
    const meta = allEventChatRoomData?.data?.meta;
    if (meta) {
      setPagination((prev) => ({
        ...prev,
        total: meta.total ?? prev.total,
        totalPage: meta.totalPage ?? prev.totalPage,
      }));
    }
    if (fetched.length) {
      setRooms((prev) => {
        // Basic de-dup based on _id
        const existing = new Set(prev.map((r) => r._id));
        const add = fetched.filter((r) => !existing.has(r._id));
        return prev.concat(add);
      });
    } else if ((meta?.page ?? 1) === 1 && !isLoading && fetched.length === 0) {
      // No results on first page
      setRooms([]);
    }
  }, [allEventChatRoomData, isLoading]);

  // If no eventId in route, default to first room when list is available
  useEffect(() => {
    if (!eventId && !selectedRoom && rooms.length) {
      setSelectedRoom(rooms[0]);
    }
  }, [rooms, selectedRoom, eventId]);

  // When eventId exists in route, auto-select the matching room by eventId._id
  useEffect(() => {
    if (!eventId || !rooms.length) return;
    const match = rooms.find((r) => r?.eventId?._id === eventId);
    if (match && (!selectedRoom || selectedRoom?._id !== match._id)) {
      setSelectedRoom(match);
    }
  }, [rooms, eventId, selectedRoom]);
  // Server-side search already applied; no client filter needed
  const filteredRooms = rooms;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDeleteMessage = async (id) => {
    if (!id) return;
    try {
      await deleteMessage(id).unwrap();
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (e) {
      console.error("Failed to delete message", e);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !pendingAttachment) return;
    const other = messages.find(
      (m) => m?.msgByUserId?._id && m?.msgByUserId?._id !== currentUserId
    );
    // Try current page messages -> API conversation -> event host as last resort
    let receiverId = other?.msgByUserId?._id;
    if (!receiverId) {
      const apiOther = (convoMessages?.data?.messages || []).find(
        (m) => m?.msgByUserId?._id && m?.msgByUserId?._id !== currentUserId
      );
      receiverId = apiOther?.msgByUserId?._id;
    }
    if (!receiverId) {
      const hostId = selectedRoom?.eventId?.hostId?._id;
      receiverId = hostId && hostId !== currentUserId ? hostId : undefined;
    }
    if (!receiverId) {
      console.warn("No receiverId resolved; cannot send message.");
      return;
    }
    const text = newMessage.trim();
    if (pendingAttachment) {
      try {
        const form = new FormData();
        form.append(
          "data",
          JSON.stringify({ text, eventId, receiverId })
        );
        form.append("imageUrl", pendingAttachment.file);
        await createMessage(form).unwrap();
        // Clear input and preview after successful upload
        setNewMessage("");
        if (pendingAttachment?.url) URL.revokeObjectURL(pendingAttachment.url);
        setPendingAttachment(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        console.error("Failed to send attachment message", err);
      }
      return;
    }

    // Text-only -> use socket emit + optimistic
    emitMessage({ text, receiverId, eventId });
    const optimistic = {
      _id: `tmp-${Date.now()}`,
      text,
      msgByUserId: { _id: currentUserId },
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => prev.concat(optimistic));
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const type = file.type?.startsWith("image/") ? "image" : "file";
    // revoke previous preview url if any
    if (pendingAttachment?.url) URL.revokeObjectURL(pendingAttachment.url);
    setPendingAttachment({ file, url, type, name: file.name, size: file.size });
  };

  // cleanup preview url on unmount
  useEffect(() => {
    return () => {
      if (pendingAttachment?.url) URL.revokeObjectURL(pendingAttachment.url);
    };
  }, [pendingAttachment]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Messages
          </h1>
          <div className="md:hidden">
            <FiMenu
              className="text-2xl cursor-pointer text-gray-600"
              onClick={() => setShowSidebar(!showSidebar)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - User List */}
        <div
          className={`absolute md:relative top-0 left-0 w-80 md:w-96 h-full bg-white shadow-lg md:shadow-none md:border-r border-gray-200 flex flex-col transition-all duration-300 z-50 ${
            showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Mobile close button */}
          <div className="md:hidden flex justify-end p-4 border-b">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowSidebar(false)}
            >
              ✖
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <AiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* User List */}
          <div
            className="flex-1 overflow-y-auto"
            onScroll={(e) => {
              const el = e.currentTarget;
              if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
                if (!isLoading && pagination.current < pagination.totalPage) {
                  setPagination((prev) => ({
                    ...prev,
                    current: prev.current + 1,
                  }));
                }
              }
            }}
            ref={roomsListRef}
          >
            {isLoading && (
              <div className="text-center text-gray-500 py-4">
                Loading chat rooms...
              </div>
            )}
            {isError && !isLoading && (
              <div className="text-center text-red-500 py-4">
                Failed to load chat rooms.
              </div>
            )}
            {!isLoading && !isError && filteredRooms.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No chat rooms found.
              </div>
            )}
            {!isLoading &&
              !isError &&
              filteredRooms.map((room) => (
                <div
                  key={room._id}
                  className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    selectedRoom?._id === room._id
                      ? "bg-teal-50 border-r-4 border-r-teal-500"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedRoom(room);
                    setShowSidebar(false);
                    if (room?.eventId?._id) {
                      navigate(`/chat/${room.eventId._id}`);
                    }
                  }}
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(room?.eventId?.photo) || `${defaultIMG}`}
                      alt={room?.chatRoomName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {room?.chatRoomName}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {room?.createdAt
                          ? format(new Date(room.createdAt), "hh:mm a")
                          : ""}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">
                      {room?.eventId?.event_title || ""}
                    </p>
                  </div>
                </div>
              ))}
            {!isLoading && pagination.current < pagination.totalPage && (
              <div className="text-center text-gray-400 py-3">
                Scroll to load more…
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    getImageUrl(selectedRoom?.eventId?.photo) ||
                    (selectedRoom?._id
                      ? `${defaultIMG}`
                      : defaultIMG)
                  }
                  alt={selectedRoom?.chatRoomName || "Chat Room"}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">
                  {selectedRoom?.chatRoomName || "Select a chat room"}
                </h2>
                <p className="text-sm text-teal-100">
                  {selectedRoom?.eventId?.event_title || ""}
                </p>
              </div>
              <Tooltip title="View participants">
                <button
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  onClick={() => setShowParticipants(true)}
                >
                  <FiMoreVertical className="w-5 h-5" />
                </button>
              </Tooltip>
            </div>
          </div>

          <Modal
            title="Participants"
            open={showParticipants}
            onCancel={() => setShowParticipants(false)}
            footer={null}
            width={480}
          >
            {isGroupLoading ? (
              <div className="py-6 text-center text-gray-500">Loading...</div>
            ) : participants.length === 0 ? (
              <div className="py-6 text-center text-gray-500">No participants found.</div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y">
                {participants.map((p) => (
                  <div key={p?._id || p?.id} className="flex items-center gap-3 py-3">
                    <Avatar src={getImageUrl(p?.photo)} size={36}>
                      {p?.name?.[0] || "?"}
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{p?.name}</div>
                      <div className="text-xs text-gray-500 truncate">{p?.email}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
            {/* Load more older messages */}
            {!isMessagesLoading && msgMeta?.totalPage > msgPage && (
              <div className="flex justify-center">
                <button
                  onClick={() => setMsgPage((p) => p + 1)}
                  className="px-4 py-2 text-sm rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-700"
                >
                  Load older messages
                </button>
              </div>
            )}
            {isMessagesLoading && (
              <div className="text-center text-gray-500 py-10">
                Loading messages...
              </div>
            )}
            {isMessagesError && !isMessagesLoading && (
              <div className="text-center text-red-500 py-10">
                Failed to load messages.
              </div>
            )}
            {!isMessagesLoading &&
              !isMessagesError &&
              messages.length === 0 && (
                <div className="text-center text-gray-500 py-10">
                  No messages yet.
                </div>
              )}
            {!isMessagesLoading &&
              !isMessagesError &&
              messages.map((msg) => (
                <div key={msg._id} className="flex items-start gap-3">
                  <img
                    src={
                      getImageUrl(msg?.msgByUserId?.photo) ||
                      `${defaultIMG}`
                    }
                    alt={msg?.msgByUserId?.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-800">
                        {msg?.msgByUserId?.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {msg?.createdAt
                          ? format(new Date(msg.createdAt), "hh:mm a")
                          : ""}
                      </span>
                      {(msg?.msgByUserId?._id === currentUserId || msg?.msgByUserId === currentUserId) && (
                        <Popconfirm
                          title="Delete message"
                          description="Are you sure you want to delete this message?"
                          okText="Delete"
                          cancelText="Cancel"
                          okButtonProps={{ danger: true, loading: isDeleting }}
                          onConfirm={() => handleDeleteMessage(msg._id)}
                        >
                          <Tooltip title="Delete">
                            <button
                              disabled={isDeleting}
                              className="ml-2 p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-600 disabled:opacity-50"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </Popconfirm>
                      )}
                    </div>
                    {msg?.text && (
                      <div className="mt-1 bg-white border rounded-2xl rounded-bl-md px-4 py-2 shadow-sm max-w-xl">
                        <p className="text-sm leading-relaxed">{msg?.text}</p>
                      </div>
                    )}
                    {Array.isArray(msg?.imageUrl) && msg.imageUrl.length > 0 && (
                      <div className="mt-2 grid grid-cols-2 gap-2 max-w-xl">
                        {msg.imageUrl.map((u, idx) => (
                          <img
                            key={idx}
                            src={getImageUrl(u)}
                            alt="attachment"
                            className="w-full max-h-64 object-cover rounded-lg border border-gray-200"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center justify-center gap-3">
              <div className="flex-1 relative">
                {pendingAttachment && (
                  <div className="mb-3 flex items-center justify-between gap-3 border border-gray-200 rounded-xl p-2 bg-gray-50">
                    <div className="flex items-center gap-3 min-w-0">
                      {pendingAttachment.type === "image" ? (
                        <img src={pendingAttachment.url} alt="preview" className="h-12 w-12 rounded-lg object-cover" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          FILE
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          {pendingAttachment.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {(pendingAttachment.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (pendingAttachment?.url) URL.revokeObjectURL(pendingAttachment.url);
                        setPendingAttachment(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="px-2 py-1 text-xs rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none max-h-32"
                  rows="1"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,video/*,audio/*,application/pdf,.doc,.docx"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                >
                  <AiOutlineFileAdd className="w-5 h-5" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={(!newMessage.trim() && !pendingAttachment) || isUploading}
                  className={`p-3 rounded-full transition-all ${
                    (newMessage.trim() || pendingAttachment) && !isUploading
                      ? "bg-teal-500 hover:bg-teal-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <RiSendPlane2Fill className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Media & Files */}
      </div>
    </div>
  );
};

export default Chat;
