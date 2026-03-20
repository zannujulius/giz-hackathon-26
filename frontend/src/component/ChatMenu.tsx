import React, { useState, useEffect } from "react";
import { Menu, type MenuProps } from "antd";
import {
  MessageOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

interface ChatMenuProps {
  onConversationSelect?: (conversationId: string) => void;
  currentConversationId?: string | null;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export const ChatMenu: React.FC<ChatMenuProps> = ({
  onConversationSelect,
  currentConversationId,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const navigate = useNavigate();

  // Load conversation list on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE}/conversations`);
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      // silently ignore — backend may not be ready
    }
  };

  const deleteConversation = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await fetch(`${API_BASE}/conversations/${id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      // Refresh conversations after deletion
      fetchConversations();
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleNewChat = () => {
    navigate("/chat");
    // You can also call onConversationSelect with null to start a new chat
    if (onConversationSelect) {
      onConversationSelect("");
    }
  };

  const handleConversationClick = (conversationId: string) => {
    navigate(`/chat?conversation=${conversationId}`);
    if (onConversationSelect) {
      onConversationSelect(conversationId);
    }
  };

  // Create menu items from conversations
  const chatMenuItems: MenuProps["items"] = [
    {
      key: "new-chat",
      icon: <PlusOutlined />,
      label: (
        <div
          onClick={handleNewChat}
          className="flex items-center justify-between w-full text-black! hover:text-blue-800 text-sm!"
        >
          <span>New Chat</span>
        </div>
      ),
    },
    ...(conversations.length > 0
      ? [
          {
            type: "divider" as const,
          },
        ]
      : []),
    ...conversations.map((conv) => ({
      key: `conversation-${conv.id}`,
      icon: <MessageOutlined />,
      label: (
        <div
          onClick={() => handleConversationClick(conv.id)}
          className={`group flex items-center justify-between w-full cursor-pointer transition-colors ${
            currentConversationId === conv.id ? " text-blue-600" : ""
          }`}
        >
          <div className="flex-1 min-w-0 mr-2">
            <div className="text-sm truncate leading-snug">{conv.title}</div>
            {/* <div className="text-xs text-gray-400 mt-0.5">
              {timeAgo(conv.updated_at)}
            </div> */}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteConversation(conv.id, e);
            }}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all shrink-0"
            title="Delete conversation"
          >
            <DeleteOutlined style={{ fontSize: 12 }} />
          </button>
        </div>
      ),
    })),
  ];

  // Show empty state if no conversations
  if (conversations.length === 0) {
    return (
      <Menu
        mode="inline"
        className="bg-transparent!"
        items={[
          {
            key: "new-chat",
            icon: <PlusOutlined />,
            label: (
              <div
                onClick={handleNewChat}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Start New Chat
              </div>
            ),
          },
          {
            key: "empty-state",
            icon: <MessageOutlined />,
            label: (
              <div className="text-xs text-gray-400 py-2">
                No conversations yet.
                <br />
                Ask your first question!
              </div>
            ),
            disabled: true,
          },
        ]}
      />
    );
  }

  return (
    <Menu
      mode="inline"
      className="bg-transparent! h-[50vh] overflow-hidden"
      selectedKeys={
        currentConversationId ? [`conversation-${currentConversationId}`] : []
      }
      items={chatMenuItems}
    />
  );
};

export default ChatMenu;
