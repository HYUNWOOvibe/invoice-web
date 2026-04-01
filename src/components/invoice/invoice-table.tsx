import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceItem } from "@/types/invoice";

interface Props {
  items: InvoiceItem[];
}

// 한국 원화 형식으로 금액 표시
function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(n);
}

// 견적 항목 테이블 컴포넌트 — 항목별 금액 계산 및 합계 표시
export function InvoiceTable({ items }: Props) {
  // 각 항목별 계산
  const rows = items.map((item) => {
    const supply = item.unit_price * item.quantity; // 공급가액
    const tax = Math.round((supply * item.tax_rate) / 100); // 세액
    const total = supply + tax; // 합계
    return { ...item, supply, tax, total };
  });

  // 요약 계산
  const subtotal = rows.reduce((sum, r) => sum + r.supply, 0); // 소계
  const totalTax = rows.reduce((sum, r) => sum + r.tax, 0); // 부가세
  const grandTotal = subtotal + totalTax; // 총합계

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">견적 항목</h2>

      {/* 모바일 대응: 가로 스크롤 */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[160px]">서비스명</TableHead>
              <TableHead className="text-right min-w-[100px]">단가</TableHead>
              <TableHead className="text-right min-w-[60px]">수량</TableHead>
              <TableHead className="text-right min-w-[120px]">공급가액</TableHead>
              <TableHead className="text-right min-w-[60px]">세율</TableHead>
              <TableHead className="text-right min-w-[100px]">세액</TableHead>
              <TableHead className="text-right min-w-[120px]">합계</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell className="text-right">{formatKRW(row.unit_price)}</TableCell>
                <TableCell className="text-right">{row.quantity}</TableCell>
                <TableCell className="text-right">{formatKRW(row.supply)}</TableCell>
                <TableCell className="text-right">{row.tax_rate}%</TableCell>
                <TableCell className="text-right">{formatKRW(row.tax)}</TableCell>
                <TableCell className="text-right font-medium">{formatKRW(row.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>

          {/* 합계 요약 */}
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6} className="text-right text-muted-foreground">
                소계 (공급가액 합계)
              </TableCell>
              <TableCell className="text-right font-medium">{formatKRW(subtotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6} className="text-right text-muted-foreground">
                부가세
              </TableCell>
              <TableCell className="text-right font-medium">{formatKRW(totalTax)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={6} className="text-right font-semibold text-foreground">
                총합계
              </TableCell>
              <TableCell className="text-right font-bold text-foreground text-base">
                {formatKRW(grandTotal)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
