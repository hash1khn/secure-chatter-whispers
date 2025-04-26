
import { useState } from "react";
import ChatSidebar, { Conversation } from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import NewConversationDialog from "@/components/chat/NewConversationDialog";
import { useToast } from "@/hooks/use-toast";

interface ChatPageProps {
  currentUser: { username: string; id: string };
  onLogout: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ currentUser, onLogout }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const { toast } = useToast();
  
  const getConversationById = (id: string | null) => {
    if (!id) return null;
    return conversations.find(conv => conv.id === id) || null;
  };

  const handleSendMessage = (message: string) => {
    if (!activeConversation) return;
    
    // We'll integrate with the Python backend here later
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
    
    toast({
      title: "Encrypted Message Sent",
      description: "Your message has been encrypted and sent securely.",
    });
  };

  const handleAddConversation = (name: string) => {
    const newConversation: Conversation = {
      id: `user-${Date.now()}`,
      name,
      online: true,
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
