import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LogOut, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  username: string;
  email: string;
  status: string;
  avatar_url?: string;
  last_seen: string;
}

interface UserListProps {
  users: User[];
  currentUserId: string;
  selectedUserId?: string;
  onSelectUser: (userId: string) => void;
  onLogout: () => void;
}

export const UserList = ({ users, currentUserId, selectedUserId, onSelectUser, onLogout }: UserListProps) => {
  const otherUsers = users.filter(u => u.id !== currentUserId);

  return (
    <div className="flex flex-col h-full border-r bg-card">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h1 className="font-bold text-xl">Chats</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout} title="Logout">
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {otherUsers.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No users available
            </div>
          ) : (
            otherUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelectUser(user.id)}
                className={cn(
                  "w-full p-3 rounded-lg flex items-center gap-3 hover:bg-muted/50 transition-colors",
                  selectedUserId === user.id && "bg-muted"
                )}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card",
                      user.status === 'online' ? "bg-online" : "bg-offline"
                    )} 
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-sm">{user.username}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.status === 'online' ? 'Online' : 'Offline'}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
