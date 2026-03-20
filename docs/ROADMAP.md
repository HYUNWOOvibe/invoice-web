# 노션 견적서 웹 뷰어 - 개발 로드맵

## 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | invoice-web (노션 견적서 웹 뷰어) |
| **목표** | 노션 데이터베이스 기반 견적서를 클라이언트가 고유 URL로 열람하고 PDF로 다운로드하는 MVP 완성 |
| **주요 사용자** | 발행자(프리랜서/1인 에이전시), 클라이언트(수신자) |
| **전체 일정** | 2026-03-20 ~ 2026-05-09 (7주) |
| **현재 상태** | 프로젝트 스켈레톤 완성 (Next.js + shadcn + 레이아웃 구조) |

### 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16.1.6 (App Router) + React 19 + TypeScript |
| 스타일링 | Tailwind CSS v4 + shadcn/ui + CVA |
| 폼/검증 | React Hook Form + Zod |
| 인증/DB | Supabase (Auth + PostgreSQL) |
| 노션 연동 | @notionhq/client (Notion API v1) |
| PDF 생성 | @react-pdf/renderer + Noto Sans KR |
| 알림 | Sonner |
| 배포 | Vercel |

---

## 마일스톤 개요

| Phase | 목표 | 기간 | 예상 완료일 | 상태 |
|-------|------|------|------------|------|
| Phase 1 | 프로젝트 골격 (환경 설정 + DB 스키마 + 라우트 보호) | 1주 | 2026-03-27 | 🔲 미시작 |
| Phase 2 | 공통 모듈 (인증 흐름 + Notion 클라이언트 + 타입) | 1주 | 2026-04-03 | 🔲 미시작 |
| Phase 3 | 핵심 기능 — 견적서 확인 페이지 (공개 URL + 항목 테이블) | 1.5주 | 2026-04-14 | 🔲 미시작 |
| Phase 4 | 추가 기능 — 대시보드 + 설정 페이지 | 1.5주 | 2026-04-25 | 🔲 미시작 |
| Phase 5 | 최적화 및 배포 (PDF 생성 + Vercel 배포) | 1주 | 2026-05-09 | 🔲 미시작 |

---

## Phase 1: 프로젝트 골격

**기간**: 2026-03-20 ~ 2026-03-27

### 왜 이 순서인가?

골격이 없으면 어떤 코드도 제대로 실행되지 않는다. 환경변수 누락, DB 연결 실패, 잘못된 라우트 보호는 이후 모든 단계에서 디버깅을 어렵게 만든다. Phase 1에서 인프라를 완전히 굳혀두면 이후 단계는 "기능만" 집중할 수 있다.

### 목표
Supabase 프로젝트 설정, DB 스키마 마이그레이션, Next.js 미들웨어로 인증 라우트 보호 기반 마련

### 세부 작업

#### 환경 설정
- [ ] Supabase 프로젝트 생성 및 환경변수 설정 (난이도: 낮음)
  - `.env.local`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `NOTION_TOKEN`, `NOTION_DATABASE_ID`
- [ ] `@supabase/ssr` 패키지 설치 및 클라이언트 이중화 설정 (난이도: 중간)
  - `src/lib/supabase/client.ts` — 브라우저용 (`createBrowserClient`)
  - `src/lib/supabase/server.ts` — Server Component용 (`createServerClient`)

#### DB 스키마
- [ ] `notion_configs` 테이블 생성 (난이도: 낮음)
  ```sql
  CREATE TABLE notion_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notion_token TEXT NOT NULL,
    database_id TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
  );
  ```
- [ ] RLS(Row Level Security) 정책 설정 (난이도: 중간)
  - `notion_configs`: 본인 row만 SELECT/INSERT/UPDATE 허용

#### 라우트 보호
- [ ] `src/middleware.ts` 작성 (난이도: 중간)
  - 보호 경로: `/dashboard`, `/settings`
  - 공개 경로: `/`, `/login`, `/signup`, `/invoice/[slug]`
  - 미인증 접근 시 `/login` 리디렉션

### 완료 기준
- [ ] Supabase 콘솔에서 테이블 및 RLS 정책 확인
- [ ] `/dashboard` 접근 시 미인증이면 `/login`으로 리디렉션
- [ ] 환경변수 누락 시 서버 시작 에러 발생 확인

