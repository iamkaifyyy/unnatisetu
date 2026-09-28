'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api';
import { Sparkles, MessageSquare, X, Send, Bot, User, RefreshCw, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
}

export default function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'AI',
      text: 'Namaste! I am your MoTA AI Sahayak. How can I assist you with scholarship schemes, eligibility rules, or document verification today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'USER',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await api.assistantChat(query);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'AI',
        text: res.reply || 'Thank you for your question. Please check official guidelines on dbttribal.gov.in.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'AI',
        text: 'MoTA Assistant is currently offline or updating. Please try again shortly or contact toll-free helpline 1800-11-7788.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* 1. Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-3 rounded-full bg-gradient-to-r from-[#0f2e5a] via-blue-900 to-[#0b1d3a] hover:from-blue-900 hover:to-[#0f2e5a] text-white font-extrabold text-xs flex items-center gap-2.5 shadow-2xl border-2 border-amber-400 hover:scale-105 transition-all group"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white"></span>
          </div>
          <span className="tracking-wider uppercase text-[11px]">MoTA AI Sahayak</span>
        </button>
      )}

      {/* 2. Floating Popup Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] bg-white rounded-xl shadow-2xl border-2 border-[#0f2e5a] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#0b1d3a] text-white p-3.5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                    MoTA AI Sahayak
                    <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">ONLINE</span>
                  </h3>
                  <p className="text-[10px] text-slate-300 font-medium">
                    Ministry of Tribal Affairs • Advisory Portal Bot
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="tricolor-ribbon absolute bottom-0 left-0 right-0"></div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[10px] scrollbar-none">
            <button
              onClick={() => handleSendMessage('What are the family income limits for ST schemes?')}
              className="px-2.5 py-1 rounded bg-white hover:bg-amber-50 text-[#0f2e5a] font-bold border border-slate-300 shrink-0 shadow-sm"
            >
              Income Caps
            </button>
            <button
              onClick={() => handleSendMessage('How to fix a document deficiency notice?')}
              className="px-2.5 py-1 rounded bg-white hover:bg-amber-50 text-[#0f2e5a] font-bold border border-slate-300 shrink-0 shadow-sm"
            >
              Deficiency Fix
            </button>
            <button
              onClick={() => handleSendMessage('Explain Post-Matric (BVOBC) scheme benefits')}
              className="px-2.5 py-1 rounded bg-white hover:bg-amber-50 text-[#0f2e5a] font-bold border border-slate-300 shrink-0 shadow-sm"
            >
              Post-Matric Info
            </button>
            <button
              onClick={() => handleSendMessage('What is the MoTA Student Helpline number?')}
              className="px-2.5 py-1 rounded bg-white hover:bg-amber-50 text-[#0f2e5a] font-bold border border-slate-300 shrink-0 shadow-sm"
            >
              Helpline
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-100/60 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-start ${msg.sender === 'USER' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-[10px] ${
                    msg.sender === 'USER' ? 'bg-[#0f2e5a]' : 'bg-gradient-to-tr from-amber-600 to-amber-500'
                  }`}
                >
                  {msg.sender === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[78%] p-3 rounded-xl space-y-1 shadow-sm ${
                    msg.sender === 'USER'
                      ? 'bg-[#0f2e5a] text-white rounded-tr-none font-medium'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 font-medium'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-[9px] block text-right font-semibold ${
                      msg.sender === 'USER' ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-slate-500 italic text-[11px] p-2 bg-white rounded border border-slate-200 w-fit">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0f2e5a]" />
                MoTA Assistant is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask MoTA AI Assistant..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={loading}
              className="flex-1 px-3.5 py-2 rounded-lg bg-slate-100 border border-slate-300 text-slate-800 text-xs outline-none focus:border-[#0f2e5a]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputMessage.trim()}
              className="p-2.5 rounded-lg bg-[#0f2e5a] hover:bg-[#1a365d] disabled:opacity-50 text-white shadow transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
