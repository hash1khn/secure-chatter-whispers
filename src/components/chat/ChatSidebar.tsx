
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Search, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export type Conversation = {
  id: string;
  name: string;
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount?: number;
  avatar?: string;
  online?: boolean;
};

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversation?: string | null;
  onConversationSelect: (id: string) => void;
  onLogout: () => void;
  currentUser: { username: string; id: string };
}

const ChatSidebar = ({
  conversations,
  activeConversation,
  onConversationSelect,
  onLogout,
  currentUser,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredConversations = conversations.filter(
    (convo) => convo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 h-full flex flex-col border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarFallback className="bg-primary/20 text-primary">
                {currentUser?.username?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{currentUser.username}</div>
              <div className="text-xs text-muted-foreground">Online</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">Conversations</h3>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-md hover:bg-secondary/50 transition-colors",
                  activeConversation === conversation.id && "bg-secondary"
                )}
              >
                <Avatar className="h-10 w-10">
                  {conversation.avatar ? (
                    <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  ) : (
                    <AvatarFallback>
                      {conversation.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </Avatar>
                <div className="flex-1 text-left truncate">
                  <div className="flex justify-between">
                    <span className="font-medium">{conversation.name}</span>
                    {conversation.lastTimestamp && (
                      <span className="text-xs text-muted-foreground">{conversation.lastTimestamp}</span>
                    )}
                  </div>
                  {conversation.lastMessage && (
                    <div className="text-xs truncate text-muted-foreground">
                      {conversation.lastMessage}
                    </div>
                  )}
                </div>
                {conversation.unreadCount && conversation.unreadCount > 0 && (
                  <div className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No conversations found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatSidebar;
