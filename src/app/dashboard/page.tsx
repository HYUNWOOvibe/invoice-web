import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";

// TODO: Supabase에서 견적서 목록 로딩 예정

export default function DashboardPage() {
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
            {/* TODO: 견적서 목록 테이블 구현 예정 */}
            <p className="text-muted-foreground text-sm">견적서 목록이 여기에 표시됩니다.</p>
          </div>
        </Container>
      </main>
    </div>
  );
}
