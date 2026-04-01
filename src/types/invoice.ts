// 견적 항목 타입
export interface InvoiceItem {
  name: string;
  unit_price: number;
  quantity: number;
  tax_rate: number; // 세율 (%, 기본값 10)
}

// 견적서 타입
export interface Invoice {
  id: string;
  slug: string;
  title: string;
  client_name: string;
  client_email: string;
  issue_date: string;
  expiry_date: string;
  status: "draft" | "sent" | "approved" | "expired";
  notes: string;
  items: InvoiceItem[];
}
