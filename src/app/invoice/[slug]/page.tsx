import { Container } from "@/components/layout/container";

// TODO: slug로 Supabase에서 견적서 데이터 조회 예정

interface InvoicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function InvoicePage({ params }: InvoicePageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen py-8">
      <Container>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold">견적서</h1>
            <p className="text-muted-foreground mt-1">견적서 ID: {slug}</p>
          </div>
          {/* TODO: 견적서 상세 내용 및 PDF 다운로드 버튼 구현 예정 */}
          <p className="text-muted-foreground text-sm">견적서 내용이 여기에 표시됩니다.</p>
        </div>
      </Container>
    </main>
  );
}
