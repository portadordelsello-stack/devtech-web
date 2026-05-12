import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function ChatWidget({ 
  title = "Asistente de Proyectos", 
  subtitle = "Impulsado por Vertex AI", 
  showClose = false, 
  onClose,
  initialMessages = [],
  onMessagesChange
}: { 
  title?: string, 
  subtitle?: string, 
  showClose?: boolean, 
  onClose?: () => void,
  initialMessages?: {role: 'user'|'model', content: string}[],
  onMessagesChange?: (messages: {role: 'user'|'model', content: string}[]) => void
}) {
  const [messages, setMessages] = useState<{role: 'user'|'model', content: string}[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    if (onMessagesChange) onMessagesChange(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history: messages })
      });
      const data = await res.json();
      const finalMessages = [...newMessages, { role: 'model' as const, content: data.reply || data.error }];
      setMessages(finalMessages);
      if (onMessagesChange) onMessagesChange(finalMessages);
    } catch (error) {
      const errorMessages = [...newMessages, { role: 'model' as const, content: "Hubo un error de conexión." }];
      setMessages(errorMessages);
      if (onMessagesChange) onMessagesChange(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
        <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
               <h3 className="font-bold text-sm text-slate-800">{title}</h3>
               <p className="text-[10px] text-slate-500">{subtitle}</p>
            </div>
          </div>
          {showClose && onClose && (
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.length === 0 && (
            <div className="text-center text-slate-400 mt-4">
               <Bot className="w-8 h-8 mx-auto mb-2 opacity-20" />
               <p className="text-sm">¡Hola! Soy tu asistente.</p>
               <p className="text-xs mt-1 text-slate-400">Cuéntame tu idea y te ayudaré.</p>
            </div>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
              </div>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-800'}`}>
                  <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert prose-p:text-white prose-li:text-white' : ''}`}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bot className="w-3 h-3" />
              </div>
              <div className="bg-slate-100 text-slate-500 rounded-2xl p-3 flex gap-1 items-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Escribe..."
              className="w-full pl-3 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="absolute right-1 p-1.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-400 disabled:hover:bg-slate-400 transition"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
    </div>
  );
}

export function ChatModal({ 
  isOpen, 
  onClose,
  initialMessages = [],
  onMessagesChange 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  initialMessages?: {role: 'user'|'model', content: string}[];
  onMessagesChange?: (messages: {role: 'user'|'model', content: string}[]) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
         <ChatWidget showClose={true} onClose={onClose} initialMessages={initialMessages} onMessagesChange={onMessagesChange} />
      </div>
    </div>
  );
}
