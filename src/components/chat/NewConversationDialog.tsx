
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NewConversationDialogProps {
  onAddConversation: (name: string) => void;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({ onAddConversation }) => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  const handleAddConversation = () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive"
      });
      return;
    }
    
    onAddConversation(username);
    setUsername("");
    setOpen(false);
    toast({
      title: "Chat Created",
      description: `Secure chat with ${username} has been created.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center w-full">
          <UserPlus className="h-4 w-4" />
          <span>New Secure Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start New Encrypted Chat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">Username</label>
            <Input
              id="username"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddConversation}>
            Start Secure Chat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
