import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Loader2, SendHorizonal } from 'lucide-react';

function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('https://gemini-ai-assistant.onrender.com/chat', { message });
      const botReply = { sender: 'bot', text: res.data.reply };
      setChatHistory((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error:", error);
      const errorReply = { sender: 'bot', text: '❌ Error contacting Gemini API' };
      setChatHistory((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col items-center justify-center px-4 py-6 text-white">
      <div className="w-full max-w-2xl bg-[#1a1a1a] shadow-2xl rounded-xl flex flex-col h-[90vh] overflow-hidden border border-gray-700">
        <div className="p-4 border-b border-gray-700 text-center font-semibold text-xl bg-[#222] text-purple-400 shadow-sm">
          🤖 Gemini AI Assistant
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth custom-scroll bg-[#1a1a1a]">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm md:text-base leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-2xl animate-pulse text-sm">
                Typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="bg-[#222] border-t border-gray-700 p-4 flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-full bg-[#111] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <SendHorizonal size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
