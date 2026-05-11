import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function ChatModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<{role: 'user'|'model', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'model', content: data.reply || data.error }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'model', content: "Hubo un error de conexión." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
               <h3 className="font-bold text-slate-800">Asistente de Proyectos</h3>
               <p className="text-xs text-slate-500">Impulsado por Vertex AI Express</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-10">
               <Bot className="w-12 h-12 mx-auto mb-3 opacity-20" />
               <p>¡Hola! Soy tu asistente para la creación de proyectos.</p>
               <p className="text-sm mt-1 text-slate-400">Cuéntame tu idea y te ayudaré a definirla y estructurarla técnicamente.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'}`}>
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert prose-p:text-white prose-li:text-white' : ''}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 text-slate-500 rounded-2xl p-4 flex gap-1 items-center">
                 <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
                 <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                 <div className="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe tu mensaje..."
              className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-400 disabled:hover:bg-slate-400 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
