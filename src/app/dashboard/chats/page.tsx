"use client";

import { useState } from "react";
import { mockChats } from "@/utils/data";
import { formatRelativeTime } from "@/utils/format";
import type { Chat } from "@/types";

const ME_ID = "u1";

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeId, setActiveId] = useState<string>(chats[0]?.id ?? null);
  const [draft, setDraft] = useState("");

  const activeChat = chats.find((c) => c.id === activeId) ?? null;

  function selectChat(id: string) {
    setActiveId(id);
    setChats((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, messages: c.messages.map((m) => ({ ...m, read: true })) } : c
      )
    );
  }

  function sendMessage() {
    const text = draft.trim();
    if (!text || !activeChat) return;

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `m-${Date.now()}`,
                  senderId: ME_ID,
                  content: text,
                  sentAt: new Date().toISOString(),
                  read: true,
                },
              ],
            }
          : c
      )
    );
    setDraft("");
  }

  const unreadCounts = chats.map((c) => ({
    id: c.id,
    count: c.messages.filter((m) => !m.read && m.senderId !== ME_ID).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Chats</h1>
        <p className="mt-1 text-muted">
          Conversaciones con los vecinos que respondieron tus solicitudes.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <div className="space-y-2">
          {chats.map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const unread = unreadCounts.find((u) => u.id === chat.id)?.count ?? 0;
            const active = chat.id === activeChat?.id;

            return (
              <button
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                  active
                    ? "border-primary/40 bg-primary-light/50"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted-light text-xl">
                  {chat.participantAvatar}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {chat.participantName}
                    </p>
                    {lastMessage && (
                      <span className="shrink-0 text-xs text-muted">
                        {formatRelativeTime(lastMessage.sentAt)}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted">
                    {lastMessage?.content}
                  </p>
                  {chat.requestTitle && (
                    <p className="mt-0.5 truncate text-xs text-primary/70">
                      sobre: {chat.requestTitle}
                    </p>
                  )}
                </div>
                {unread > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-white">
                    {unread}
                  </span>
                )}
              </button>
            );
          })}

          {chats.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <p className="text-3xl">💭</p>
              <p className="mt-2 text-sm font-medium text-foreground">Sin conversaciones</p>
            </div>
          )}
        </div>

        <div className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-card">
          {activeChat ? (
            <>
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted-light text-lg">
                  {activeChat.participantAvatar}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {activeChat.participantName}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {activeChat.participantNeighborhood}
                    {activeChat.requestTitle && ` · ${activeChat.requestTitle}`}
                  </p>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto bg-background/50 p-4">
                {activeChat.messages.map((message) => {
                  const mine = message.senderId === ME_ID;
                  return (
                    <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          mine
                            ? "rounded-br-md bg-primary text-white"
                            : "rounded-bl-md bg-muted-light text-foreground"
                        }`}
                      >
                        <p className="text-sm leading-5 whitespace-pre-line">{message.content}</p>
                        <p className={`mt-1 text-right text-[10px] ${mine ? "text-white/70" : "text-muted"}`}>
                          {formatRelativeTime(message.sentAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 border-t border-border p-3">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
                />
                <button
                  onClick={sendMessage}
                  className="rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition-colors disabled:opacity-50"
                  disabled={!draft.trim()}
                >
                  Enviar
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
              <p className="text-3xl">💬</p>
              <p className="mt-2 font-medium text-foreground">Selecciona una conversación</p>
              <p className="mt-1 text-sm text-muted">
                Elige un chat para ver los mensajes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}