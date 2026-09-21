import { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2, BotMessageSquare, Trash2 } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const generateSessionId = () => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Xin chào! Mình là trợ lý AI. Bạn có thắc mắc gì về lòng biết ơn và hành vi ủng hộ xã hội không? Hay về vai trò trung gian của ý nghĩa cuộc sống? Mình sẵn sàng giúp bạn!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveChatMessage = async (message: string, role: 'user' | 'assistant') => {
    if (!user) return;

    try {
      await supabase.from('chat_history').insert({
        user_id: user.id,
        session_id: sessionId,
        message,
        role,
        title: 'Cuộc trò chuyện',
      });
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Xin chào! Mình là trợ lý AI. Bạn có thắc mắc gì về lòng biết ơn và hành vi ủng hộ xã hội không? Hay về vai trò trung gian của ý nghĩa cuộc sống? Mình sẵn sàng giúp bạn!',
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    await saveChatMessage(userMessage, 'user');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error('Chat API Error:', data);
        throw new Error(data.error || 'API request failed');
      }

      const aiResponse =
        data.reply ||
        'Xin lỗi, mình chưa thể trả lời câu hỏi này.';

      setMessages((prev) => [...prev, { role: 'assistant', content: aiResponse }]);
      await saveChatMessage(aiResponse, 'assistant');
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Xin lỗi, ${error.message || 'có lỗi xảy ra'}. Vui lòng thử lại sau!`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all z-50"
      >
        <BotMessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl z-50 transition-all ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}
    >
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 rounded-t-2xl flex justify-between">
        <span className="font-semibold flex items-center gap-2">
          <BotMessageSquare className="w-5 h-5" /> Trợ lý AI
        </span>
        <div className="flex gap-2">
          {!isMinimized && user && (
            <button
              onClick={clearChat}
              title="Xóa cuộc trò chuyện"
              className="hover:opacity-80 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 /> : <Minimize2 />}
          </button>
          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="h-[calc(100%-8rem)] overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="prose max-w-none text-sm">
                    <ReactMarkdown>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-4 border-t flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2"
              placeholder="Nhập câu hỏi của bạn..."
            />
            <button type="submit" disabled={!input.trim() || isLoading}>
              <Send />
            </button>
          </form>
        </>
      )}
    </div>
  );
}
