import { Client } from "@notionhq/client";

// 환경변수 검증 — 누락 시 서버 시작 에러 발생
const notionToken = process.env.NOTION_TOKEN;
if (!notionToken) {
  throw new Error("NOTION_TOKEN 환경변수가 설정되지 않았습니다.");
}

const databaseId = process.env.NOTION_DATABASE_ID;
if (!databaseId) {
  throw new Error("NOTION_DATABASE_ID 환경변수가 설정되지 않았습니다.");
}

export const notionClient = new Client({ auth: notionToken });

export const DATABASE_ID: string = databaseId;