### 관련 파일
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/middleware.ts`
- `.env.local`

---

## Phase 2: 공통 모듈

**기간**: 2026-03-28 ~ 2026-04-03

### 왜 이 순서인가?

인증과 Notion 클라이언트는 Phase 3~4의 모든 페이지가 공통으로 의존한다. 이것들이 불안정하면 핵심 기능을 만들다가 계속 돌아와서 고쳐야 한다. 먼저 완성해두고 이후 단계는 "가져다 쓰기만" 하는 상태를 만드는 것이 목표다.

### 목표
Supabase Auth 기반 인증 흐름 완성, Notion API 클라이언트 및 데이터 파싱 유틸 구성, 공유 타입 정의

### 세부 작업

#### 인증 흐름
- [ ] 로그인 페이지 `src/app/login/page.tsx` (난이도: 낮음)
  - React Hook Form + Zod: 이메일 형식, 비밀번호 최소 8자 검증
  - Supabase `signInWithPassword` 연동
  - 성공 → `/dashboard`, 실패 → Sonner 에러 토스트
- [ ] 회원가입 페이지 `src/app/signup/page.tsx` (난이도: 낮음)
  - Zod 스키마: 이름, 이메일, 비밀번호/확인 일치 검증
  - Supabase `signUp` 연동
  - 성공 → `/settings` 리디렉션
- [ ] 헤더 인증 상태 연동 `src/components/layout/header.tsx` (난이도: 중간)
  - 비로그인: 로그인/회원가입 버튼
  - 로그인: 견적서 관리/설정/로그아웃 메뉴
  - `signOut` 후 `/` 리디렉션
- [ ] 홈 페이지 `/` — 로그인 상태 시 `/dashboard` 자동 리디렉션 (난이도: 낮음)

#### Notion 클라이언트
- [ ] `@notionhq/client` 패키지 설치 (난이도: 낮음)
- [ ] `src/lib/notion/client.ts` — 환경변수 기반 클라이언트 초기화 (난이도: 낮음)
- [ ] `src/lib/notion/queries.ts` — 데이터베이스 쿼리 함수 (난이도: 중간)
  - `getInvoices(databaseId)`: 목록 조회
  - `getInvoiceBySlug(databaseId, slug)`: slug로 단건 조회
- [ ] `src/lib/notion/parser.ts` — Notion 속성 → 견적서 타입 변환 (난이도: 중간)
  - `items` 필드 JSON 파싱, 누락 필드 기본값 방어 처리
  - 금액 계산 (공급가액, 세액, 합계)

#### 공유 타입
- [ ] `src/types/invoice.ts` 작성 (난이도: 낮음)
  ```ts
  interface InvoiceItem {
    name: string;
    unit_price: number;
    quantity: number;
    tax_rate: number;
  }
  interface Invoice {
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

### 완료 기준
- [ ] 로그인/회원가입/로그아웃 E2E 흐름 동작 확인
- [ ] `getInvoiceBySlug()` 유효한 slug로 데이터 반환 확인
- [ ] 잘못된 Notion 속성명 → 파서가 기본값으로 처리 (에러 미발생)

### 관련 파일
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/page.tsx`
- `src/components/layout/header.tsx`
- `src/lib/notion/client.ts`
- `src/lib/notion/queries.ts`
- `src/lib/notion/parser.ts`
- `src/types/invoice.ts`

---

## Phase 3: 핵심 기능 — 견적서 확인 페이지

**기간**: 2026-04-04 ~ 2026-04-14

### 왜 이 순서인가?

이 서비스의 존재 이유는 클라이언트가 URL 하나로 견적서를 확인하는 것이다. 로그인도 필요 없고, Supabase도 필요 없고, 오직 Notion 데이터와 렌더링만 있으면 동작한다. 가장 단순하면서도 가장 중요한 기능이므로 가장 먼저 완성해서 핵심 가치를 검증한다.

### 목표
`/invoice/[slug]` 공개 페이지 완성. 클라이언트가 URL로 견적서를 열람하고 URL을 복사할 수 있는 상태.

### 세부 작업

#### 견적서 확인 페이지 (`/invoice/[slug]`)
- [ ] 동적 라우트 페이지 `src/app/invoice/[slug]/page.tsx` (난이도: 낮음)
- [ ] slug로 Notion 단건 조회, 없으면 `notFound()` (난이도: 중간)
- [ ] 견적서 헤더 컴포넌트 `src/components/invoice/invoice-header.tsx` (난이도: 중간)
  - 발행자 정보 (회사명, 연락처)
  - 클라이언트 정보 (수신인, 이메일)
  - 메타 정보 (견적서 번호, 발행일, 유효기간, 상태 배지)
- [ ] 견적 항목 테이블 `src/components/invoice/invoice-table.tsx` (난이도: 중간)
  - 컬럼: 서비스명 / 단가 / 수량 / 공급가액 / 세율 / 세액 / 합계
  - 하단: 소계 / 부가세(10%) / 총합계 요약
- [ ] 비고/특이사항 텍스트 영역 (난이도: 낮음)
- [ ] **공유 URL 복사** 버튼 — 클립보드 복사 + Sonner 토스트 (난이도: 낮음)
- [ ] **PDF 다운로드** 버튼 플레이스홀더 (Phase 5에서 연결) (난이도: 낮음)

#### 404 페이지
- [ ] `src/app/not-found.tsx` — "견적서를 찾을 수 없습니다" + 홈으로 이동 버튼 (난이도: 낮음)

### 완료 기준
- [ ] `/invoice/[slug]` 접근 → 견적서 전체 내용 정상 렌더링
- [ ] 금액 계산 정확성 (소계/부가세/총합계)
- [ ] 존재하지 않는 slug → 404 페이지
- [ ] URL 복사 버튼 → 클립보드 복사 + 토스트

### 관련 파일
- `src/app/invoice/[slug]/page.tsx`
- `src/app/not-found.tsx`
- `src/components/invoice/invoice-header.tsx`
- `src/components/invoice/invoice-table.tsx`

---

## Phase 4: 추가 기능 — 대시보드 + 설정 페이지

**기간**: 2026-04-15 ~ 2026-04-25

### 왜 이 순서인가?

대시보드와 설정 페이지는 발행자(서비스 운영자)가 사용하는 화면이다. 핵심 기능(클라이언트 견적서 열람)이 동작한다는 것을 먼저 확인한 뒤, 발행자 편의 기능을 추가하는 순서가 맞다. 또한 이 두 페이지는 인증이 필요하므로 Phase 1~2의 골격이 안정된 이후에 구현하는 것이 자연스럽다.

### 목표
발행자가 Notion 연동을 설정하고, 견적서 목록을 관리하며, 공유 URL을 복사할 수 있는 화면 완성

### 세부 작업

#### 설정 페이지 (`/settings`)
- [ ] 페이지 컴포넌트 생성 `src/app/settings/page.tsx` (난이도: 낮음)
- [ ] Notion Token + Database ID 입력 폼 (난이도: 낮음)
  - Token 필드: `type="password"` 마스킹
- [ ] **연결 테스트** 버튼 → Server Action으로 Notion API 호출 검증 (난이도: 중간)
  - 성공/실패 Sonner 토스트
- [ ] **저장** 버튼 → Supabase `notion_configs` upsert (난이도: 낮음)
- [ ] 페이지 로드 시 기존 설정값 불러오기 (난이도: 낮음)

#### 견적서 관리 페이지 (`/dashboard`)
- [ ] 페이지 컴포넌트 생성 `src/app/dashboard/page.tsx` (난이도: 낮음)
- [ ] Server Component에서 Notion API 직접 호출 (`revalidate: 60`) (난이도: 중간)
- [ ] 견적서 카드 컴포넌트 `src/components/invoice/invoice-card.tsx` (난이도: 중간)
  - 표시 항목: 견적서 번호, 클라이언트명, 총액, 발행일, 상태 배지
- [ ] **공유 URL 복사** 버튼 — 클립보드 복사 + Sonner 토스트 (난이도: 낮음)
- [ ] **미리보기** 버튼 → `/invoice/[slug]` 이동 (난이도: 낮음)
- [ ] 빈 상태 UI — Notion 미연동 시 설정 페이지 유도 (난이도: 낮음)
- [ ] 로딩 스켈레톤 `src/app/dashboard/loading.tsx` (난이도: 낮음)

### 완료 기준
- [ ] 유효한 Notion 자격증명으로 연결 테스트 성공 토스트
- [ ] 저장 후 페이지 새로고침 시 기존 값 복원
- [ ] 대시보드에서 Notion DB 견적서 목록 카드 렌더링
- [ ] 미리보기 버튼 → `/invoice/[slug]` 이동

### 관련 파일
- `src/app/settings/page.tsx`
- `src/app/settings/actions.ts`
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/loading.tsx`
- `src/components/invoice/invoice-card.tsx`

---

## Phase 5: 최적화 및 배포

**기간**: 2026-04-26 ~ 2026-05-09

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
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `NOTION_TOKEN`, `NOTION_DATABASE_ID`
- [ ] `npm run build` 에러 없음 확인 (난이도: 낮음)
- [ ] 프로덕션 URL로 E2E 흐름 최종 검증 (난이도: 중간)
  - 회원가입 → 노션 설정 → 견적서 목록 → URL 복사 → 클라이언트 접근 → PDF 다운로드

### 완료 기준
- [ ] PDF 다운로드 버튼 클릭 → 파일 다운로드
- [ ] PDF 내 한국어 텍스트 정상 렌더링
- [ ] Vercel 프로덕션 URL에서 전체 기능 정상 동작
- [ ] 타 사용자의 `notion_config` 접근 불가 (RLS 검증)

### 관련 파일
- `src/app/api/invoice/[slug]/pdf/route.ts`
- `src/components/invoice/invoice-pdf.tsx`
- `src/app/error.tsx`
- `src/app/layout.tsx`
- `public/fonts/NotoSansKR-Regular.ttf`

---

## 기술 아키텍처 결정사항

### 1. 공개 URL의 Notion API 키 처리

**결정**: MVP는 환경변수 단일 키 사용
**이유**: 멀티 유저 시나리오에서 각 발행자의 Notion 토큰을 Supabase `notion_configs`에 저장하지만, `/invoice/[slug]` 공개 페이지는 발행자가 누구인지 알 수 없어 slug → user 역매핑이 필요하다. MVP에서는 단일 발행자를 가정하고 환경변수 토큰 사용.
**백로그**: 멀티 유저는 Invoice 캐시 테이블에 `user_id` FK를 두고 slug로 user → notion_config를 역조회하는 방식으로 확장

### 2. PDF 생성 위치

**결정**: Route Handler 전용 (`/api/invoice/[slug]/pdf`)
**이유**: `@react-pdf/renderer`의 `renderToBuffer()`는 서버 환경에서만 안정적으로 동작하며, 폰트 파일 접근도 서버 사이드에서 처리해야 한다. 클라이언트 사이드 렌더링 시 번들 크기 증가 및 폰트 로딩 문제 발생.
**구현**: `GET /api/invoice/[slug]/pdf` → Notion 조회 → PDF 버퍼 → `application/pdf` 응답

### 3. Supabase 클라이언트 이중화

**결정**: 브라우저용 vs Server Component용 분리 (`@supabase/ssr`)
**이유**: Next.js App Router에서 Server Component와 Client Component는 서로 다른 환경에서 실행된다. `@supabase/ssr`의 `createBrowserClient()`는 쿠키 기반 세션을 브라우저에서, `createServerClient()`는 서버에서 각각 처리한다. 혼용 시 세션 동기화 오류 발생.
**구현**:
- `src/lib/supabase/client.ts` — `createBrowserClient()` (Client Component용)
- `src/lib/supabase/server.ts` — `createServerClient()` + `cookies()` (Server Component/Route Handler용)

---

## 리스크 레지스터

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|------------|----------|
| Notion API 속도 제한 (3req/s) | 중간 | 중간 | ISR `revalidate: 60` 캐싱, 대시보드 요청 최소화 |
| @react-pdf 한국어 폰트 렌더링 실패 | 높음 | 중간 | Noto Sans KR TTF 사전 검증, 폴백으로 html2canvas + jsPDF 준비 |
| Vercel 서버리스 함수 타임아웃 (10초) | 높음 | 낮음 | PDF 생성 시간 측정, 복잡한 견적서 최적화 |
| Supabase RLS 정책 누락으로 데이터 노출 | 높음 | 낮음 | 배포 전 RLS 정책 전수 검증, Supabase 대시보드 확인 |
| Notion 데이터베이스 속성명 불일치 | 중간 | 높음 | 파서 모듈에서 방어적 파싱, 누락 필드 기본값 처리 |

---

## 향후 개선 사항 (MVP 이후 백로그)

### 기능 확장
- [ ] 멀티 유저 Notion 연동 (slug → user_id 역매핑)
- [ ] 견적서 상태 관리 (승인/거절/만료 워크플로우)
- [ ] 클라이언트 디지털 서명 기능
- [ ] 이메일 자동 발송 (Resend 또는 SendGrid 연동)
- [ ] 견적서 버전 관리 및 수정 이력
- [ ] Notion 데이터베이스 속성 커스터마이징 UI

### 기술 개선
- [ ] Notion 데이터 Supabase 캐시 동기화 (웹훅 또는 주기적 sync)
- [ ] E2E 테스트 (Playwright)
- [ ] 다국어 지원 (i18n)
- [ ] Puppeteer 기반 PDF 고품질 렌더링 (Vercel Edge 제약 검토)

---

## 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-03-20 | v1.0.0 | 초기 로드맵 작성 (PRD 기반 6개 Phase 구성) |
| 2026-03-20 | v1.1.0 | Phase 순서 재구성 — 기능 중심 → 의존성 중심 (골격→공통→핵심→추가→배포), 각 Phase에 순서 이유 추가 |
