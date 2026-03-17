import { Conversation, Message } from "./types";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    title: "Análise de Raio-X Torácico",
    lastMessage: "O laudo indicou achados compatíveis com...",
    timestamp: "Hoje, 14:32",
  },
  {
    id: "2",
    title: "Dúvida sobre TC de Crânio",
    lastMessage: "Sim, neste caso específico...",
    timestamp: "Ontem, 09:15",
  },
  {
    id: "3",
    title: "Laudos Pendentes",
    lastMessage: "Você tem 3 laudos aguardando revisão.",
    timestamp: "09/03, 16:47",
  },
  {
    id: "4",
    title: "Ressonância de Coluna",
    lastMessage: "Os achados sugerem discopatia em L4-L5.",
    timestamp: "07/03, 11:20",
  },
  {
    id: "5",
    title: "Protocolo de Exame",
    lastMessage: "Para este exame utilize o protocolo...",
    timestamp: "05/03, 08:33",
  },
];

export function createWelcomeMessage(): Message {
  return {
    id: "welcome-" + Date.now(),
    role: "assistant",
    content:
      "Olá! Sou o assistente da Wradio. Posso te ajudar com laudos, dúvidas clínicas ou qualquer outra necessidade. Como posso te ajudar hoje?",
    timestamp: new Date(),
  };
}

export function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
