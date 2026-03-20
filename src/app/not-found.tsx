import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 sm:py-16">
        <Container>
          <div className="text-center space-y-6">
            {/* 큰 404 텍스트 */}
            <div className="space-y-2">
              <h1 className="text-9xl font-bold text-primary/30">404</h1>
              <h2 className="text-3xl sm:text-4xl font-bold">페이지를 찾을 수 없습니다</h2>
            </div>

            {/* 설명 */}
            <p className="max-w-md mx-auto text-muted-foreground text-lg">
              요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
              아래의 버튼을 클릭하여 홈으로 돌아가세요.
            </p>

            {/* 버튼 */}
            <div className="pt-4">
              <Button asChild size="lg">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  홈으로 돌아가기
                </Link>
              </Button>
            </div>

            {/* 추가 링크 */}
            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground mb-4">다른 곳으로 이동하시겠어요?</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/components">컴포넌트 확인</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
