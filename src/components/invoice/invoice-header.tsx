import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Invoice } from "@/types/invoice";

interface Props {
  invoice: Invoice;
}

// 날짜 문자열을 한국어 형식으로 변환 (예: "2026-04-01" → "2026년 04월 01일")
function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${year}년 ${month}월 ${day}일`;
}

// 상태별 배지 variant 매핑
const statusVariantMap: Record<
  Invoice["status"],
  "outline" | "secondary" | "default" | "destructive"
> = {
  draft: "outline",
  sent: "secondary",
  approved: "default",
  expired: "destructive",
};

// 상태 한국어 레이블
const statusLabelMap: Record<Invoice["status"], string> = {
  draft: "초안",
  sent: "발송",
  approved: "승인",
  expired: "만료",
};

// 견적서 헤더 컴포넌트 — 발행자/클라이언트/메타 정보 표시
export function InvoiceHeader({ invoice }: Props) {
  const statusVariant = statusVariantMap[invoice.status];
  const statusLabel = statusLabelMap[invoice.status];

  return (
    <div className="space-y-6">
      {/* 상단: 견적서 제목 + 상태 배지 */}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          {invoice.title}
        </h1>
        <Badge variant={statusVariant}>{statusLabel}</Badge>
      </div>

      <Separator />

      {/* 하단: 발행자 / 클라이언트 / 메타 정보 (3컬럼 그리드) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 발행자 정보 */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            발행자
          </p>
          <p className="font-semibold text-foreground">InvoiceWeb</p>
          <p className="text-sm text-muted-foreground">invoice@invoiceweb.kr</p>
        </div>

        {/* 클라이언트 정보 */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            수신인
          </p>
          <p className="font-semibold text-foreground">{invoice.client_name}</p>
          <p className="text-sm text-muted-foreground">{invoice.client_email}</p>
        </div>

        {/* 메타 정보 */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            견적서 정보
          </p>
          <div className="space-y-0.5 text-sm">
            <div className="flex gap-2">
              <span className="text-muted-foreground w-20 shrink-0">견적서 번호</span>
              <span className="text-foreground font-medium">{invoice.slug}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-20 shrink-0">발행일</span>
              <span className="text-foreground">{formatDate(invoice.issue_date)}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-muted-foreground w-20 shrink-0">유효기간</span>
              <span className="text-foreground">{formatDate(invoice.expiry_date)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
