# 노션 견적서 웹 뷰어 - 개발 로드맵

## 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | invoice-web (노션 견적서 웹 뷰어) |
| **목표** | 노션 데이터베이스 기반 견적서를 클라이언트가 고유 URL로 열람하고 PDF로 다운로드하는 MVP 완성 |
| **주요 사용자** | 관리자(프리랜서/1인 에이전시), 클라이언트(수신자) |
| **운영 방식** | 회원가입/로그인 없음. 환경변수로 Notion 직접 연동, 대시보드에서 URL 복사 후 클라이언트 전달 |
| **전체 일정** | 2026-03-27 ~ 2026-04-24 (4주) |
| **현재 상태** | Phase 3 완료 — 대시보드 페이지, invoice-card 컴포넌트, Notion Relation 항목 연동 구현 |

### 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16.1.6 (App Router) + React 19 + TypeScript |
| 스타일링 | Tailwind CSS v4 + shadcn/ui + CVA |
| 노션 연동 | @notionhq/client (Notion API v1) |
| PDF 생성 | @react-pdf/renderer + Noto Sans KR |
| 알림 | Sonner |
| 배포 | Vercel |

---

## 마일스톤 개요

| Phase | 목표 | 기간 | 예상 완료일 | 상태 |
|-------|------|------|------------|------|
| Phase 1 | 프로젝트 골격 (환경변수 + Notion 클라이언트 + 공유 타입) | 3일 | 2026-03-30 | ✅ 완료 |
| Phase 2 | 핵심 기능 — 견적서 확인 페이지 (공개 URL + 항목 테이블) | 1주 | 2026-04-06 | ✅ 완료 |
| Phase 3 | 대시보드 페이지 (견적서 목록 + URL 복사) | 1주 | 2026-04-13 | ✅ 완료 |
| Phase 4 | PDF 생성 + 에러 처리 + Vercel 배포 | 1주 | 2026-04-24 | 🔲 미시작 |

---

## Phase 1: 프로젝트 골격

**기간**: 2026-03-27 ~ 2026-03-30

### 왜 이 순서인가?

Notion 클라이언트와 공유 타입은 Phase 2~3의 모든 페이지가 의존하는 기반이다. 이것들을 먼저 안정적으로 완성해두면 이후 단계는 "가져다 쓰기만" 하면 된다. 인증이 없으므로 미들웨어나 Supabase 설정 없이 바로 핵심 로직에 집중할 수 있다.

### 목표
환경변수 설정, Notion API 클라이언트 초기화, 데이터 파싱 유틸, 공유 타입 정의

### 세부 작업

#### 환경변수 설정
- [x] `.env.local` 설정 (난이도: 낮음)
  - `NOTION_TOKEN`: Notion Integration Token
  - `NOTION_DATABASE_ID`: 견적서 데이터베이스 ID

#### Notion 클라이언트
- [x] `@notionhq/client` 패키지 설치 (난이도: 낮음)
- [x] `src/lib/notion/client.ts` — 환경변수 기반 클라이언트 초기화 (난이도: 낮음)
- [x] `src/lib/notion/queries.ts` — 데이터베이스 쿼리 함수 (난이도: 중간)
  - `getInvoices()`: 전체 목록 조회
  - `getInvoiceBySlug(slug)`: slug로 단건 조회
  - ⚠️ @notionhq/client v5.x API 변경: `databases.query()` 제거 → `dataSources.query({ data_source_id })` 사용
- [x] `src/lib/notion/parser.ts` — Notion 속성 → 견적서 타입 변환 (난이도: 중간)
  - `items` 필드 JSON 파싱, 누락 필드 기본값 방어 처리
  - 금액 계산 (공급가액, 세액, 합계)
  - status 한/영 양방향 매핑

#### 공유 타입
- [x] `src/types/invoice.ts` 작성 (난이도: 낮음) — `src/types/index.ts` 삭제 후 재정의
  ```ts
  interface InvoiceItem {
    name: string;
    unit_price: number;
    quantity: number;
    tax_rate: number;
  }
  interface Invoice {
    id: string;
    slug: string;
    title: string;
    client_name: string;
    client_email: string;
    issue_date: string;
    expiry_date: string;
    status: 'draft' | 'sent' | 'approved' | 'expired';
    notes: string;
    items: InvoiceItem[];
  }
  ```

#### 스타터 잔재 파일 정리
- [x] `src/app/login/page.tsx` 삭제 (난이도: 낮음)
- [x] `src/app/signup/page.tsx` 삭제 (난이도: 낮음)
- [x] `src/app/settings/page.tsx` 삭제 (난이도: 낮음)
- [x] `src/lib/supabase.ts` 삭제 (난이도: 낮음)
- [x] `src/lib/notion.ts` 삭제 (난이도: 낮음)

