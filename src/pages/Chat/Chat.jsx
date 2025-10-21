import { useState, useEffect, useRef } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { RiSendPlane2Fill } from "react-icons/ri";
import { FiMenu, FiMoreVertical } from "react-icons/fi";
import { IoImagesOutline, } from "react-icons/io5";
//

import { useParams } from "react-router-dom";
import { useSpecificEventWiseConversationQuery } from "../../redux/api/allEventChatRoom";
import { getImageUrl } from "../../config/envConfig";
import { format } from "date-fns";

const users = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    message: "How are you feeling today?",
    time: "2:45 PM",
    avatar: "https://avatar.iran.liara.run/public/28",
    online: true,
    unread: 2,
  },
  {
    id: 2,
    name: "Patient Alex Smith",
    message: "Thank you for the prescription",
    time: "1:30 PM",
    avatar: "https://avatar.iran.liara.run/public/27",
    online: false,
    unread: 0,
  },
  {
    id: 3,
    name: "Dr. Michael Brown",
    message: "Your test results are ready",
    time: "12:15 PM",
    avatar: "https://avatar.iran.liara.run/public/29",
    online: true,
    unread: 1,
  },
  {
    id: 4,
    name: "Patient Emma Wilson",
    message: "When is my next appointment?",
    time: "11:00 AM",
    avatar: "https://avatar.iran.liara.run/public/30",
    online: false,
    unread: 0,
  },
  {
    id: 5,
    name: "Dr. Lisa Davis",
    message: "Please take your medication on time",
    time: "10:30 AM",
    avatar: "https://avatar.iran.liara.run/public/31",
    online: true,
    unread: 3,
  },
  {
    id: 6,
    name: "Patient John Doe",
    message: "I'm feeling much better now",
    time: "9:45 AM",
    avatar: "https://avatar.iran.liara.run/public/32",
    online: false,
    unread: 0,
  },
  {
    id: 7,
    name: "Dr. Robert Miller",
    message: "Let's schedule a follow-up",
    time: "Yesterday",
    avatar: "https://avatar.iran.liara.run/public/33",
    online: false,
    unread: 0,
  },
  {
    id: 8,
    name: "Patient Mary Johnson",
    message: "Thank you for your help",
    time: "Yesterday",
    avatar: "https://avatar.iran.liara.run/public/34",
    online: true,
    unread: 0,
  },
];

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState([]);

  const [newMessage, setNewMessage] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  //
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { eventId } = useParams();
  console.log(eventId);
  const { data: convoMessages, isLoading: isMessagesLoading, isError: isMessagesError } = useSpecificEventWiseConversationQuery(
    { eventId },
    { skip: !eventId }
  );

  useEffect(() => {
    const apiMsgs = convoMessages?.data?.messages || [];
    setMessages(apiMsgs);
  }, [convoMessages]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    // Hooked up UI only; sending not implemented in this scope
    if (!newMessage.trim()) return;
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
          <div className="flex-1 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedUser.id === user.id ? "bg-teal-50 border-r-4 border-r-teal-500" : ""
                  }`}
                onClick={() => {
                  setSelectedUser(user);
                  setShowSidebar(false);
                }}
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  {user.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                    <span className="text-xs text-gray-500">{user.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{user.message}</p>
                </div>
                {user.unread > 0 && (
                  <div className="bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {user.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-white/20"
                />
                {selectedUser.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
                <p className="text-sm text-teal-100">
                  {selectedUser.online ? "Online" : "Last seen " + selectedUser.time}
                </p>
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
                  <IoImagesOutline className="w-5 h-5" />
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