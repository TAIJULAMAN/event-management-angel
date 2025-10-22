import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";

// Usage:
// const { socket, connected, messages, sendMessage, lastError } = useSocket({
//   serverUrl: "http://10.10.20.13:3056",
//   userId: myUserId,
//   receiveEvent: "new_message",
//   sendEvent: "send_message",
// });

export default function useSocket({
  serverUrl,
  userId,
  receiveEvent = "new_message",
  sendEvent = "send_message",
} = {}) {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [lastError, setLastError] = useState(null);
  const socketRef = useRef(null);

  const canConnect = Boolean(serverUrl) && Boolean(userId);

  // Stable options for socket
  const options = useMemo(
    () => ({
      query: { id: userId },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    }),
    [userId]
  );

  useEffect(() => {
    if (!canConnect) return;

    const socket = io(serverUrl, options);
    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
      setLastError(null);
      console.log("[socket] connected", { serverUrl, userId });
    };

    const onDisconnect = () => {
      setConnected(false);
      console.log("[socket] disconnected");
    };

    const onConnectError = (err) => {
      const msg = err?.message || String(err);
      setLastError(msg);
      console.error("[socket] connect_error", msg);
    };

    const onReceive = (payload) => {
      setMessages((prev) => prev.concat(payload));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on(receiveEvent, onReceive);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off(receiveEvent, onReceive);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [serverUrl, options, receiveEvent, canConnect, userId]);

  const sendMessage = (payload) => {
    // Expected payload shape by backend:
    // { text, receiverId, eventId, imageUrl?, audioUrl? }
    if (!socketRef.current || !connected) return false;
    socketRef.current.emit(sendEvent, payload);
    return true;
  };

  return {
    socket: socketRef.current,
    connected,
    messages,
    lastError,
    sendMessage,
  };
}

// http://10.10.20.13:3056?id=68b71e270256ddb0b89dd214 my id form jwt token 

// {
//     "text":"hello ",
//     "receiverId":"68b76fca5941636d3fb7dfd1", each conversations first user id
//      "eventId":"68f00708ec3820cae715b7df" each conversations eventid's _id
// }


// {
//     "success": true,
//     "message": "successfully find by all chat room",
//     "data": {
//         "meta": {
//             "page": 1,
//             "limit": 10,
//             "total": 58,
//             "totalPage": 6
//         },
//         "all_event_chatroom": [
//             {
//                 "_id": "68f7cec11d72ab10fc26172a",
//                 "eventId": {
//                     "_id": "68f7cec11d72ab10fc26171c",
//                     "hostId": {
//                         "_id": "68f7cc564dedef119564f8df",
//                         "name": "Angel",
//                         "email": "riyajuddineusouf@gmail.com",
//                         "phoneNumber": "01723354435",
//                         "id": "68f7cc564dedef119564f8df"
//                     },
//                     "event_title": "Musice Fest 2025",
//                     "photo": "src/public/images/image_picker_42d9f1b3-005f-4598-982f-173c2f4795e1-81879-00000106e717f975-3fd6b276-152d-4e3f-aeb8-ea612ebb9248.jpg",
//                     "date": "22-10-2025",
//                     "starting_time": "12:13 PM",
//                     "ending_time": "03:13 AM",
//                     "event_category": "Concerts",
//                     "audience_settings": {
//                         "max_capacity": 500,
//                         "price": 70
//                     },
//                     "createdAt": "2025-10-21T18:19:45.817Z"
//                 },
//                 "hostId": "68f7cc564dedef119564f8df",
//                 "chatRoomName": "Musice Fest 2025",
//                 "totalMember": 0,
//                 "createdAt": "2025-10-21T18:19:45.898Z"
//             },
//             {
//                 "_id": "68f7cec01d72ab10fc261715",
//                 "eventId": {
//                     "_id": "68f7cec01d72ab10fc261707",
//                     "hostId": {
//                         "_id": "68f7cc564dedef119564f8df",
//                         "name": "Angel",
//                         "email": "riyajuddineusouf@gmail.com",
//                         "phoneNumber": "01723354435",
//                         "id": "68f7cc564dedef119564f8df"
//                     },
//                     "event_title": "Musice Fest 2025",
//                     "photo": "src/public/images/image_picker_42d9f1b3-005f-4598-982f-173c2f4795e1-81879-00000106e717f975-8ba1ea9d-d23b-412f-8ed2-3a197c793e55.jpg",
//                     "date": "22-10-2025",
//                     "starting_time": "12:13 AM",
//                     "ending_time": "03:13 AM",
//                     "event_category": "Concerts",
//                     "audience_settings": {
//                         "max_capacity": 500,
//                         "price": 70
//                     },
//                     "createdAt": "2025-10-21T18:19:44.556Z"
//                 },
//                 "hostId": "68f7cc564dedef119564f8df",
//                 "chatRoomName": "Musice Fest 2025",
//                 "totalMember": 0,
//                 "createdAt": "2025-10-21T18:19:44.665Z"
//             },
//             {
//                 "_id": "68f00708ec3820cae715b7ed",
//                 "eventId": {
//                     "_id": "68f00708ec3820cae715b7df",
//                     "hostId": {
//                         "_id": "68c9e08fb2e27952f4192c3e",
//                         "name": "Mahdi",
//                         "email": "moshiurrahmanmehedi210@gmail.com",
//                         "phoneNumber": "01968013150",
//                         "id": "68c9e08fb2e27952f4192c3e"
//                     },
//                     "event_title": "Real Madrid vs Barca",
//                     "photo": "src/public/images/image_picker_e7cfeff7-c141-40ca-b96f-475ccd965c2d-12964-0000005727f5ac85-d781af74-b186-420c-9f43-9af2c2b6135f.jpg",
//                     "date": "18-10-2025",
//                     "starting_time": "02:35 AM",
//                     "ending_time": "06:35 AM",
//                     "event_category": "Foot Festivals",
//                     "audience_settings": {
//                         "max_capacity": 350
//                     },
//                     "createdAt": "2025-10-15T20:41:44.880Z"
//                 },
//                 "hostId": "68c9e08fb2e27952f4192c3e",
//                 "chatRoomName": "Real Madrid vs Barca",
//                 "totalMember": 0,
//                 "createdAt": "2025-10-15T20:41:44.978Z"
//             },
//       
//         ]
//     }
// }

// by hitting this url socket connection will be established and connected to the server 















// THIS IS EVENT ID FROM THE RESPONSE  "eventId": {
                    // "_id": "68f7cec11d72ab10fc26171c",

                    // AND THIS IS RECIVER ID FROM THE RESPONSE messages": [
            // {
                // "_id": "68f803128c80dec3d0861666", means messages arrays first user id 

//                 {
//     "success": true,
//     "message": "specific event waise conversation",
//     "data": {
//         "success": true,
//         "message": "Fetched all event-wise messages successfully",
//         "meta": {
//             "page": 1,
//             "limit": 10,
//             "total": 10,
//             "totalPage": 1
//         },
//         "messages": [
//             {
//                 "_id": "68f803128c80dec3d0861666",
//                 "text": "dmodu  ",
//                 "imageUrl": [],
//                 "audioUrl": "",
//                 "seen": false,
//                 "msgByUserId": {
//                     "_id": "68b76fca5941636d3fb7dfd1",
//                     "name": "Sohel Host",
//                     "email": "tidoh87712@skateru.com",
//                     "photo": null,
//                     "id": "68b76fca5941636d3fb7dfd1"
//                 },
//                 "conversationId": "68f5175042dff54619c9e244",
//                 "createdAt": "2025-10-21T22:02:58.221Z",
//                 "updatedAt": "2025-10-21T22:02:58.221Z"
//             },
//             {
//                 "_id": "68f802518c80dec3d0861658",
//                 "text": "dmodu  ",
//                 "imageUrl": [],
//                 "audioUrl": "",
//                 "seen": false,
//                 "msgByUserId": {
//                     "_id": "68b76fca5941636d3fb7dfd1",
//                     "name": "Sohel Host",
//                     "email": "tidoh87712@skateru.com",
//                     "photo": null,
//                     "id": "68b76fca5941636d3fb7dfd1"
//                 },
//                 "conversationId": "68f5175042dff54619c9e244",
//                 "createdAt": "2025-10-21T21:59:45.296Z",
//                 "updatedAt": "2025-10-21T21:59:45.296Z"
//             },
//             {
//                 "_id": "68f7ff998c80dec3d08615b1",
//                 "text": "dsafjhjsadhfjhasdk ",
//                 "imageUrl": [],
//                 "audioUrl": "",
//                 "seen": false,
//                 "msgByUserId": {
//                     "_id": "68b71e270256ddb0b89dd214",
//                     "name": "Rana Alamgir",
//                     "email": "info.sohelranaa@gmail.com",
//                     "photo": "src/public/images/1000000168-43463aea-8efa-4892-95b4-c233bcbeb857.jpg",
//                     "id": "68b71e270256ddb0b89dd214"
//                 },
//                 "conversationId": "68f5175042dff54619c9e244",
//                 "createdAt": "2025-10-21T21:48:09.001Z",
//                 "updatedAt": "2025-10-21T21:48:09.001Z"
//             },
//           
//         ]
//     }
// }