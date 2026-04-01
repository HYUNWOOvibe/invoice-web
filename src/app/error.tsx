"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// 전역 에러 경계 페이지 — 런타임 오류 발생 시 표시
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("앱 에러:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 sm:py-16">
        <Container>
          <div className="text-center space-y-6">
            {/* 에러 아이콘 + 메시지 */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <AlertCircle className="h-16 w-16 text-destructive/60" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold">
                오류가 발생했습니다
              </h2>
            </div>

            {/* 설명 */}
            <p className="max-w-md mx-auto text-muted-foreground text-lg">
              일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
            </p>

            {/* 버튼 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button size="lg" onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                다시 시도
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  홈으로 돌아가기
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
