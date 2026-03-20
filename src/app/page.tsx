import Link from "next/link";
import { ArrowRight, FileText, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// TODO: 로그인 상태 확인 후 /dashboard로 리디렉션 구현 예정

export default function Home() {
  const features = [
    {
      icon: FileText,
      title: "노션 연동",
      description: "노션 데이터베이스의 견적서를 자동으로 불러와 웹에서 보여줍니다.",
    },
    {
      icon: Share2,
      title: "웹 공유",
      description: "고유 링크로 견적서를 고객과 간편하게 공유하세요.",
    },
    {
      icon: Download,
      title: "PDF 다운로드",
      description: "전문적인 레이아웃의 PDF로 즉시 다운로드할 수 있습니다.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 sm:py-32 border-b border-border">
          <Container>
            <div className="text-center space-y-6">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                노션 견적서를 더 스마트하게
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                노션 견적서를 <span className="text-primary">웹으로</span> 공유하세요
              </h1>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                노션에서 작성한 견적서를 웹 링크로 고객과 공유하고,
                전문적인 PDF로 다운로드하세요. 설정 5분이면 충분합니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg">
                  <Link href="/signup">
                    무료로 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">
                    로그인
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-32" id="features">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold">주요 기능</h2>
              <p className="mt-4 text-muted-foreground">
                견적서 관리의 모든 과정을 간편하게
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="border-border">
                    <CardHeader>
                      <div className="mb-2">
                        <Icon aria-hidden="true" className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-32 border-t border-border bg-muted/40">
          <Container>
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">지금 바로 시작하세요</h2>
              <p className="text-muted-foreground text-lg">
                노션 API 키와 데이터베이스만 있으면 5분 안에 설정 완료.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button asChild size="lg">
                  <Link href="/signup">회원가입</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">로그인</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
