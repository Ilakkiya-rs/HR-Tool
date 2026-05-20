"use client";
import { useEffect, useState } from "react";
import { Send, Smile, Paperclip, Mic } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export default function MessagePage() {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("logedinUserDetail"));
  const loggedInUserId = userDetails?.individual_profile_id;

  // Fetch conversations
  const fetchConversations = async () => {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/messages/conversations/${loggedInUserId}/`);
    const res = await fetch(`https://api.myskillsplus.com/messages/conversations/${loggedInUserId}/`);
    const data = await res.json();
    const uniqueConversations = [];
    const seenUserIds = new Set();

    for (const conv of data) {
      if (!seenUserIds.has(conv.user.id)) {
        uniqueConversations.push(conv);
        seenUserIds.add(conv.user.id);
      }
    }
    setConversations(uniqueConversations);
    if (!activeChat && uniqueConversations.length) {
      setActiveChat(uniqueConversations[0]);
    }
  };

  const updateConversationLastMessage = (toUserId, newText) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.user.id === toUserId
          ? {
              ...conv,
              last_message: { text: newText, time: new Date().toISOString() },
            }
          : conv
      )
    );
  };

  // Fetch messages
  const fetchMessages = async (userId) => {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/messages/${userId}/${loggedInUserId}/`);
    const res = await fetch(`https://api.myskillsplus.com/messages/${userId}/${loggedInUserId}/`);
    const data = await res.json();
    setMessages(data);
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;

    const newMsg = {
      sender: { id: loggedInUserId },
      text: input.trim(),
      seen: false,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/messages/send/`, {
    await fetch("https://api.myskillsplus.com/messages/send/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to_user_id: activeChat.user.id,
        from_user_id: loggedInUserId,
        message: newMsg.text,
      }),
    });
    updateConversationLastMessage(activeChat.user.id, input.trim());
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat.user.id);
      const interval = setInterval(() => {
        fetchMessages(activeChat.user.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  const encodeUserName = (name) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
      hash = (hash << 5) - hash + name.charCodeAt(i);
      hash = hash & hash;
    }
  
    let num = Math.abs(hash);
    let encoded = '';
  
    while (num > 0) {
      encoded = chars[num % 62] + encoded;
      num = Math.floor(num / 62);
    }
  
    return encoded || '0';
  };

  return (
    <>
      {conversations.length > 0 ? (
        <div className="flex h-[75vh] gap-5">
            {/* Sidebar */}
            <div className="w-1/3 bg-white border border-[#d3d8df] rounded-2xl overflow-y-auto">
              <h2 className="text-lg font-bold px-4 py-4 bg-[#075e54] text-white">All Messages</h2>
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveChat(conv);
                    fetchMessages(conv.user.id);
                  }}
                  className={`px-4 py-3 cursor-pointer ${
                    activeChat?.id === conv.id ? "bg-blue-50" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold">{(conv.user.id)}</div>
                  </div>
                  <div className="text-sm text-gray-500">{conv.last_message?.text || "No messages yet"}</div>
                </div>
              ))}
            </div>
            {/* Chat Window */}
            <div className="flex-1 bg-white flex flex-col rounded-2xl shadow-sm">
              <div className="bg-[#128c7e] text-white px-4 py-3 rounded-t-2xl">
                <div className="text-lg font-semibold">{(activeChat?.user?.id || "Select User")}</div>
                <span className="text-green-400 text-sm">Online</span>
              </div>

              <div className="flex-1 bg-[#dcf8c6] p-4 overflow-y-auto space-y-3">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender.id === loggedInUserId ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 text-sm flex flex-col ${
                        msg.sender.id === loggedInUserId
                          ? "bg-[#e3ffcc] text-black items-end"
                          : "bg-[#EEF1F3] text-black items-start"
                      }`}
                    >
                      <p className="w-full">{msg.text}</p>
                      <span className="mt-1 text-[11px] text-gray-500 self-end">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        {msg.seen && "✔✔"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Field */}
              <div className="px-4 py-3 flex items-center gap-2 relative">
                <div className="relative">
                  <Smile
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                  />
                  {showEmojiPicker && (
                    <div className="absolute bottom-10 left-0 z-50 shadow-lg">
                      <EmojiPicker
                        onEmojiClick={(emoji) => setInput((prev) => prev + emoji.emoji)}
                        height={350}
                      />
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const fileMessage = {
                        sender: { id: loggedInUserId },
                        text: `📎 ${file.name}`,
                        timestamp: new Date().toISOString(),
                        seen: false,
                      };
                      setMessages((prev) => [...prev, fileMessage]);
                    }
                  }}
                />
                <label htmlFor="file-upload">
                  <Paperclip className="text-gray-500 cursor-pointer" />
                </label>

                <input
                  type="text"
                  placeholder="Type message"
                  className="flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                <Mic
                  className="text-gray-500 cursor-pointer"
                  onClick={() => alert("Voice recording not implemented")}
                />
                <button
                  onClick={handleSend}
                  className="bg-[#25d366] p-2 rounded-full text-white"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12">
          <img src="/images/logo/no-data.png" alt="No Data" className="w-48 mb-2" />
          <h3 className="font-semibold text-black text-lg">No Conversations</h3>
          <p className="text-gray-500 text-sm text-center">You currently have no conversations. Start a new chat to see messages here.</p>
        </div>
      )}
    </>
  );
}