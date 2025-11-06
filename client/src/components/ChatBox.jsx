import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ socket, roomId, playerColor }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("receiveMessage");
  }, [socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("sendMessage", { roomId, message, sender: playerColor });
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[37rem] w-full md:w-[35rem] bg-[#1e1e1e] border border-[#3a3a3a] rounded-xl shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#3a3a3a]">
        <h3 className="text-sm font-semibold text-[#b8b8b8] tracking-wide uppercase">
          Chat
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-[#3a3a3a] scrollbar-track-transparent">
        {chat.map((msg, i) => {
          const isOwn = msg.sender === playerColor;
          return (
            <div
              key={i}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                  isOwn
                    ? "bg-[#3b82f6] text-white rounded-br-md"
                    : "bg-[#2a2a2a] text-[#e0e0e0] rounded-bl-md"
                }`}
              >
                {!isOwn && (
                  <span className="text-xs text-[#9a9a9a] block mb-1">
                    {msg.sender}
                  </span>
                )}
                <span>{msg.message}</span>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 px-4 py-3 bg-[#1e1e1e] border-t border-[#3a3a3a]"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Say something..."
          className="flex-1 bg-[#2a2a2a] text-[#e0e0e0] placeholder-[#6b6b6b] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#3b82f6] transition"
        />
        <button
          type="submit"
          className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
