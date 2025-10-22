import { useState, useEffect, useRef } from "react";
import { AiOutlineFileAdd, AiOutlineSearch } from "react-icons/ai";
import { RiSendPlane2Fill } from "react-icons/ri";
import { FiMenu, FiMoreVertical } from "react-icons/fi";


import { useParams, useNavigate } from "react-router-dom";
import { useSpecificEventWiseConversationQuery } from "../../redux/api/allEventChatRoom";
import { getImageUrl } from "../../config/envConfig";
import { format } from "date-fns";
import { useGetAllEventChatRoomQuery } from "../../redux/api/allEventChatRoom";
import useDebounce from "../../hooks/useDebounce";
import useSocket from "../../hooks/useSocket";
import { useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";


const Chat = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0, totalPage: 1 });
  const [rooms, setRooms] = useState([]);
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


  const { data: allEventChatRoomData, isLoading, isError } = useGetAllEventChatRoomQuery({
    page: pagination.current,
    limit: pagination.pageSize,
    searchTerm: debouncedSearch,
  });
  const { data: convoMessages, isLoading: isMessagesLoading, isError: isMessagesError } = useSpecificEventWiseConversationQuery(
    { eventId },
    { skip: !eventId }
  );

  const { connected, sendMessage: emitMessage } = useSocket({
    serverUrl: "http://10.10.20.13:3056",
    userId: currentUserId,
    eventId,
  });

  const initialSendRef = useRef({});

  useEffect(() => {
    if (!connected || !eventId) return;
    const recvId = (convoMessages?.data?.messages || [])
      .find(m => m?.msgByUserId?._id && m.msgByUserId._id !== currentUserId)?.msgByUserId?._id;
    if (!recvId) return;
    if (!initialSendRef.current[eventId]) {
      emitMessage({ text: "hello ", receiverId: recvId, eventId });
      initialSendRef.current[eventId] = true;
    }
  }, [connected, eventId, convoMessages, currentUserId, emitMessage]);




  useEffect(() => {
    const apiMsgs = convoMessages?.data?.messages || [];
    setMessages(apiMsgs);
  }, [convoMessages]);

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

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const other = messages.find((m) => m?.msgByUserId?._id && m?.msgByUserId?._id !== currentUserId);
    const receiverId = other?.msgByUserId?._id || undefined;
    emitMessage({ text: newMessage.trim(), receiverId, eventId });
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newMsg = {
        id: messages.length + 1,
        text: `📎 ${file.name}`,
        sender: "me",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sent",
        type: "file",
      };
      setMessages([...messages, newMsg]);
    }
  };

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
          className={`absolute md:relative top-0 left-0 w-80 md:w-96 h-full bg-white shadow-lg md:shadow-none md:border-r border-gray-200 flex flex-col transition-all duration-300 z-50 ${showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
          <div className="flex-1 overflow-y-auto" onScroll={(e) => {
            const el = e.currentTarget;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
              if (!isLoading && pagination.current < pagination.totalPage) {
                setPagination((prev) => ({ ...prev, current: prev.current + 1 }));
              }
            }
          }} ref={roomsListRef}>
            {isLoading && (
              <div className="text-center text-gray-500 py-4">Loading chat rooms...</div>
            )}
            {isError && !isLoading && (
              <div className="text-center text-red-500 py-4">Failed to load chat rooms.</div>
            )}
            {!isLoading && !isError && filteredRooms.length === 0 && (
              <div className="text-center text-gray-500 py-4">No chat rooms found.</div>
            )}
            {!isLoading && !isError && filteredRooms.map((room) => (
              <div
                key={room._id}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedRoom?._id === room._id ? "bg-teal-50 border-r-4 border-r-teal-500" : ""}`}
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
                    src={getImageUrl(room?.eventId?.photo) || `https://avatar.iran.liara.run/public/${room?._id}`}
                    alt={room?.chatRoomName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{room?.chatRoomName}</h3>
                    <span className="text-xs text-gray-500">{room?.createdAt ? format(new Date(room.createdAt), 'hh:mm a') : ''}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{room?.eventId?.event_title || ''}</p>
                </div>
              </div>
            ))}
            {!isLoading && pagination.current < pagination.totalPage && (
              <div className="text-center text-gray-400 py-3">Scroll to load more…</div>
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
                  src={getImageUrl(selectedRoom?.eventId?.photo) || (selectedRoom?._id ? `https://avatar.iran.liara.run/public/${selectedRoom?._id}` : "https://avatar.iran.liara.run/public/1")}
                  alt={selectedRoom?.chatRoomName || "Chat Room"}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{selectedRoom?.chatRoomName || "Select a chat room"}</h2>
                <p className="text-sm text-teal-100">{selectedRoom?.eventId?.event_title || ''}</p>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <FiMoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
            {isMessagesLoading && (
              <div className="text-center text-gray-500 py-10">Loading messages...</div>
            )}
            {isMessagesError && !isMessagesLoading && (
              <div className="text-center text-red-500 py-10">Failed to load messages.</div>
            )}
            {!isMessagesLoading && !isMessagesError && messages.length === 0 && (
              <div className="text-center text-gray-500 py-10">No messages yet.</div>
            )}
            {!isMessagesLoading && !isMessagesError && messages.map((msg) => (
              <div key={msg._id} className="flex items-start gap-3">
                <img
                  src={getImageUrl(msg?.msgByUserId?.photo) || `https://avatar.iran.liara.run/public/${msg?.msgByUserId?._id}`}
                  alt={msg?.msgByUserId?.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">{msg?.msgByUserId?.name}</span>
                    <span className="text-xs text-gray-500">{msg?.createdAt ? format(new Date(msg.createdAt), 'hh:mm a') : ''}</span>
                  </div>
                  <div className="mt-1 bg-white border rounded-2xl rounded-bl-md px-4 py-2 shadow-sm max-w-xl">
                    <p className="text-sm leading-relaxed">{msg?.text}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
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
                  accept="image/*,application/pdf,.doc,.docx"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-gray-500 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                >
                  <AiOutlineFileAdd className="w-5 h-5" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-full transition-all ${newMessage.trim()
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