import { AlertCircle, FileText } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { InvoiceCard } from "@/components/invoice/invoice-card";
import { getInvoices } from "@/lib/notion/queries";

// ISR — Notion API 속도 제한 대응 (60초 캐싱)
export const revalidate = 60;

// Notion 환경변수 설정 여부 확인
function isNotionConfigured(): boolean {
  return !!(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID);
}

// 환경변수 미설정 안내 UI
function NotionNotConfigured() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <AlertCircle className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Notion 연동이 설정되지 않았습니다</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          .env.local 파일에 <code className="bg-muted px-1 rounded">NOTION_TOKEN</code>과{" "}
          <code className="bg-muted px-1 rounded">NOTION_DATABASE_ID</code>를 설정해주세요.
        </p>
      </div>
    </div>
  );
}

// 견적서 없음 UI
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
      <FileText className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">견적서가 없습니다</h2>
        <p className="text-muted-foreground text-sm">
          Notion 데이터베이스에 견적서를 추가하면 여기에 표시됩니다.
        </p>
      </div>
    </div>
  );
}

// 대시보드 페이지 — Server Component, Notion API 직접 호출
export default async function DashboardPage() {
  // 환경변수 미설정 시 안내 UI 표시
  if (!isNotionConfigured()) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8">
          <Container>
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">견적서 관리</h1>
                <p className="text-muted-foreground mt-1">노션에서 가져온 견적서 목록입니다.</p>
              </div>
              <NotionNotConfigured />
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  // Notion API로 견적서 목록 조회
  const invoices = await getInvoices();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">견적서 관리</h1>
              <p className="text-muted-foreground mt-1">
                노션에서 가져온 견적서 목록입니다.{" "}
                <span className="text-sm">총 {invoices.length}건</span>
              </p>
            </div>

            {invoices.length === 0 ? (
              <EmptyState />
            ) : (
              // 반응형 그리드: 모바일 1열 → 태블릿 2열 → 데스크톱 3열
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {invoices.map((invoice) => (
                  <InvoiceCard key={invoice.id} invoice={invoice} />
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
