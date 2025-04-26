
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Lock, Send, User, Shield, Check } from "lucide-react";
import { Conversation } from "./ChatSidebar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  encrypted: boolean;
}

interface ChatWindowProps {
  conversation: Conversation | null;
  currentUserId: string;
  onSendMessage: (message: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, currentUserId, onSendMessage }) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Simulate loading existing messages when the conversation changes
  useEffect(() => {
    if (conversation) {
      // Generate some mock messages for the conversation
      const mockMessages: Message[] = [];
      const numberOfMessages = Math.floor(Math.random() * 5) + 2;
      
      for (let i = 0; i < numberOfMessages; i++) {
        const isCurrentUser = Math.random() > 0.5;
        mockMessages.push({
          id: `msg-${Date.now()}-${i}`,
          senderId: isCurrentUser ? currentUserId : conversation.id,
          content: isCurrentUser 
            ? `Hey ${conversation.name}, how's it going?` 
            : `Hi there, I'm doing well!`,
          timestamp: new Date(Date.now() - Math.random() * 1000000),
          encrypted: true
        });
      }
      
      setMessages(mockMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
    } else {
      setMessages([]);
    }
  }, [conversation, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !conversation) return;
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      content: messageInput,
      timestamp: new Date(),
      encrypted: true
    };
    
    setMessages([...messages, newMessage]);
    onSendMessage(messageInput);
    setMessageInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background/90">
        <Shield className="h-16 w-16 text-primary/20 mb-4" />
        <h3 className="text-xl font-medium">Secure Chat</h3>
        <p className="text-muted-foreground text-center mt-2 max-w-xs">
          Select a conversation to start chatting with end-to-end encryption
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 flex items-center gap-3 border-b border-border">
        <Avatar>
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
        <div>
          <div className="font-medium">{conversation.name}</div>
          <div className="flex items-center text-xs text-green-500">
            <Lock className="h-3 w-3 mr-1" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => {
            const isSentByMe = message.senderId === currentUserId;
            return (
              <div 
                key={message.id} 
                className={cn(
                  "flex flex-col",
                  isSentByMe ? "items-end" : "items-start"
                )}
              >
                <div className={cn(
                  "message-bubble",
                  isSentByMe ? "message-sent" : "message-received"
                )}>
                  {message.content}
                </div>
                <div className="flex items-center mt-1 space-x-1">
                  {message.encrypted && (
                    <span className="encrypt-indicator">
                      <Lock className="h-3 w-3" />
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.timestamp)}
                  </span>
                  {isSentByMe && (
                    <Check className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type a message..."
            className="flex-1"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-center mt-2">
          <span className="text-xs flex items-center text-muted-foreground">
            <Lock className="h-3 w-3 mr-1" />
            Messages are end-to-end encrypted
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
