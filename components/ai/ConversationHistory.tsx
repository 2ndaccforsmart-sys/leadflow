"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, MessageSquare, Trash2, Search, AlertTriangle, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  activeConvId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newTitle: string) => void;
}

function groupByDate(conversations: Conversation[]) {
  const now = new Date();
  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const older: Conversation[] = [];

  for (const conv of conversations) {
    const diff = now.getTime() - conv.timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) today.push(conv);
    else if (days === 1) yesterday.push(conv);
    else older.push(conv);
  }

  const groups: { label: string; items: Conversation[] }[] = [];
  if (today.length) groups.push({ label: "Today", items: today });
  if (yesterday.length) groups.push({ label: "Yesterday", items: yesterday });
  if (older.length) groups.push({ label: "Older", items: older });
  return groups;
}

function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function ConversationHistory({
  conversations,
  activeConvId,
  onSelect,
  onNew,
  onDelete,
  onRename,
}: ConversationHistoryProps) {
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const filtered = search
    ? conversations.filter(
        (c) =>
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  const groups = groupByDate(filtered);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      onDelete(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
  };

  const handleContextMenu = (e: React.MouseEvent, conv: Conversation) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(conv.id);
    setEditValue(conv.title);
  };

  const handleRenameSubmit = (id: string) => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== conversations.find((c) => c.id === id)?.title) {
      onRename(id, trimmed);
    }
    setEditingId(null);
    setEditValue("");
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRenameSubmit(id);
    } else if (e.key === "Escape") {
      handleRenameCancel();
    }
  };

  // Focus input when entering edit mode
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  return (
    <div className="flex h-full flex-col border-r border-border/60 bg-card/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Conversations</h2>
        <button
          onClick={onNew}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground/60 transition-all duration-150 hover:bg-muted/60 hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-lg border border-border/40 bg-muted/30 py-1.5 pl-8 pr-3 text-xs outline-none transition-all duration-150 placeholder:text-muted-foreground/40 focus:border-ring focus:bg-muted/50 focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Delete confirmation banner */}
      {confirmDeleteId && (
        <div className="mx-2 mb-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground">Delete conversation?</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground/70">
                This conversation and all its messages will be permanently removed.
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-end gap-1.5">
            <button
              onClick={handleCancelDelete}
              className="rounded-md px-2.5 py-1 text-[11px] font-medium text-muted-foreground/70 transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="rounded-md bg-destructive px-2.5 py-1 text-[11px] font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="h-7 w-7 text-muted-foreground/30" />
            <p className="mt-2 text-[11px] text-muted-foreground/50">
              {search ? "No matches found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <div key={group.label}>
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => {
                        if (editingId !== conv.id) onSelect(conv.id);
                      }}
                      onContextMenu={(e) => handleContextMenu(e, conv)}
                      className={cn(
                        "group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150",
                        conv.id === activeConvId
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-foreground/80 hover:bg-muted/50"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        {editingId === conv.id ? (
                          <input
                            ref={editInputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={() => handleRenameSubmit(conv.id)}
                            onKeyDown={(e) => handleRenameKeyDown(e, conv.id)}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                              "w-full rounded border bg-background px-1.5 py-0.5 text-[13px] font-medium outline-none ring-1 ring-ring",
                              conv.id === activeConvId
                                ? "text-primary-foreground"
                                : "text-foreground"
                            )}
                          />
                        ) : (
                          <p className="truncate text-[13px] font-medium">
                            {conv.title}
                          </p>
                        )}
                      </div>
                      {editingId !== conv.id && (
                        <>
                          <span
                            className={cn(
                              "flex-shrink-0 text-[10px]",
                              conv.id === activeConvId
                                ? "text-primary-foreground/60"
                                : "text-muted-foreground/40"
                            )}
                          >
                            {formatRelativeTime(conv.timestamp)}
                          </span>
                          <button
                            onClick={(e) => handleDeleteClick(e, conv.id)}
                            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
