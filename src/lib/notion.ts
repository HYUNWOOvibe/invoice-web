import { Client } from "@notionhq/client";

// TODO: 사용자별 API 키로 동적 클라이언트 생성 구현 예정

// 서버 사이드 전용 Notion 클라이언트 초기화
export function createNotionClient(apiKey: string): Client {
  return new Client({ auth: apiKey });
}

// 환경변수 기반 기본 클라이언트 (서버 전용 작업용)
export const notionClient = process.env.NOTION_API_KEY
  ? new Client({ auth: process.env.NOTION_API_KEY })
  : null;
