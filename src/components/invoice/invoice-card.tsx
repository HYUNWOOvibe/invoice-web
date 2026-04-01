import Link from "next/link";
import { cva } from "class-variance-authority";
import { Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/invoice/share-button";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";

// 상태 배지 variant
const statusBadge = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        sent: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
    },
  }
);

// 상태 한국어 레이블
const STATUS_LABEL: Record<Invoice["status"], string> = {
  draft: "초안",
  sent: "발송",
  approved: "승인",
  expired: "만료",
};

// 총액 계산: 모든 항목의 (단가 × 수량 × (1 + 세율/100)) 합산
function calcTotal(invoice: Invoice): number {
  return invoice.items.reduce((sum, item) => {
    const supply = item.unit_price * item.quantity;
    const tax = supply * (item.tax_rate / 100);
    return sum + supply + tax;
  }, 0);
}

// 한국 원화 형식
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);

interface Props {
  invoice: Invoice;
  className?: string;
}

// 대시보드용 견적서 카드 컴포넌트
export function InvoiceCard({ invoice, className }: Props) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight line-clamp-2">
            {invoice.title || invoice.slug}
          </CardTitle>
          <span className={statusBadge({ status: invoice.status })}>
            {STATUS_LABEL[invoice.status]}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 text-sm">
        {/* 클라이언트 정보 */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">클라이언트</span>
          <span className="font-medium truncate max-w-[60%] text-right">
            {invoice.client_name || "—"}
          </span>
        </div>

        {/* 발행일 */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">발행일</span>
          <span>{invoice.issue_date || "—"}</span>
        </div>

        {/* 총액 */}
        <div className="flex items-center justify-between border-t pt-2 mt-2">
          <span className="text-muted-foreground font-medium">총액</span>
          <span className="font-bold text-base">{formatCurrency(calcTotal(invoice))}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        {/* ShareButton은 Client Component — url prop으로 공유 URL 전달 */}
        <ShareButton url={`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/invoice/${invoice.slug}`} className="flex-1" />
        <Button asChild variant="default" className="flex-1">
          <Link href={`/invoice/${invoice.slug}`}>
            <Eye className="mr-2 h-4 w-4" />
            미리보기
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
