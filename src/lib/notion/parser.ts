import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { Invoice } from "@/types/invoice";

// Notion Status/Select 값 → Invoice status enum 매핑 (한/영 양방향)
const STATUS_MAP: Record<string, Invoice["status"]> = {
  초안: "draft",
  draft: "draft",
  발송: "sent",
  sent: "sent",
  승인: "approved",
  approved: "approved",
  만료: "expired",
  expired: "expired",
};

// Title 속성에서 plain_text 추출
function getTitle(properties: PageObjectResponse["properties"], key: string): string {
  const prop = properties[key];
  if (!prop || prop.type !== "title") return "";
  return prop.title[0]?.plain_text ?? "";
}

// Rich Text 속성에서 plain_text 추출
function getRichText(properties: PageObjectResponse["properties"], key: string): string {
  const prop = properties[key];
  if (!prop || prop.type !== "rich_text") return "";
  return prop.rich_text[0]?.plain_text ?? "";
}

// Email 속성 추출
function getEmail(properties: PageObjectResponse["properties"], key: string): string {
  const prop = properties[key];
  if (!prop || prop.type !== "email") return "";
  return prop.email ?? "";
}

// Date 속성 추출
function getDate(properties: PageObjectResponse["properties"], key: string): string {
  const prop = properties[key];
  if (!prop || prop.type !== "date") return "";
  return prop.date?.start ?? "";
}

// Select 속성 추출
function getSelect(properties: PageObjectResponse["properties"], key: string): string {
  const prop = properties[key];
  if (!prop || prop.type !== "select") return "";
  return prop.select?.name ?? "";
}

// Status 속성 추출 (Notion의 status 타입)
function getStatus(properties: PageObjectResponse["properties"], key: string): string {
  const prop = properties[key];
  if (!prop || prop.type !== "status") return "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prop as any).status?.name ?? "";
}

// items JSON 문자열 파싱 (rich_text에 JSON이 있는 경우)
function parseItemsFromJson(itemsText: string) {
  if (!itemsText) return [];
  try {
    const parsed = JSON.parse(itemsText);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.name === "string" &&
        typeof item.unit_price === "number" &&
        typeof item.quantity === "number" &&
        typeof item.tax_rate === "number"
    );
  } catch {
    return [];
  }
}

// Notion PageObjectResponse → Invoice 타입 변환
// 실제 데이터베이스 속성명(한국어)과 영어 속성명 모두 지원
// items는 Relation 조회 후 외부에서 주입 (queries.ts에서 처리)
export function parseInvoice(page: PageObjectResponse, items: Invoice["items"] = []): Invoice {
  const { properties } = page;

  // 상태: status 타입 또는 select 타입 모두 지원
  const statusText =
    getStatus(properties, "상태") ||
    getStatus(properties, "status") ||
    getSelect(properties, "상태") ||
    getSelect(properties, "status");
  const status: Invoice["status"] = STATUS_MAP[statusText] ?? "draft";

  // items가 비어있으면 rich_text JSON 폴백 시도 (하위 호환)
  const resolvedItems = items.length > 0
    ? items
    : parseItemsFromJson(getRichText(properties, "항목") || getRichText(properties, "items"));

  return {
    id: page.id,
    slug:
      getTitle(properties, "견적서 번호") ||
      getRichText(properties, "slug") ||
      page.id,
    title:
      getTitle(properties, "title") ||
      getTitle(properties, "견적서 번호") ||
      getRichText(properties, "slug") ||
      "견적서",
    client_name:
      getRichText(properties, "클라이언트 명") ||
      getRichText(properties, "client_name"),
    client_email:
      getEmail(properties, "client_email") ||
      getEmail(properties, "클라이언트 이메일") ||
      getRichText(properties, "client_email"),
    issue_date:
      getDate(properties, "발행일") || getDate(properties, "issue_date"),
    expiry_date:
      getDate(properties, "유효기간") || getDate(properties, "expiry_date"),
    status,
    notes:
      getRichText(properties, "비고") || getRichText(properties, "notes"),
    items: resolvedItems,
  };
}
