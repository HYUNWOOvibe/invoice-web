import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FileDown } from "lucide-react";

import { getInvoiceBySlug } from "@/lib/notion/queries";
import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { InvoiceHeader } from "@/components/invoice/invoice-header";
import { InvoiceTable } from "@/components/invoice/invoice-table";
import { ShareButton } from "@/components/invoice/share-button";
import { Button } from "@/components/ui/button";

// ISR 캐싱 — 60초마다 최신 데이터로 갱신
export const revalidate = 60;

interface InvoicePageProps {
  params: Promise<{ slug: string }>;
}

// 페이지 메타데이터 동적 생성
export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const invoice = await getInvoiceBySlug(slug);

  return {
    title: invoice
      ? `${invoice.title} | InvoiceWeb`
      : "견적서 | InvoiceWeb",
  };
}

// 견적서 확인 페이지 — 클라이언트가 고유 URL로 접근하는 공개 페이지
export default async function InvoicePage({ params }: InvoicePageProps) {
  const { slug } = await params;
  const invoice = await getInvoiceBySlug(slug);

  // 존재하지 않는 slug → 404 페이지
  if (!invoice) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 md:py-12">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 견적서 헤더 — 발행자/클라이언트/메타 정보 */}
          <InvoiceHeader invoice={invoice} />

          {/* 견적 항목 테이블 */}
          <InvoiceTable items={invoice.items} />

          {/* 비고/특이사항 — 내용이 있을 때만 렌더링 */}
          {invoice.notes && (
            <div className="rounded-lg border border-border bg-muted/40 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                비고
              </h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* 액션 버튼 영역 */}
          <div className="flex gap-3 justify-end">
            <ShareButton />
            <Button asChild>
              <Link
                href={`/api/invoice/${invoice.slug}/pdf`}
                download
              >
                <FileDown className="mr-2 h-4 w-4" />
                PDF 다운로드
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
