import { NextRequest, NextResponse } from "next/server";

// TODO: @react-pdf/renderer로 PDF 생성 구현 예정

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // TODO: slug로 견적서 데이터 조회 후 PDF 생성
  return NextResponse.json(
    { message: `PDF 생성 예정: ${slug}` },
    { status: 501 }
  );
}
