
import { useState, useEffect } from "react";
import ChatSidebar, { Conversation } from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import NewConversationDialog from "@/components/chat/NewConversationDialog";
import { useToast } from "@/components/ui/sonner";

interface ChatPageProps {
  currentUser: { username: string; id: string };
  onLogout: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ currentUser, onLogout }) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "user-1",
      name: "Alice",
      lastMessage: "Hi there! How are you?",
      lastTimestamp: "10:30 AM",
      online: true
    },
    {
      id: "user-2",
      name: "Bob",
      lastMessage: "Did you get my encrypted message?",
      lastTimestamp: "Yesterday",
      unreadCount: 2,
      online: false
    },
    {
      id: "user-3",
      name: "Charlie",
      lastMessage: "Let's discuss this in private",
      lastTimestamp: "2 days ago",
      online: true
    }
  ]);
  
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const { toast } = useToast();
  
  const getConversationById = (id: string | null) => {
    if (!id) return null;
    return conversations.find(conv => conv.id === id) || null;
  };

  const handleSendMessage = (message: string) => {
    if (!activeConversation) return;
    
    // Update the conversation with the new message
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          lastMessage: message,
          lastTimestamp: "Just now"
        };
      }
      return conv;
    }));
    
    // Simulate receiving a message back
    setTimeout(() => {
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            lastMessage: "Thanks for your message! (Encrypted)",
            lastTimestamp: "Just now"
          };
        }
        return conv;
      }));
      
      toast("New encrypted message received", {
        description: `From ${getConversationById(activeConversation)?.name}`,
      });
    }, 3000);
  };

  const handleAddConversation = (name: string) => {
    const newConversation: Conversation = {
      id: `user-${Date.now()}`,
      name,
      online: Math.random() > 0.5,
      lastTimestamp: "Just now"
    };
    
    setConversations(prev => [...prev, newConversation]);
    setActiveConversation(newConversation.id);
  };

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-col h-full w-80">
        <ChatSidebar 
          conversations={conversations}
          activeConversation={activeConversation}
          onConversationSelect={setActiveConversation}
          onLogout={onLogout}
          currentUser={currentUser}
        />
        <div className="p-4 border-t border-border">
          <NewConversationDialog onAddConversation={handleAddConversation} />
        </div>
      </div>
      <div className="flex-1 flex flex-col border-l border-border">
        <ChatWindow
          conversation={getConversationById(activeConversation)}
          currentUserId={currentUser.id}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
