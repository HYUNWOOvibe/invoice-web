import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// TODO: Supabase에서 노션 연동 설정 로드/저장 예정

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold">설정</h1>
              <p className="text-muted-foreground mt-1">노션 연동 및 계정 설정을 관리하세요.</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>노션 연동</CardTitle>
                <CardDescription>노션 API 키와 데이터베이스 ID를 설정하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* TODO: 노션 연동 설정 폼 구현 예정 */}
                <p className="text-muted-foreground text-sm">노션 연동 설정 폼이 여기에 들어갑니다.</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}
