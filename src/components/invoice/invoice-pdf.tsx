import path from "path";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import { Invoice, InvoiceItem } from "@/types/invoice";

// Noto Sans KR 폰트 등록 (한국어 PDF 렌더링)
Font.register({
  family: "NotoSansKR",
  src: path.join(process.cwd(), "public/fonts/NotoSansKR-Regular.ttf"),
});

// 한국 원화 형식으로 금액 표시
function formatKRW(n: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(n);
}

// 날짜 문자열을 한국어 형식으로 변환 (예: "2026-04-01" → "2026년 04월 01일")
function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return dateStr;
  return `${year}년 ${month}월 ${day}일`;
}

// 상태 한국어 레이블
const statusLabelMap: Record<Invoice["status"], string> = {
  draft: "초안",
  sent: "발송",
  approved: "승인",
  expired: "만료",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansKR",
    fontSize: 10,
    padding: 40,
    color: "#111",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusBadge: {
    fontSize: 9,
    color: "#555",
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 8,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  infoName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  infoText: {
    color: "#6b7280",
    fontSize: 9,
  },
  metaRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  metaKey: {
    width: 60,
    color: "#9ca3af",
    fontSize: 9,
  },
  metaValue: {
    fontSize: 9,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  colName: { flex: 3 },
  colNum: { flex: 1.5, textAlign: "right" },
  colQty: { flex: 0.8, textAlign: "right" },
  colRate: { flex: 0.8, textAlign: "right" },
  headerText: {
    fontSize: 9,
    color: "#6b7280",
    fontWeight: "bold",
  },
  cellText: {
    fontSize: 9,
  },
  summarySection: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 2,
  },
  summaryLabel: {
    width: 100,
    textAlign: "right",
    color: "#6b7280",
    fontSize: 9,
    paddingRight: 8,
  },
  summaryValue: {
    width: 100,
    textAlign: "right",
    fontSize: 9,
  },
  grandTotalLabel: {
    width: 100,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 10,
    paddingRight: 8,
  },
  grandTotalValue: {
    width: 100,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 11,
  },
  notesSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9fafb",
    borderRadius: 4,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.5,
  },
});

// 항목 행 컴포넌트
function ItemRow({ item }: { item: InvoiceItem }) {
  const supply = item.unit_price * item.quantity;
  const tax = Math.round((supply * item.tax_rate) / 100);
  const total = supply + tax;

  return (
    <View style={styles.tableRow}>
      <Text style={[styles.colName, styles.cellText]}>{item.name}</Text>
      <Text style={[styles.colNum, styles.cellText]}>
        {formatKRW(item.unit_price)}
      </Text>
      <Text style={[styles.colQty, styles.cellText]}>{item.quantity}</Text>
      <Text style={[styles.colNum, styles.cellText]}>
        {formatKRW(supply)}
      </Text>
      <Text style={[styles.colRate, styles.cellText]}>{item.tax_rate}%</Text>
      <Text style={[styles.colNum, styles.cellText]}>{formatKRW(tax)}</Text>
      <Text style={[styles.colNum, styles.cellText]}>{formatKRW(total)}</Text>
    </View>
  );
}

interface Props {
  invoice: Invoice;
}

// 견적서 PDF 문서 컴포넌트
export function InvoicePDF({ invoice }: Props) {
  // 합계 계산
  const rows = invoice.items.map((item) => {
    const supply = item.unit_price * item.quantity;
    const tax = Math.round((supply * item.tax_rate) / 100);
    return { supply, tax };
  });
  const subtotal = rows.reduce((sum, r) => sum + r.supply, 0);
  const totalTax = rows.reduce((sum, r) => sum + r.tax, 0);
  const grandTotal = subtotal + totalTax;

  const statusLabel = statusLabelMap[invoice.status];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 섹션 1: 제목 + 상태 */}
        <Text style={styles.title}>{invoice.title}</Text>
        <Text style={styles.statusBadge}>상태: {statusLabel}</Text>

        <View style={styles.divider} />

        {/* 섹션 2: 발행자 / 수신인 / 메타정보 */}
        <View style={styles.infoRow}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>발행자</Text>
            <Text style={styles.infoName}>InvoiceWeb</Text>
            <Text style={styles.infoText}>invoice@invoiceweb.kr</Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>수신인</Text>
            <Text style={styles.infoName}>{invoice.client_name}</Text>
            <Text style={styles.infoText}>{invoice.client_email}</Text>
          </View>

          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>견적서 정보</Text>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>견적서 번호</Text>
              <Text style={styles.metaValue}>{invoice.slug}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>발행일</Text>
              <Text style={styles.metaValue}>
                {formatDate(invoice.issue_date)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>유효기간</Text>
              <Text style={styles.metaValue}>
                {formatDate(invoice.expiry_date)}
              </Text>
            </View>
          </View>
        </View>

        {/* 섹션 3: 견적 항목 테이블 */}
        <Text style={styles.sectionTitle}>견적 항목</Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.colName, styles.headerText]}>서비스명</Text>
          <Text style={[styles.colNum, styles.headerText]}>단가</Text>
          <Text style={[styles.colQty, styles.headerText]}>수량</Text>
          <Text style={[styles.colNum, styles.headerText]}>공급가액</Text>
          <Text style={[styles.colRate, styles.headerText]}>세율</Text>
          <Text style={[styles.colNum, styles.headerText]}>세액</Text>
          <Text style={[styles.colNum, styles.headerText]}>합계</Text>
        </View>

        {invoice.items.map((item, index) => (
          <ItemRow key={index} item={item} />
        ))}

        {/* 섹션 4: 합계 요약 */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>소계 (공급가액 합계)</Text>
            <Text style={styles.summaryValue}>{formatKRW(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>부가세</Text>
            <Text style={styles.summaryValue}>{formatKRW(totalTax)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>총합계</Text>
            <Text style={styles.grandTotalValue}>{formatKRW(grandTotal)}</Text>
          </View>
        </View>

        {/* 섹션 5: 비고 (내용이 있을 때만) */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>비고</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
