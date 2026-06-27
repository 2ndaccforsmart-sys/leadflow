"use client";

import { useState } from "react";
import { Send, Sparkles, Copy, Check, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ConversationViewProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isStreaming?: boolean;
}

export function ConversationView({
  messages,
  onSendMessage,
  isStreaming,
}: ConversationViewProps) {
  const [inputValue, setInputValue] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "group flex gap-4",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  message.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-primary text-primary-foreground"
                )}
              >
                {message.role === "user" ? "D" : <Sparkles className="h-4 w-4" />}
              </div>

              {/* Content */}
              <div
                className={cn(
                  "flex max-w-[85%] flex-col gap-1",
                  message.role === "user" && "items-end"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-foreground text-background"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>

                {/* Actions */}
                {message.role === "assistant" && (
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleCopy(message.id, message.content)}
                      className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {copiedId === message.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                    <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <button className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Streaming indicator */}
          {isStreaming && (
            <div className="flex gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl bg-muted px-4 py-3">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/60" />
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-background px-4 py-4">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your leads..."
              rows={1}
              className="w-full resize-none rounded-xl border border-border bg-muted/50 px-4 py-3 pr-12 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:bg-muted/80 focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={cn(
                "absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition-all duration-200",
                inputValue.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground/40"
              )}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
