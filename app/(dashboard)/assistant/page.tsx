"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Sparkles, Send } from "lucide-react";
import { ConversationHistory } from "@/components/ai/ConversationHistory";
import { SuggestedPrompts } from "@/components/ai/SuggestedPrompts";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

const mockConversations: Conversation[] = [];

export default function AssistantPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const messages = useMemo(() => activeConv?.messages || [], [activeConv]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "New conversation",
      lastMessage: "",
      timestamp: new Date(),
      messages: [],
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter((c) => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    let currentConvId = activeConvId;

    if (!currentConvId) {
      const newConv: Conversation = {
        id: Date.now().toString(),
        title: content.slice(0, 40) + (content.length > 40 ? "..." : ""),
        lastMessage: content,
        timestamp: new Date(),
        messages: [
          {
            id: Date.now().toString(),
            role: "user",
            content,
            timestamp: new Date(),
          },
        ],
      };
      setConversations([newConv, ...conversations]);
      currentConvId = newConv.id;
      setActiveConvId(currentConvId);
    } else {
      setConversations(
        conversations.map((c) => {
          if (c.id === currentConvId) {
            const newMessage: Message = {
              id: Date.now().toString(),
              role: "user",
              content,
              timestamp: new Date(),
            };
            return {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessage: content,
              timestamp: new Date(),
            };
          }
          return c;
        })
      );
    }

    const conv = conversations.find((c) => c.id === currentConvId);
    const apiMessages = [
      ...(conv?.messages || []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user" as const, content },
    ];

    setIsStreaming(true);
    const existingConv = conversations.find((c) => c.id === currentConvId);
    const isFirstResponse = !existingConv || existingConv.messages.length === 1;
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      const assistantMsgId = (Date.now() + 1).toString();
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConvId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: assistantMsgId,
                  role: "assistant" as const,
                  content: "",
                  timestamp: new Date(),
                },
              ],
            };
          }
          return c;
        })
      );

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6).trim();
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantContent += parsed.content;
                  setConversations((prev) =>
                    prev.map((c) => {
                      if (c.id === currentConvId) {
                        return {
                          ...c,
                          messages: c.messages.map((m) =>
                            m.id === assistantMsgId
                              ? { ...m, content: assistantContent }
                              : m
                          ),
                        };
                      }
                      return c;
                    })
                  );
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Generate AI title on first response
      if (isFirstResponse && assistantContent) {
        fetch("/api/chat/title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstMessage: content, responseText: assistantContent }),
        })
          .then((res) => res.json())
          .then(({ title }) => {
            if (title) {
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === currentConvId ? { ...c, title } : c
                )
              );
            }
          })
          .catch(() => {});
      }
    } catch (error) {
      console.error("Chat error:", error);
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === currentConvId) {
            return {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: (Date.now() + 2).toString(),
                  role: "assistant" as const,
                  content: "Sorry, I encountered an error. Please try again.",
                  timestamp: new Date(),
                },
              ],
            };
          }
          return c;
        })
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-7rem)] -m-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <ConversationHistory
            conversations={conversations}
            activeConvId={activeConvId}
            onSelect={handleSelectConversation}
            onNew={handleNewConversation}
            onDelete={handleDeleteConversation}
          />
        </div>

        {/* Main area */}
        <div className="flex flex-1 flex-col">
          {!activeConvId ? (
            /* Empty state - centered prompt */
            <div className="flex flex-1 flex-col items-center justify-center px-4">
              <div className="w-full max-w-2xl space-y-8">
                <FadeIn delay={0} y={10} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="mt-4 text-2xl font-bold tracking-tight">
                    How can I help?
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground/70">
                    Ask me anything about finding leads, drafting emails, or
                    analyzing markets.
                  </p>
                </FadeIn>

                <FadeIn delay={0.1} y={12}>
                  <SuggestedPrompts onSelect={handleSendMessage} />
                </FadeIn>

                <FadeIn delay={0.2} y={14}>
                  <div className="relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (inputValue.trim() && !isStreaming) {
                            handleSendMessage(inputValue.trim());
                            setInputValue("");
                          }
                        }
                      }}
                      placeholder="Ask about your leads..."
                      rows={1}
                      className="w-full resize-none rounded-xl border border-border/60 bg-card px-4 py-3 pr-12 text-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)] outline-none transition-all duration-150 placeholder:text-muted-foreground/50 focus:border-ring focus:bg-muted/30 focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={() => {
                        if (inputValue.trim() && !isStreaming) {
                          handleSendMessage(inputValue.trim());
                          setInputValue("");
                        }
                      }}
                      disabled={!inputValue.trim() || isStreaming}
                      className={cn(
                        "absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition-all duration-200",
                        inputValue.trim() && !isStreaming
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                          : "text-muted-foreground/30"
                      )}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </FadeIn>
              </div>
            </div>
          ) : (
            /* Conversation view */
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="mx-auto max-w-3xl space-y-5">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "group flex gap-3",
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
                        {message.role === "user" ? (
                          "D"
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
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
                            "whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
                            message.role === "user"
                              ? "bg-foreground text-background"
                              : "bg-muted/60 text-foreground"
                          )}
                        >
                          {message.role === "assistant" ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none text-[14px] leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-[14px] [&_p]:text-[14px] [&_p]:leading-relaxed [&_p]:m-0 [&_code]:rounded [&_code]:bg-muted/80 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[13px] [&_pre]:rounded-xl [&_pre]:bg-muted/80 [&_pre]:p-4 [&_pre]:text-[13px] [&_pre]:overflow-x-auto [&_h1]:text-base [&_h2]:text-[15px] [&_h3]:text-[14px] [&_strong]:font-semibold">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <>{message.content}</>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Streaming indicator */}
                  {isStreaming && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-2xl bg-muted/60 px-4 py-2.5">
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50" />
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-border/40 bg-background/80 px-4 py-3.5 backdrop-blur-sm">
                <div className="mx-auto max-w-3xl">
                  <div className="relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (inputValue.trim() && !isStreaming) {
                            handleSendMessage(inputValue.trim());
                            setInputValue("");
                          }
                        }
                      }}
                      placeholder="Ask about your leads..."
                      rows={1}
                      className="w-full resize-none rounded-xl border border-border/60 bg-muted/30 px-4 py-3 pr-12 text-sm outline-none transition-all duration-150 placeholder:text-muted-foreground/50 focus:border-ring focus:bg-muted/50 focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={() => {
                        if (inputValue.trim() && !isStreaming) {
                          handleSendMessage(inputValue.trim());
                          setInputValue("");
                        }
                      }}
                      disabled={!inputValue.trim() || isStreaming}
                      className={cn(
                        "absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg transition-all duration-200",
                        inputValue.trim() && !isStreaming
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                          : "text-muted-foreground/30"
                      )}
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-center text-[10px] text-muted-foreground/40">
                    AI can make mistakes. Verify important information.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
