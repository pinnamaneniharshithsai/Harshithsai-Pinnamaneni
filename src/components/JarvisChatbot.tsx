import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Terminal, Loader2, Sparkles } from "lucide-react";

interface JarvisChatbotProps {
  primaryColor: string;
  userName: string;
  onSetChattingActive: (active: boolean) => void;
  onQuickCommand: (cmd: string) => void;
}

export default function JarvisChatbot({ primaryColor, userName, onSetChattingActive, onQuickCommand }: JarvisChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      role: "model",
      text: `Good morning, Sir. All sensory arrays represent operational baselines. The MARK XLII suit is loaded on active standby. How can J.A.R.V.I.S. assist you today?`,
      timestamp: "06:54:11",
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Suggestions that users can click to easily trigger JARVIS
  const suggestedCommands = [
    { label: "REACTOR REPORT", prompt: "Give me an Arc Reactor thermal and power stabilization report." },
    { label: "SUIT CODES", prompt: "Explain the weapon deployment capabilities of the Mark XLII armor." },
    { label: "TECTORIAL READS", prompt: "Review global tectonic grid plates and identify safe zones." }
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    onSetChattingActive(true);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send history up to the last 6 messages to stay concise and snappy
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6).map((msg) => ({
            role: msg.role,
            text: msg.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Stitch cognitive array connection severed.");
      }

      const data = await response.json();
      const modelAnswer = data.text || "I was unable to resolve that query within secure parameters, Sir.";

      const jarvisMsg: ChatMessage = {
        id: `jarvis-${Date.now()}`,
        role: "model",
        text: modelAnswer,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };

      setMessages((prev) => [...prev, jarvisMsg]);

      // Check if there's any technical terms in response to trigger other actions
      if (modelAnswer.toUpperCase().includes("REACTOR") || modelAnswer.toUpperCase().includes("GW")) {
        onQuickCommand("REACTOR_UPDATE");
      }
    } catch (error: any) {
      console.error(error);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        text: `Cognitive connection fluctuation, Sir. Error: ${error.message || "Uplink severed."}. However, my core subroutines will try to recover standard protocols immediately.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      // Let wave indicator calm down after 2 seconds
      setTimeout(() => {
        onSetChattingActive(false);
      }, 1800);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <div className="glass-panel p-4 flex flex-col h-full relative">
      {/* Bot Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 animate-pulse" style={{ color: primaryColor }} />
          <span className="font-label-caps text-[9px] font-bold uppercase tracking-widest text-white">
            Aegis Intelligence interface
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: loading ? "#ef4444" : primaryColor }} />
          <span className="text-[7.5px] font-mono text-white/70 uppercase select-none font-bold">
            {loading ? "PROCESSING COGNITIVE DATA" : "HUD UPLINK ACTIVE"}
          </span>
        </div>
      </div>

      {/* Suggested commands shelf */}
      <div className="flex flex-wrap gap-1 mb-2">
        {suggestedCommands.map((sc, idx) => (
          <button
            id={`btn-suggest-${idx}`}
            key={idx}
            onClick={() => sendMessage(sc.prompt)}
            className="text-[7.5px] font-mono border border-white/10 hover:border-white/30 text-white/70 hover:text-white px-1.5 py-0.5 rounded uppercase tracking-wider bg-black/30 hover:bg-white/5 transition-all cursor-pointer"
          >
            {sc.label}
          </button>
        ))}
      </div>

      {/* Messages viewport */}
      <div className="flex-grow space-y-3 overflow-y-auto pr-1.5 custom-scrollbar mb-2 text-left">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div key={msg.id} className={`flex gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div
                  className="w-7 h-7 rounded border flex-shrink-0 flex items-center justify-center bg-black/40"
                  style={{ borderColor: primaryColor }}
                >
                  <Sparkles size={11} style={{ color: primaryColor }} />
                </div>
              )}

              <div
                style={{
                  borderLeftColor: !isUser ? primaryColor : "rgba(255,255,255,0.15)",
                  borderRightColor: isUser ? primaryColor : "rgba(255,255,255,0.15)",
                }}
                className={`p-2.5 max-w-[85%] rounded-md ${
                  isUser
                    ? "bg-[#00f0ff]/5 text-[#e3e1e9] border-r-2"
                    : "bg-surface-container-high/50 text-[#e3e1e9] border-l-2"
                }`}
              >
                <div className="flex justify-between items-center text-[7px] font-mono opacity-50 mb-0.5 gap-4">
                  <span className="font-bold uppercase tracking-widest">{isUser ? userName : "J.A.R.V.I.S."}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <p className="font-mono text-[10px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-2 justify-start items-center">
            <div
              className="w-7 h-7 rounded border flex-shrink-0 flex items-center justify-center bg-black/40"
              style={{ borderColor: primaryColor }}
            >
              <Loader2 size={11} className="animate-spin text-white" style={{ color: primaryColor }} />
            </div>
            <div className="p-2 py-1.5 bg-black/40 rounded-md border-l-2 border-dashed border-white/20 text-[9px] font-mono opacity-60">
              J.A.R.V.I.S. is formatting telemetry grids...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input controls form */}
      <form onSubmit={handleFormSubmit} className="mt-auto border-t border-white/5 pt-2 flex items-center gap-1.5">
        <input
          id="input-command"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="SEND COMMAND VOICE OR QUERY TERMINAL..."
          className="bg-black/40 border border-white/10 px-2 py-1 text-[9.5px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent flex-grow text-white uppercase font-mono h-8 tracking-widest"
        />
        <button
          id="btn-send-message"
          type="submit"
          disabled={loading || !inputText.trim()}
          style={{
            backgroundColor: inputText.trim() ? primaryColor : "transparent",
            borderColor: inputText.trim() ? primaryColor : "rgba(255,255,255,0.1)",
          }}
          className="w-8 h-8 flex items-center justify-center border hover:bg-white/10 transition-colors cursor-pointer group disabled:opacity-40"
        >
          <Send
            size={11}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            style={{ color: inputText.trim() ? "#00363a" : "#fff" }}
          />
        </button>
      </form>
    </div>
  );
}
