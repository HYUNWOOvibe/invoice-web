import { NextResponse } from "next/server";

// TODO: @notionhq/client로 노션 연동 테스트 구현 예정

export async function GET() {
  // TODO: 노션 API 키로 연결 테스트 수행
  return NextResponse.json(
    { message: "노션 연동 테스트 API - 구현 예정" },
    { status: 501 }
  );
}
