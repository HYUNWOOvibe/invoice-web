import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";

import { getInvoiceBySlug } from "@/lib/notion/queries";
import { InvoicePDF } from "@/components/invoice/invoice-pdf";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const invoice = await getInvoiceBySlug(slug);

    if (!invoice) {
      return NextResponse.json(
        { error: "견적서를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // @react-pdf/renderer로 PDF 버퍼 생성
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(
      React.createElement(InvoicePDF, { invoice }) as any
    );

    return new Response(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${slug}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF 생성 오류:", error);
    return NextResponse.json(
      { error: "PDF 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
