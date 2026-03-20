// 견적서 항목 타입
export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

// 견적서 타입
export interface Invoice {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  clientEmail?: string;
  issueDate: string;
  dueDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
  total: number;
  notes?: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

// 사용자 타입
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

// 노션 연동 설정 타입
export interface NotionConfig {
  userId: string;
  apiKey: string;
  databaseId: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}
