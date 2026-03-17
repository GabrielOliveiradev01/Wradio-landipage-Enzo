export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          crm: string | null;
          specialty: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          crm?: string | null;
          specialty?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          crm?: string | null;
          specialty?: string | null;
          phone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      community_messages: {
        Row: {
          id: string;
          author_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          content?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_messages_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      community_attachments: {
        Row: {
          id: string;
          message_id: string;
          file_url: string;
          file_name: string;
          file_type: "image" | "pdf";
          file_size: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          file_url: string;
          file_name: string;
          file_type: "image" | "pdf";
          file_size: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          file_url?: string;
          file_name?: string;
          file_type?: "image" | "pdf";
          file_size?: number;
        };
        Relationships: [
          {
            foreignKeyName: "community_attachments_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: false;
            referencedRelation: "community_messages";
            referencedColumns: ["id"];
          },
        ];
      };
      community_reactions: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          user_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          user_id?: string;
          emoji?: string;
        };
        Relationships: [
          {
            foreignKeyName: "community_reactions_message_id_fkey";
            columns: ["message_id"];
            isOneToOne: false;
            referencedRelation: "community_messages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "community_reactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      feedbacks: {
        Row: {
          id: string;
          message: string;
          user_id: string | null;
          user_email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          message: string;
          user_id?: string | null;
          user_email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          message?: string;
          user_id?: string | null;
          user_email?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
