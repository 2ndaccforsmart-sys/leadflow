"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ConversationHistory } from "@/components/ai/ConversationHistory";
import { SuggestedPrompts } from "@/components/ai/SuggestedPrompts";
import { cn } from "@/lib/utils";

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

const mockConversations: Conversation[] = [
  {
    id: "1",
    title: "Dental practices in Austin",
    lastMessage: "Found 12 high-quality leads...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    messages: [
      {
        id: "1",
        role: "user",
        content: "Find dental practices in Austin with 10+ employees",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "I found 12 dental practices in Austin with 10+ employees. Here are the top prospects:\n\n1. **Smile Bright Dental** - 12 employees, $2.4M revenue, AI Score: 94\n2. **Pecan Street Dental** - 15 employees, $3.1M revenue, AI Score: 82\n3. **Barton Springs Dental** - 10 employees, $2.0M revenue, AI Score: 71\n\nThese practices show strong indicators for lead generation. Would you like me to draft outreach emails for any of them?",
        timestamp: new Date(Date.now() - 1000 * 60 * 29),
      },
    ],
  },
  {
    id: "2",
    title: "Cold email strategy",
    lastMessage: "Here's a personalized template...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    messages: [],
  },
  {
    id: "3",
    title: "Market analysis - Texas dental",
    lastMessage: "The Texas dental market is valued at...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    messages: [],
  },
];

export default function AssistantPage() {
  const [conversations, setConversations] = useState(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const messages = activeConv?.messages || [];

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
      // Create new conversation
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
      // Add message to existing conversation
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

    // Get all messages for API call
    const conv = conversations.find((c) => c.id === currentConvId);
    const apiMessages = [
      ...(conv?.messages || []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user" as const, content },
    ];

    // Stream AI response
    setIsStreaming(true);
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

      // Add empty assistant message
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
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantContent += parsed.content;
                  // Update the assistant message with streamed content
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
    } catch (error) {
      console.error("Chat error:", error);
      // Add error message
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
    <AppLayout>
      <div className="flex h-[calc(100vh-8rem)] -m-8">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <ConversationHistory
            conversations={conversations}
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
                {/* Header */}
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h1 className="mt-4 text-2xl font-semibold tracking-tight">
                    How can I help?
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ask me anything about finding leads, drafting emails, or
                    analyzing markets.
                  </p>
                </div>

                {/* Suggested prompts */}
                <SuggestedPrompts onSelect={handleSendMessage} />

                {/* Input */}
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
                    className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm shadow-sm outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-1 focus:ring-ring"
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
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-muted-foreground/40"
                    )}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Conversation view */
            <div className="flex flex-1 flex-col overflow-hidden">
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
                            "whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed",
                            message.role === "user"
                              ? "bg-foreground text-background"
                              : "bg-muted text-foreground"
                          )}
                        >
                          {message.content}
                        </div>
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

                  <div ref={messagesEndRef} />
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
                          if (inputValue.trim() && !isStreaming) {
                            handleSendMessage(inputValue.trim());
                            setInputValue("");
                          }
                        }
                      }}
                      placeholder="Ask about your leads..."
                      rows={1}
                      className="w-full resize-none rounded-xl border border-border bg-muted/50 px-4 py-3 pr-12 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:bg-muted/80 focus:ring-1 focus:ring-ring"
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
          )}
        </div>
      </div>
    </AppLayout>
  );
}
