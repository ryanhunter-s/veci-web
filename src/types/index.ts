export type Category =
  | "repairs"
  | "transport"
  | "pets"
  | "groceries"
  | "services"
  | "community"
  | "carpentry"
  | "cleaning"
  | "gardening"
  | "moving";

export type PayUnit = "hora" | "dia" | "semana" | "mes" | "proyecto";

export type JobSchedule = "puntual" | "recurrente";

export type JobListingStatus =
  | "publicado"
  | "contratado"
  | "en_progreso"
  | "completado"
  | "cancelado";

export interface JobListing {
  id: string;
  title: string;
  description: string;
  category: Category;
  unit: PayUnit;
  schedule: JobSchedule;
  amount: number;
  units?: number;
  frequency?: string;
  negotiable: boolean;
  includesTransport: boolean;
  includesMaterials: boolean;
  includesMeals: boolean;
  startDate: string;
  endDate?: string;
  timeWindow: string;
  zone: string;
  city: string;
  peopleNeeded: number;
  requirements?: string;
  status: JobListingStatus;
  publisher: User;
  publisherVerified: boolean;
  applicationsCount: number;
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  name: string;
  avatar: string;
  presentation: string;
  experience?: string;
  proposedPrice?: number;
  verified: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  jobId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  role: "employer" | "worker";
  createdAt: string;
}

export type WorkerStatus = "disponible" | "ocupado";

export interface WorkerProfile {
  id: string;
  name: string;
  avatar: string;
  photo?: string;
  title: string;
  bio: string;
  categories: Category[];
  units: PayUnit[];
  rate: number;
  rateUnit: PayUnit;
  negotiable: boolean;
  zone: string;
  city: string;
  availability: string;
  experience: string;
  verified: boolean;
  rating: number;
  completedJobs: number;
  status: WorkerStatus;
  createdAt: string;
}

export interface WorkerReview {
  id: string;
  workerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface WorkerContact {
  id: string;
  workerId: string;
  name: string;
  message: string;
  createdAt: string;
}

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
