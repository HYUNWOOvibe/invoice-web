import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { Invoice, InvoiceItem } from "@/types/invoice";
import { notionClient, DATABASE_ID } from "./client";
import { parseInvoice } from "./parser";

// ISR 캐싱 — Notion API 속도 제한(3req/s) 대응
export const revalidate = 60;

// QueryDatabaseResponse results에서 PageObjectResponse만 필터링
function isPageObject(
  result: PageObjectResponse | { object: string }
): result is PageObjectResponse {
  return result.object === "page" && "properties" in result;
}

// Relation으로 연결된 Items DB 페이지에서 견적 항목 파싱
function parseItemPage(page: PageObjectResponse): InvoiceItem {
  const props = page.properties;

  // 항목명 (Title 타입)
  const nameProp = props["항목명"];
  const name =
    nameProp?.type === "title" ? (nameProp.title[0]?.plain_text ?? "") : "";

  // 수량 (Number 타입)
  const quantityProp = props["수량"];
  const quantity =
    quantityProp?.type === "number" ? (quantityProp.number ?? 1) : 1;

  // 단가 (Number 타입)
  const unitPriceProp = props["단가"];
  const unit_price =
    unitPriceProp?.type === "number" ? (unitPriceProp.number ?? 0) : 0;

  // 세율: Items DB에 없으면 기본값 10%
  const taxRateProp = props["세율"] ?? props["tax_rate"];
  const tax_rate =
    taxRateProp?.type === "number" ? (taxRateProp.number ?? 10) : 10;

  return { name, unit_price, quantity, tax_rate };
}

// 견적서 페이지의 Relation 항목 IDs → InvoiceItem[] 조회
async function fetchRelationItems(page: PageObjectResponse): Promise<InvoiceItem[]> {
  const itemsProp = page.properties["항목"] ?? page.properties["items"];
  if (!itemsProp || itemsProp.type !== "relation") return [];

  const relationIds = itemsProp.relation.map((r) => r.id);
  if (relationIds.length === 0) return [];

  // 각 항목 페이지를 병렬로 조회
  const itemPages = await Promise.all(
    relationIds.map((id) => notionClient.pages.retrieve({ page_id: id }))
  );

  return itemPages
    .filter(isPageObject)
    .map(parseItemPage);
}

// 전체 견적서 목록 조회
export async function getInvoices(): Promise<Invoice[]> {
  const response = await notionClient.databases.query({
    database_id: DATABASE_ID,
    sorts: [{ property: "발행일", direction: "descending" }],
  });

  const pages = response.results.filter(isPageObject);

  // 각 견적서의 Relation 항목을 병렬로 조회
  return Promise.all(
    pages.map(async (page) => {
      const items = await fetchRelationItems(page);
      return parseInvoice(page, items);
    })
  );
}

// slug로 단건 견적서 조회 (없으면 null 반환)
export async function getInvoiceBySlug(slug: string): Promise<Invoice | null> {
  // 견적서 번호(title 타입)로 조회
  const response = await notionClient.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: "견적서 번호",
      title: { equals: slug },
    },
  });

  const page = response.results.find(isPageObject);
  if (!page) return null;

  const items = await fetchRelationItems(page);
  return parseInvoice(page, items);
}
