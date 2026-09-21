export type Category =
  | "repairs"
  | "transport"
  | "pets"
  | "groceries"
  | "services"
  | "community"
  | "carpentry";

export type RequestStatus = "abierta" | "en_progreso" | "completada";

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: Category;
  status: RequestStatus;
  author: User;
  location: string;
  createdAt: string;
  responses: number;
}

export type JobStatus = "aceptada" | "en_progreso" | "completada" | "cancelada";

export interface Job {
  id: string;
  requestId: string;
  helperId: string;
  helperName: string;
  helperAvatar: string;
  status: JobStatus;
  price?: number;
  scheduledFor?: string;
  notes?: string;
  acceptedAt: string;
}

export type CommentStatus = "pendiente" | "aprobado" | "oculto";

export interface RequestComment {
  id: string;
  requestId: string;
  author: string;
  authorAvatar: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantNeighborhood: string;
  requestId?: string;
  requestTitle?: string;
  messages: ChatMessage[];
}