#### 브랜딩 업데이트
- [x] `src/components/layout/header.tsx` — InvoiceWeb 브랜딩, 홈/대시보드 링크만 (난이도: 낮음)
- [x] `src/components/layout/footer.tsx` — InvoiceWeb 브랜딩으로 간소화 (난이도: 낮음)
- [x] `src/app/page.tsx` — /login, /signup 버튼 → /dashboard 버튼으로 교체 (난이도: 낮음)

### 완료 기준
- [x] `getInvoiceBySlug()` 유효한 slug로 데이터 반환 확인
- [x] 잘못된 Notion 속성명 → 파서가 기본값으로 처리 (에러 미발생)
- [x] 환경변수 누락 시 서버 시작 에러 발생 확인

### 관련 파일
- `src/lib/notion/client.ts`
- `src/lib/notion/queries.ts`
- `src/lib/notion/parser.ts`
- `src/types/invoice.ts`
- `.env.local`

---

## Phase 2: 핵심 기능 — 견적서 확인 페이지

**기간**: 2026-03-31 ~ 2026-04-06

### 왜 이 순서인가?

이 서비스의 핵심 가치는 클라이언트가 URL 하나로 견적서를 확인하는 것이다. 로그인도 필요 없고, 오직 Notion 데이터와 렌더링만 있으면 동작한다. 가장 단순하면서 가장 중요한 기능이므로 먼저 완성해서 핵심 가치를 검증한다.

### 목표
`/invoice/[slug]` 공개 페이지 완성. 클라이언트가 URL로 견적서를 열람하고 URL을 복사할 수 있는 상태.

### 세부 작업

#### 견적서 확인 페이지 (`/invoice/[slug]`)
- [x] 동적 라우트 페이지 `src/app/invoice/[slug]/page.tsx` (난이도: 낮음)
- [x] slug로 Notion 단건 조회, 없으면 `notFound()` (난이도: 중간)
- [x] 견적서 헤더 컴포넌트 `src/components/invoice/invoice-header.tsx` (난이도: 중간)
  - 발행자 정보 (회사명, 연락처)
  - 클라이언트 정보 (수신인, 이메일)
  - 메타 정보 (견적서 번호, 발행일, 유효기간, 상태 배지)
- [x] 견적 항목 테이블 `src/components/invoice/invoice-table.tsx` (난이도: 중간)
  - 컬럼: 서비스명 / 단가 / 수량 / 공급가액 / 세율 / 세액 / 합계
  - 하단: 소계 / 부가세(10%) / 총합계 요약
- [x] 비고/특이사항 텍스트 영역 (난이도: 낮음)
- [x] **공유 URL 복사** 버튼 — 클립보드 복사 + Sonner 토스트 (난이도: 낮음)
- [x] **PDF 다운로드** 버튼 플레이스홀더 (Phase 4에서 연결) (난이도: 낮음)

#### 404 페이지
- [x] `src/app/not-found.tsx` — "견적서를 찾을 수 없습니다" + 홈으로 이동 버튼 (난이도: 낮음)

### 완료 기준
- [x] `/invoice/[slug]` 접근 → 견적서 전체 내용 정상 렌더링
- [x] 금액 계산 정확성 (소계/부가세/총합계)
- [x] 존재하지 않는 slug → 404 페이지
- [x] URL 복사 버튼 → 클립보드 복사 + 토스트

### 관련 파일
- `src/app/invoice/[slug]/page.tsx`
- `src/app/not-found.tsx`
- `src/components/invoice/invoice-header.tsx`
- `src/components/invoice/invoice-table.tsx`

---

## Phase 3: 대시보드 페이지

**기간**: 2026-04-07 ~ 2026-04-13

### 왜 이 순서인가?

대시보드는 관리자(발행자)가 사용하는 화면이다. 핵심 기능(클라이언트 견적서 열람)이 동작한다는 것을 먼저 확인한 뒤, 관리 편의 기능을 추가한다. 인증이 없으므로 구현 복잡도가 낮다.

### 목표
관리자가 Notion DB 견적서 목록을 보고 공유 URL을 복사할 수 있는 대시보드 완성

### 세부 작업

#### 대시보드 (`/dashboard`)
- [x] 페이지 컴포넌트 `src/app/dashboard/page.tsx` (난이도: 낮음)
- [x] Server Component에서 Notion API 직접 호출 (`revalidate: 60`) (난이도: 중간)
- [x] 견적서 카드 컴포넌트 `src/components/invoice/invoice-card.tsx` (난이도: 중간)
  - 표시 항목: 견적서 번호, 클라이언트명, 총액, 발행일, 상태 배지
