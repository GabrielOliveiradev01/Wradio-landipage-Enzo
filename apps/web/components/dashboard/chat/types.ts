export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  attachments?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
}
