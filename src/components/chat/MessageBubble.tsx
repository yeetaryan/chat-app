import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isSent: boolean;
}

export const MessageBubble = ({ content, timestamp, isSent }: MessageBubbleProps) => {
  return (
    <div className={cn("flex w-full mb-4 animate-in slide-in-from-bottom-2", isSent ? "justify-end" : "justify-start")}>
      <div className={cn(
        "max-w-[75%] md:max-w-[60%] rounded-3xl px-4 py-2.5 shadow-sm",
        isSent 
          ? "bg-gradient-to-br from-primary to-primary-dark text-primary-foreground rounded-br-md" 
          : "bg-message-received text-message-received-foreground rounded-bl-md"
      )}>
        <p className="text-sm leading-relaxed break-words">{content}</p>
        <p className={cn(
          "text-xs mt-1",
          isSent ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {format(new Date(timestamp), 'HH:mm')}
        </p>
      </div>
    </div>
  );
};