- [x] **공유 URL 복사** 버튼 — 클립보드 복사 + Sonner 토스트 (난이도: 낮음)
- [x] **미리보기** 버튼 → `/invoice/[slug]` 이동 (난이도: 낮음)
- [x] 빈 상태 UI — Notion 환경변수 미설정 시 안내 메시지 (난이도: 낮음)
- [x] 로딩 스켈레톤 `src/app/dashboard/loading.tsx` (난이도: 낮음)
- [x] Footer 누락 버그 수정 — 대시보드/견적서 페이지 (난이도: 낮음)
- [x] Notion Relation 타입 항목 연동 — Items DB 병렬 조회 (난이도: 중간)
  - `항목명`(Title), `수량`(Number), `단가`(Number) 파싱
  - 세율 미설정 시 기본값 10% 적용

#### 홈 페이지 업데이트
- [x] `src/app/page.tsx` — 서비스 소개 + 대시보드 이동 버튼 (난이도: 낮음)

### 완료 기준
- [x] 대시보드에서 Notion DB 견적서 목록 카드 렌더링
- [x] 미리보기 버튼 → `/invoice/[slug]` 이동
- [x] URL 복사 버튼 → 클립보드 복사 + 토스트

### 관련 파일
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/loading.tsx`
- `src/app/page.tsx`
- `src/components/invoice/invoice-card.tsx`

---

## Phase 4: PDF 생성 + 에러 처리 + 배포

**기간**: 2026-04-14 ~ 2026-04-24

### 왜 이 순서인가?

PDF 생성은 외부 라이브러리 의존도가 높고 한국어 폰트, 서버리스 타임아웃 등 환경 제약이 많아 가장 변수가 크다. 핵심 기능이 검증된 이후에 붙이는 것이 안전하다. 배포는 모든 기능이 로컬에서 동작한 이후 마지막에 진행해야 환경 변수 누락, 빌드 에러 등을 한 번에 해결할 수 있다.

### 목표
`@react-pdf/renderer` 기반 PDF 생성 구현, 에러 처리 강화, Vercel 프로덕션 배포 완료

### 세부 작업

#### PDF 생성
- [ ] `@react-pdf/renderer` 패키지 설치 (난이도: 낮음)
- [ ] 한국어 폰트 임베딩 설정 (난이도: 중간)
  - Noto Sans KR `.ttf` 파일 다운로드 → `public/fonts/`
  - `Font.register()` 설정
- [ ] PDF 문서 컴포넌트 `src/components/invoice/invoice-pdf.tsx` (난이도: 높음)
  - `Document`, `Page`, `View`, `Text`, `StyleSheet` 사용
  - 견적서 레이아웃 구현 (발행자 정보, 항목 테이블, 합계)
- [ ] Route Handler `src/app/api/invoice/[slug]/pdf/route.ts` (난이도: 중간)
  - Notion에서 slug로 데이터 조회
  - `renderToBuffer()` → `Content-Type: application/pdf` 응답
  - `Content-Disposition: attachment; filename="invoice-{slug}.pdf"`
- [ ] 견적서 확인 페이지 PDF 다운로드 버튼 연결 (난이도: 낮음)

#### 에러 처리 및 UX 보완
- [ ] 전역 에러 페이지 `src/app/error.tsx` (난이도: 낮음)
- [ ] Notion API 호출 실패 시 에러 UI (난이도: 낮음)
- [ ] 로딩 상태 전반적 검토 — Suspense 경계 점검 (난이도: 중간)
- [ ] 메타데이터 설정 (`src/app/layout.tsx` — title, description) (난이도: 낮음)
- [ ] 모바일(320px) ~ 데스크톱(1280px) 전 페이지 반응형 확인 (난이도: 중간)
- [ ] 견적 항목 테이블 모바일 대응 (가로 스크롤 또는 카드형) (난이도: 중간)

#### Vercel 배포
- [ ] GitHub 저장소 연결 및 Vercel 프로젝트 생성 (난이도: 낮음)
- [ ] Vercel 환경변수 설정 (난이도: 낮음)
  - `NOTION_TOKEN`, `NOTION_DATABASE_ID`
- [ ] `npm run build` 에러 없음 확인 (난이도: 낮음)
- [ ] 프로덕션 URL로 E2E 흐름 최종 검증 (난이도: 중간)
  - 대시보드 → URL 복사 → 클라이언트 접근 → 견적서 열람 → PDF 다운로드

### 완료 기준
- [ ] PDF 다운로드 버튼 클릭 → 파일 다운로드
- [ ] PDF 내 한국어 텍스트 정상 렌더링
- [ ] Vercel 프로덕션 URL에서 전체 기능 정상 동작

### 관련 파일
- `src/app/api/invoice/[slug]/pdf/route.ts`
- `src/components/invoice/invoice-pdf.tsx`
- `src/app/error.tsx`
- `src/app/layout.tsx`
- `public/fonts/NotoSansKR-Regular.ttf`

---

## 기술 아키텍처 결정사항

### 1. 인증 없는 단순 구조

**결정**: 회원가입/로그인 없음. 환경변수 단일 키 사용.
**이유**: 1인 관리자 운영 구조에서 멀티 유저 인증은 과도한 복잡도다. Notion API 키를 환경변수로 관리하고 대시보드는 URL 직접 접근으로 사용하면 충분하다.
**트레이드오프**: 대시보드 URL을 아는 누구나 견적서 목록을 볼 수 있다. 필요 시 Next.js 미들웨어로 IP 제한 또는 HTTP Basic Auth를 추가할 수 있다.

### 2. PDF 생성 위치

**결정**: Route Handler 전용 (`/api/invoice/[slug]/pdf`)
**이유**: `@react-pdf/renderer`의 `renderToBuffer()`는 서버 환경에서만 안정적으로 동작하며, 폰트 파일 접근도 서버 사이드에서 처리해야 한다.
**구현**: `GET /api/invoice/[slug]/pdf` → Notion 조회 → PDF 버퍼 → `application/pdf` 응답

### 3. Notion API 캐싱

**결정**: ISR `revalidate: 60` 사용
**이유**: Notion API 속도 제한(3req/s) 대응 및 성능 최적화. 60초마다 최신 데이터로 갱신.

---

## 리스크 레지스터

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|------------|----------|
| Notion API 속도 제한 (3req/s) | 중간 | 중간 | ISR `revalidate: 60` 캐싱, 요청 최소화 |
| @react-pdf 한국어 폰트 렌더링 실패 | 높음 | 중간 | Noto Sans KR TTF 사전 검증, 폴백으로 html2canvas + jsPDF 준비 |
| Vercel 서버리스 함수 타임아웃 (10초) | 높음 | 낮음 | PDF 생성 시간 측정, 복잡한 견적서 최적화 |
| Notion 데이터베이스 속성명 불일치 | 중간 | 높음 | 파서 모듈에서 방어적 파싱, 누락 필드 기본값 처리 |

---

## 향후 개선 사항 (MVP 이후 백로그)

### 기능 확장
- [ ] 대시보드 HTTP Basic Auth 보호 (간단한 접근 제어)
- [ ] 견적서 상태 관리 (승인/거절/만료 워크플로우)
- [ ] 클라이언트 디지털 서명 기능
- [ ] 이메일 자동 발송 (Resend 또는 SendGrid 연동)
- [ ] 견적서 버전 관리 및 수정 이력
- [ ] 멀티 유저 지원 (Supabase Auth 도입)

### 기술 개선
- [ ] E2E 테스트 (Playwright)
- [ ] 다국어 지원 (i18n)
- [ ] Puppeteer 기반 PDF 고품질 렌더링 (Vercel Edge 제약 검토)

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-03-20 | v1.0.0 | 초기 로드맵 작성 (PRD 기반 6개 Phase 구성) |
| 2026-03-20 | v1.1.0 | Phase 순서 재구성 — 기능 중심 → 의존성 중심 (골격→공통→핵심→추가→배포) |
| 2026-03-27 | v2.0.0 | 인증 제거 — 회원가입/로그인/Supabase Auth 삭제, 환경변수 단일 키 구조로 단순화, 4개 Phase로 재구성 |
| 2026-04-01 | v2.1.0 | Phase 1 구현 완료 — Notion 클라이언트 모듈화, 타입 재정의, 스타터 잔재 삭제, 브랜딩 업데이트. @notionhq/client v5.x API 변경사항(dataSources.query) 반영 |
| 2026-04-01 | v2.2.0 | Phase 2 구현 완료 — 견적서 확인 페이지(/invoice/[slug]), 404 페이지, invoice-header/invoice-table 컴포넌트 구현. 공유 URL 복사 + Sonner 토스트, PDF 다운로드 버튼 플레이스홀더 연결 |
| 2026-04-01 | v2.3.0 | Phase 3 구현 완료 — 대시보드 페이지, invoice-card 컴포넌트, 로딩 스켈레톤, ShareButton url prop 확장. Footer 누락 버그 수정. Notion Relation 타입 Items DB 연동(항목명/수량/단가 파싱, 세율 기본값 10%) |
