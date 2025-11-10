import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, updateUserStatus } from "@/lib/supabase";
import { UserList } from "@/components/chat/UserList";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Profile {
  id: string;
  username: string;
  email: string;
  status: string;
  avatar_url?: string;
  last_seen: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [users, setUsers] = useState<Profile[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      updateUserStatus('online');
      fetchUsers();
      
      // Set up realtime subscription for profiles
      const profilesChannel = supabase
        .channel('profiles-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles'
          },
          () => {
            fetchUsers();
          }
        )
        .subscribe();

      // Update status to offline on unmount
      return () => {
        updateUserStatus('offline');
        supabase.removeChannel(profilesChannel);
      };
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedUserId && currentUser) {
      fetchMessages();
      
      // Set up realtime subscription for messages
      const messagesChannel = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${selectedUserId},receiver_id=eq.${currentUser.id}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `sender_id=eq.${currentUser.id},receiver_id=eq.${selectedUserId}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(messagesChannel);
      };
    }
  }, [selectedUserId, currentUser]);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profile) {
      setCurrentUser(profile);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('username');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data || []);
  };

  const fetchMessages = async () => {
    if (!currentUser || !selectedUserId) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${selectedUserId}),and(sender_id.eq.${selectedUserId},receiver_id.eq.${currentUser.id})`)
      .order('created_at');

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentUser || !selectedUserId) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: currentUser.id,
        receiver_id: selectedUserId,
        content,
      });

    if (error) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await updateUserStatus('offline');
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const selectedUser = users.find(u => u.id === selectedUserId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      {/* User List - Desktop: always visible, Mobile: hidden when chat selected */}
      <div className={`${selectedUserId ? 'hidden md:block' : 'block'} w-full md:w-80`}>
        {currentUser && (
          <UserList
            users={users}
            currentUserId={currentUser.id}
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
            onLogout={handleLogout}
          />
        )}
      </div>

      {/* Chat Area - Desktop: always visible, Mobile: only when user selected */}
      <div className={`${selectedUserId ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {selectedUser ? (
          <>
            <ChatHeader
              username={selectedUser.username}
              status={selectedUser.status}
              lastSeen={formatDistanceToNow(new Date(selectedUser.last_seen), { addSuffix: true })}
              avatarUrl={selectedUser.avatar_url}
              onBack={() => setSelectedUserId(undefined)}
            />
            <ScrollArea className="flex-1 p-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  content={message.content}
                  timestamp={message.created_at}
                  isSent={message.sender_id === currentUser?.id}
                />
              ))}
              <div ref={scrollRef} />
            </ScrollArea>
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-muted/20">
            <div className="text-center space-y-2">
              <p className="text-2xl font-semibold text-muted-foreground">Select a chat</p>
              <p className="text-sm text-muted-foreground">Choose a user to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
