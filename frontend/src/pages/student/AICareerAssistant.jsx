import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  AlertCircle,
  HelpCircle,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { aiService } from '../../services/aiService.js';
import Button from '../../components/common/Button.jsx';

const AICareerAssistant = () => {
  const { user, student } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello ${user?.name || 'Student'}! 👋 I am your dedicated AI Career & Placement Copilot.\n\nI can assist you with:\n- 🎯 **Technical & HR Interview Preparation** (DSA, OOP, SQL, Behavioral STAR answers)\n- 📄 **ATS Resume Optimization & Action Verbs**\n- ⚡ **Personalized Learning Sequences & Roadmaps**\n- 🏢 **Placement Drive Eligibility & Strategy**\n\nHow can I help you succeed in campus recruitment today?`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    'How do I answer "Tell me about yourself" for a software role?',
    'Top 5 SQL queries asked in technical placement interviews',
    'What should I prioritize between React and DSA for placements?',
    'Explain the STAR technique with a computer science project example',
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText = null) => {
    const textToSend = typeof messageText === 'string' ? messageText : input;
    if (!textToSend || !textToSend.trim()) return;

    const userMsg = {
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (typeof messageText !== 'string') setInput('');
    setLoading(true);

    try {
      const res = await aiService.sendChatMessage(textToSend.trim(), messages);
      if (res.success && res.response) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: res.response.reply,
            disclaimer: res.response.disclaimer,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Apologies, I encountered an issue preparing guidance. Please check your query or try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] space-y-4">
      {/* Header Banner */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-900 via-primary-800 to-indigo-900 p-5 text-white shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-200">
            <Sparkles className="w-5 h-5 text-blue-300 animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold">AI Career & Placement Assistant</h1>
            <p className="text-xs text-blue-200">
              Interactive interview coach, technical strategy advisor and resume consultant
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-[11px] font-semibold bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30 text-blue-200">
            BCA Career Advisor Model
          </span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 rounded-xl border border-slate-200 bg-white flex flex-col overflow-hidden shadow-xs">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${
                  isUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-primary-800 text-white'
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-primary-800 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {m.text}

                  {m.disclaimer && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 text-[10px] text-slate-500 italic">
                      ⚠️ {m.disclaimer}
                    </div>
                  )}

                  <div
                    className={`mt-1.5 text-[10px] ${
                      isUser ? 'text-slate-300' : 'text-slate-400'
                    }`}
                  >
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-none bg-slate-50 border border-slate-200 text-xs text-slate-500">
                AI Assistant is formulating personalized placement insights...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="border-t border-slate-100 bg-slate-50/70 p-2.5 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pl-1 whitespace-nowrap">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Prompts:
          </span>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-700 text-[11px] font-medium text-slate-600 whitespace-nowrap transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200 p-3 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask for interview prep tips, mock coding questions, or career strategy..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-600"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={loading || !input.trim()}
              className="rounded-xl"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-2 text-center text-[10px] text-slate-400">
            Advisory Notice: AI suggestions are for guidance only and do not determine official college placement selection.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AICareerAssistant;
