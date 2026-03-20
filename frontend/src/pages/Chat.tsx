import React, { useState, useRef, useEffect, useCallback } from "react";
import { Typography, Tag, Avatar, Spin, Collapse, Tooltip } from "antd";
import {
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  StopOutlined,
  PlusOutlined,
  DeleteOutlined,
  MessageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  Legend, ResponsiveContainer,
} from "recharts";

const { Title, Text, Paragraph } = Typography;
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ChartSeries { key: string; label: string; color: string; }
interface ChartData {
  chart_type: "bar" | "line" | "pie";
  title: string; x_label: string; y_label: string;
  data: Record<string, any>[]; series: ChartSeries[];
}
interface Source {
  title: string; content_snippet: string; source_file: string;
  doc_type: string; page_start: number; score: number; url?: string;
}
interface Message {
  id: string; type: "user" | "ai"; content: string; timestamp: Date;
  sources?: Source[]; chart_data?: ChartData;
  rewritten_query?: string; latency_ms?: number; error?: boolean;
}
interface Conversation {
  id: string; title: string; created_at: string;
  updated_at: string; message_count: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const DOC_TYPE_COLOR: Record<string, string> = {
  stats: "blue", policy: "green", legal: "orange", news: "purple", web: "cyan",
};
const PIE_COLORS = ["#4f86c6","#e05c5c","#5cb85c","#f0a500","#9b59b6","#1abc9c"];
const SUGGESTED = [
  "What are the trends in gender-based violence in Rwanda?",
  "How has women's economic empowerment changed since 2015?",
  "What does Rwanda's national gender policy say about education?",
  "Compare maternal health indicators across provinces",
  "What are Rwanda's commitments under CEDAW?",
  "How does girls' school enrollment compare to boys'?",
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── SourceCard ─────────────────────────────────────────────────────────────────
const SourceCard: React.FC<{ source: Source; index: number }> = ({ source, index }) => (
  <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-xs">
    <div className="flex items-start justify-between gap-2 mb-1">
      <div className="flex items-center gap-1.5 font-medium text-gray-800 flex-1 min-w-0">
        <FileTextOutlined className="text-gray-400 shrink-0" />
        <span className="truncate">[{index + 1}] {source.source_file}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Tag color={DOC_TYPE_COLOR[source.doc_type] ?? "default"} className="text-xs m-0">
          {source.doc_type}
        </Tag>
        {source.page_start > 0 && <span className="text-gray-400">p.{source.page_start}</span>}
      </div>
    </div>
    <p className="text-gray-600 leading-relaxed line-clamp-3 m-0">{source.content_snippet}</p>
    {source.url && (
      <a href={source.url} target="_blank" rel="noopener noreferrer"
        className="text-blue-500 hover:underline mt-1 inline-block">
        View source ↗
      </a>
    )}
  </div>
);

// ── InlineChart ────────────────────────────────────────────────────────────────
const InlineChart: React.FC<{ chart: ChartData }> = ({ chart }) => {
  const series = chart.series?.length
    ? chart.series
    : [{ key: "value", label: "Value", color: "#4f86c6" }];
  return (
    <div className="mt-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-700 mb-3">{chart.title}</p>
      <ResponsiveContainer width="100%" height={260}>
        {chart.chart_type === "line" ? (
          <LineChart data={chart.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <RTooltip />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            {series.map(s => (
              <Line key={s.key} type="monotone" dataKey={s.key} name={s.label}
                stroke={s.color} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            ))}
          </LineChart>
        ) : chart.chart_type === "pie" ? (
          <PieChart>
            <Pie data={chart.data} dataKey="value" nameKey="name"
              cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
              {chart.data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <RTooltip />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        ) : (
          <BarChart data={chart.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <RTooltip />
            <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            {series.map(s => (
              <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4,4,0,0]} />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
      {chart.y_label && <p className="text-xs text-gray-400 text-center mt-1">{chart.y_label}</p>}
    </div>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load conversation list on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE}/conversations`);
      if (res.ok) setConversations(await res.json());
    } catch { /* silently ignore — backend may not be ready */ }
  };

  const loadConversation = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}`);
      if (!res.ok) return;
      const msgs: any[] = await res.json();
      const loaded: Message[] = msgs.map((m, i) => ({
        id: `${id}-${i}`,
        type: m.role === "user" ? "user" : "ai",
        content: m.content,
        timestamp: new Date(m.created_at),
        sources: m.sources ?? [],
        chart_data: m.chart_data ?? undefined,
      }));
      setMessages(loaded);
      setConversationId(id);
    } catch { /* ignore */ }
  };

  const deleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch(`${API_BASE}/conversations/${id}`, { method: "DELETE" });
      setConversations(prev => prev.filter(c => c.id !== id));
      if (conversationId === id) startNewChat();
    } catch { /* ignore */ }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
    setInputValue("");
    textareaRef.current?.focus();
  };

  const handleSend = useCallback(async () => {
    const query = inputValue.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(), type: "user",
      content: query, timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, conversation_id: conversationId, top_k: 6 }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error((await res.text()) || `Server error ${res.status}`);
      const data = await res.json();

      if (data.conversation_id) setConversationId(data.conversation_id);

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(), type: "ai",
        content: data.answer, timestamp: new Date(),
        sources: data.sources ?? [],
        chart_data: data.chart_data ?? undefined,
        rewritten_query: data.rewritten_query,
        latency_ms: data.latency_ms,
      };
      setMessages(prev => [...prev, aiMsg]);

      // Refresh sidebar list
      fetchConversations();
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), type: "ai",
        content: `Sorry, something went wrong: ${err.message}`,
        timestamp: new Date(), error: true,
      }]);
    } finally {
      setIsLoading(false);
      setAbortController(null);
      textareaRef.current?.focus();
    }
  }, [inputValue, isLoading, conversationId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (d: Date) => d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`flex flex-col bg-gray-50 border-r border-gray-200 transition-all duration-200 shrink-0 ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"}`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <span className="text-sm font-semibold text-gray-700">Conversations</span>
          <button onClick={startNewChat}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
            <PlusOutlined /> New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-xs text-gray-400 text-center mt-6 px-4">
              No conversations yet. Ask your first question!
            </p>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`group flex items-start gap-2 px-4 py-3 cursor-pointer hover:bg-white transition-colors border-b border-gray-100 ${conversationId === conv.id ? "bg-white border-l-2 border-l-blue-500" : ""}`}
              >
                <MessageOutlined className="text-gray-400 shrink-0 mt-0.5 text-xs" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate leading-snug">{conv.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(conv.updated_at)}</p>
                </div>
                <button
                  onClick={e => deleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all shrink-0 mt-0.5"
                  title="Delete"
                >
                  <DeleteOutlined style={{ fontSize: 12 }} />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Toggle sidebar button */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-white">
          <button onClick={() => setSidebarOpen(o => !o)} className="text-gray-400 hover:text-gray-700">
            {sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
          </button>
          {conversationId && (
            <span className="text-xs text-gray-400 truncate">
              {conversations.find(c => c.id === conversationId)?.title ?? "Current conversation"}
            </span>
          )}
          {conversationId && (
            <button onClick={startNewChat}
              className="ml-auto text-xs text-blue-500 hover:underline flex items-center gap-1">
              <PlusOutlined /> New chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-w-3xl w-full mx-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center min-h-full text-center px-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <RobotOutlined className="text-white text-2xl" />
              </div>
              <Title level={3} className="mb-2">Rwanda Gender Data Assistant</Title>
              <Paragraph className="text-gray-500 max-w-lg mb-8">
                Ask questions about Rwanda's gender data — policies, statistics,
                legal frameworks, and research. Answers are grounded in the document
                library with citations.
              </Paragraph>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {SUGGESTED.map(q => (
                  <button key={q} onClick={() => setInputValue(q)}
                    className="text-left text-sm border border-gray-200 rounded-xl px-4 py-3 hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-700">
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg.id}
                className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                {msg.type === "ai" && (
                  <Avatar icon={<RobotOutlined />} className="bg-blue-600 shrink-0 mt-1" size={36} />
                )}

                <div className={`max-w-[82%] flex flex-col gap-2 ${msg.type === "user" ? "items-end" : "items-start"}`}>
                  {/* Bubble */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    msg.type === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : msg.error
                      ? "bg-red-50 border border-red-200 text-gray-800 rounded-tl-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                    <div className={`text-xs mt-1.5 ${msg.type === "user" ? "text-blue-200" : "text-gray-400"}`}>
                      {formatTime(msg.timestamp)}
                      {msg.latency_ms && <span className="ml-2">{(msg.latency_ms / 1000).toFixed(1)}s</span>}
                    </div>
                  </div>

                  {/* Chart */}
                  {msg.chart_data && <InlineChart chart={msg.chart_data} />}

                  {/* Rewritten query hint */}
                  {msg.rewritten_query && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <InfoCircleOutlined />
                      <span>Searched as: "{msg.rewritten_query}"</span>
                    </div>
                  )}

                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <Collapse ghost size="small" className="w-full"
                      items={[{
                        key: "s",
                        label: <span className="text-xs text-gray-500">{msg.sources.length} source{msg.sources.length > 1 ? "s" : ""} cited</span>,
                        children: (
                          <div className="flex flex-col gap-2">
                            {msg.sources.map((src, i) => <SourceCard key={i} source={src} index={i} />)}
                          </div>
                        ),
                      }]}
                    />
                  )}
                </div>

                {msg.type === "user" && (
                  <Avatar icon={<UserOutlined />} className="bg-gray-700 shrink-0 mt-1" size={36} />
                )}
              </div>
            ))
          )}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar icon={<RobotOutlined />} className="bg-blue-600 shrink-0 mt-1" size={36} />
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                <Spin size="small" />
                <Text className="text-gray-500 text-sm">Analysing documents…</Text>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="border-t border-gray-100 bg-white py-4 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 border border-gray-200 rounded-2xl bg-white shadow-sm px-4 py-3 focus-within:border-blue-400 transition-colors">
              <textarea
                ref={textareaRef}
                rows={1}
                className="flex-1 resize-none focus:outline-none text-sm leading-relaxed max-h-40 overflow-y-auto placeholder-gray-400"
                placeholder="Ask about Rwanda gender data… (Enter to send)"
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
                }}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                onClick={isLoading ? () => { abortController?.abort(); setIsLoading(false); } : handleSend}
                disabled={!isLoading && !inputValue.trim()}
                className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isLoading ? "bg-red-500 hover:bg-red-600 text-white"
                  : inputValue.trim() ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? <StopOutlined style={{ fontSize: 14 }} /> : <SendOutlined style={{ fontSize: 14 }} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Answers grounded in Rwanda gender policy documents, statistics, and web sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
