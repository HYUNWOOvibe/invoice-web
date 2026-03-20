import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// TODO: Supabase 인증 연동 예정

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <Container>
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>회원가입</CardTitle>
                <CardDescription>계정을 만들어 노션 견적서를 관리하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                {/* TODO: 회원가입 폼 구현 예정 */}
                <p className="text-muted-foreground text-sm">회원가입 폼이 여기에 들어갑니다.</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}
