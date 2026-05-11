import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, BrainCircuit, User, Loader2 } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
  isStreaming?: boolean;
}

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      text: '¡Hola! Soy el asistente de IA de DevTech. Para poder proponerte un plan de acción acorde, cuéntame: ¿Cuáles son los principales cuellos de botella o dolores tecnológicos que enfrenta tu empresa actualmente?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputMessage.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) throw new Error('Error al enviar el mensaje');

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl h-[85vh] sm:h-[80vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                    <BrainCircuit className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 tracking-tight leading-none mb-1">
                      DevTech Discovery AI
                    </h3>
                    <p className="text-[11px] text-gray-500 font-medium uppercase tracking-widest">
                      Análisis Inicial
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                <div className="flex flex-col gap-6">
                  {messages.map((msg) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={msg.id}
                      className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                        msg.role === 'user' ? 'bg-blue-600' : 'bg-black'
                      }`}>
                        {msg.role === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <BrainCircuit className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-sm shadow-blue-600/10'
                          : 'bg-white text-gray-800 rounded-tl-none shadow-sm border border-gray-100'
                      }`}>
                        {msg.text.split('\n').map((line, i) => (
                          <span key={i}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-1">
                        <BrainCircuit className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-none px-5 py-4 shadow-sm border border-gray-100 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                        <span className="text-sm text-gray-500 font-medium">Analizando requerimientos...</span>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="p-4 sm:p-6 bg-white border-t border-gray-100">
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Describe los problemas o desafíos de tu empresa..."
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-full pl-6 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all font-medium placeholder:text-gray-400"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="absolute right-2 p-2.5 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-black transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="text-center mt-3">
                   <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                     Al chatear, la IA de DevTech generará un Brief de Proyecto automatizado
                   </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
