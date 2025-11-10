import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ChatHeaderProps {
  username: string;
  status: string;
  lastSeen: string;
  avatarUrl?: string;
  onBack?: () => void;
}

export const ChatHeader = ({ username, status, lastSeen, avatarUrl, onBack }: ChatHeaderProps) => {
  return (
    <div className="flex items-center gap-3 p-4 border-b bg-card">
      {onBack && (
        <Button variant="ghost" size="icon" onClick={onBack} className="md:hidden">
          <ArrowLeft className="w-5 h-5" />
        </Button>
      )}
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {username[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="font-semibold text-foreground">{username}</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-online' : 'bg-offline'}`} />
          <p className="text-sm text-muted-foreground">
            {status === 'online' ? 'Online' : `Last seen ${lastSeen}`}
          </p>
        </div>
      </div>
    </div>
  );
};
