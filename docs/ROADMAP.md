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
| Phase 1 | 인프라 기반 구축 (Supabase DB + 미들웨어) | 1주 | 2026-03-27 | 🔲 미시작 |
| Phase 2 | 인증 기능 (로그인/회원가입) | 1주 | 2026-04-03 | 🔲 미시작 |
| Phase 3 | 노션 연동 및 설정 페이지 | 1.5주 | 2026-04-14 | 🔲 미시작 |
| Phase 4 | 핵심 UI (대시보드 + 견적서 확인 페이지) | 1.5주 | 2026-04-25 | 🔲 미시작 |
| Phase 5 | PDF 생성 | 1주 | 2026-05-02 | 🔲 미시작 |
| Phase 6 | 마무리 및 Vercel 배포 | 1주 | 2026-05-09 | 🔲 미시작 |

---

## Phase 1: 인프라 기반 구축

**기간**: 2026-03-20 ~ 2026-03-27

### 목표
Supabase 프로젝트 설정, DB 스키마 마이그레이션, Next.js 미들웨어로 인증 라우트 보호 기반 마련

### 세부 작업

#### Supabase 설정
- [ ] Supabase 프로젝트 생성 및 환경변수 설정 (난이도: 낮음)
  - `.env.local`: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `@supabase/ssr` 패키지 설치 및 클라이언트 이중화 설정 (난이도: 중간)
  - `src/lib/supabase/client.ts` — 브라우저용 클라이언트
  - `src/lib/supabase/server.ts` — Server Component용 클라이언트
- [ ] Notion API 키 환경변수 추가 (난이도: 낮음)
  - `NOTION_TOKEN`, `NOTION_DATABASE_ID`

#### DB 스키마
- [ ] `users` 테이블 — Supabase Auth 연동 (난이도: 낮음)
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

#### 미들웨어
- [ ] `src/middleware.ts` 작성 (난이도: 중간)
  - 보호 경로: `/dashboard`, `/settings`
  - 공개 경로: `/`, `/login`, `/signup`, `/invoice/[slug]`
  - 미인증 접근 시 `/login` 리디렉션

### 완료 기준
- [ ] Supabase 콘솔에서 테이블 및 RLS 정책 확인
- [ ] `/dashboard` 접근 시 미인증이면 `/login`으로 리디렉션
- [ ] 환경변수 누락 시 빌드 에러 발생 (타입 검증)

### 관련 파일
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/middleware.ts`
- `.env.local`

---

## Phase 2: 인증 기능

**기간**: 2026-03-28 ~ 2026-04-03

### 목표
Supabase Auth 기반 로그인/회원가입/로그아웃 구현. 발행자 전용 인증 흐름 완성.

### 세부 작업

#### 로그인 페이지 (`/login`)
- [ ] 페이지 컴포넌트 생성 `src/app/login/page.tsx` (난이도: 낮음)
- [ ] React Hook Form + Zod 로그인 스키마 정의 (난이도: 낮음)
  - 이메일 형식 검증, 비밀번호 최소 8자 검증
- [ ] Supabase `signInWithPassword` 연동 (난이도: 낮음)
- [ ] 성공 → `/dashboard` 리디렉션, 실패 → Sonner 에러 토스트 (난이도: 낮음)

#### 회원가입 페이지 (`/signup`)
- [ ] 페이지 컴포넌트 생성 `src/app/signup/page.tsx` (난이도: 낮음)
- [ ] Zod 스키마: 이름, 이메일, 비밀번호, 비밀번호 확인 일치 검증 (난이도: 낮음)
- [ ] Supabase `signUp` 연동 (난이도: 낮음)
- [ ] 성공 → `/settings` 리디렉션 (Notion 연동 안내) (난이도: 낮음)

#### 헤더 인증 상태 연동
- [ ] `src/components/layout/header.tsx` 수정 (난이도: 중간)
  - 비로그인: 로그인/회원가입 버튼 표시
  - 로그인: 견적서 관리/설정/로그아웃 메뉴 표시
- [ ] `signOut` 로그아웃 처리 후 `/` 리디렉션 (난이도: 낮음)

#### 홈 페이지 (`/`)
- [ ] 로그인 상태 감지 → `/dashboard` 자동 리디렉션 (난이도: 낮음)
- [ ] 서비스 소개 랜딩 콘텐츠 작성 (난이도: 낮음)

### 완료 기준
- [ ] 올바른 이메일/비밀번호로 로그인 → `/dashboard` 이동
- [ ] 잘못된 자격증명 → 에러 토스트 표시
- [ ] 회원가입 → `/settings` 이동
- [ ] 로그아웃 → `/` 이동, 헤더 상태 변경

### 관련 파일
- `src/app/login/page.tsx`
- `src/app/signup/page.tsx`
- `src/app/page.tsx`
- `src/components/layout/header.tsx`

---

## Phase 3: 노션 연동 및 설정 페이지

**기간**: 2026-04-04 ~ 2026-04-14

### 목표
Notion API 클라이언트 구성, 설정 페이지에서 API 키 저장/테스트, 견적서 데이터 파싱 유틸 작성

### 세부 작업

#### Notion 클라이언트
- [ ] `@notionhq/client` 패키지 설치 (난이도: 낮음)
- [ ] `src/lib/notion/client.ts` 작성 (난이도: 중간)
  - 환경변수 기반 Notion 클라이언트 초기화
- [ ] `src/lib/notion/queries.ts` — 데이터베이스 쿼리 함수 (난이도: 중간)
  - `getInvoices(databaseId)`: 목록 조회
  - `getInvoiceBySlug(databaseId, slug)`: slug로 단건 조회
- [ ] `src/lib/notion/parser.ts` — Notion 속성 → 견적서 타입 변환 (난이도: 중간)
  - `items` 필드 JSON 파싱
  - 금액 계산 (공급가액, 세액, 합계)

#### 타입 정의
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

#### 설정 페이지 (`/settings`)
- [ ] 페이지 컴포넌트 생성 `src/app/settings/page.tsx` (난이도: 낮음)
- [ ] Notion Token + Database ID 입력 폼 (난이도: 낮음)
  - Token 필드: `type="password"` 마스킹
- [ ] **연결 테스트** 버튼 → Server Action으로 Notion API 호출 검증 (난이도: 중간)
  - 성공/실패 Sonner 토스트
- [ ] **저장** 버튼 → Supabase `notion_configs` upsert (난이도: 낮음)
- [ ] 기존 설정값 불러오기 (페이지 로드 시) (난이도: 낮음)

### 완료 기준
- [ ] 유효한 Notion 자격증명으로 연결 테스트 성공 토스트
- [ ] 저장 후 페이지 새로고침 시 기존 값 복원
- [ ] 잘못된 토큰 → 실패 토스트

### 관련 파일
- `src/lib/notion/client.ts`
- `src/lib/notion/queries.ts`
- `src/lib/notion/parser.ts`
- `src/types/invoice.ts`
- `src/app/settings/page.tsx`
- `src/app/settings/actions.ts`

---

## Phase 4: 핵심 UI

**기간**: 2026-04-15 ~ 2026-04-25

### 목표
견적서 관리 페이지(대시보드)와 견적서 확인 페이지(공개 URL) 구현

### 세부 작업

#### 견적서 관리 페이지 (`/dashboard`)
- [ ] 페이지 컴포넌트 생성 `src/app/dashboard/page.tsx` (난이도: 낮음)
- [ ] Server Component에서 Notion API 직접 호출 (`revalidate: 60`) (난이도: 중간)
- [ ] 견적서 카드 컴포넌트 `src/components/invoice/invoice-card.tsx` (난이도: 중간)
  - 표시 항목: 견적서 번호, 클라이언트명, 총액, 발행일, 상태 배지
- [ ] **공유 URL 복사** 버튼 — 클립보드 복사 + Sonner 토스트 (난이도: 낮음)
- [ ] **미리보기** 버튼 → `/invoice/[slug]` 이동 (난이도: 낮음)
- [ ] 빈 상태 UI — Notion 미연동 시 설정 페이지 유도 (난이도: 낮음)
- [ ] 로딩 스켈레톤 `src/app/dashboard/loading.tsx` (난이도: 낮음)

#### 견적서 확인 페이지 (`/invoice/[slug]`)
- [ ] 동적 라우트 페이지 `src/app/invoice/[slug]/page.tsx` (난이도: 낮음)
- [ ] slug로 Notion 단건 조회, 없으면 `notFound()` (난이도: 중간)
- [ ] 견적서 헤더 컴포넌트 (발행자 정보, 클라이언트 정보, 메타 정보) (난이도: 중간)
- [ ] 견적 항목 테이블 `src/components/invoice/invoice-table.tsx` (난이도: 중간)
  - 컬럼: 서비스명 / 단가 / 수량 / 공급가액 / 세율 / 세액 / 합계
  - 하단: 소계 / 부가세(10%) / 총합계 요약
- [ ] 비고/특이사항 텍스트 영역 (난이도: 낮음)
- [ ] **공유 URL 복사** 버튼 (난이도: 낮음)
- [ ] **PDF 다운로드** 버튼 (Phase 5에서 연결) (난이도: 낮음)
- [ ] 404 페이지 `src/app/not-found.tsx` (난이도: 낮음)

### 완료 기준
- [ ] 대시보드에서 Notion DB 견적서 목록 카드 렌더링
- [ ] 공유 URL 복사 클릭 → 클립보드 복사 + 토스트
- [ ] `/invoice/[slug]` 접근 → 견적서 내용 표시
- [ ] 존재하지 않는 slug → 404 페이지
- [ ] 금액 계산 정확성 (소계/부가세/총합계)

### 관련 파일
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/loading.tsx`
- `src/app/invoice/[slug]/page.tsx`
- `src/app/not-found.tsx`
- `src/components/invoice/invoice-card.tsx`
- `src/components/invoice/invoice-table.tsx`

---

## Phase 5: PDF 생성

**기간**: 2026-04-26 ~ 2026-05-02

### 목표
`@react-pdf/renderer` 기반 Route Handler에서 견적서 PDF 생성 및 다운로드 구현

### 세부 작업

#### PDF Route Handler
- [ ] `@react-pdf/renderer` 패키지 설치 (난이도: 낮음)
- [ ] 한국어 폰트 임베딩 설정 (난이도: 중간)
  - Noto Sans KR `.ttf` 파일 다운로드 → `public/fonts/`
  - `Font.register()` 설정
- [ ] PDF 문서 컴포넌트 `src/components/invoice/invoice-pdf.tsx` (난이도: 높음)
  - `@react-pdf/renderer`의 `Document`, `Page`, `View`, `Text`, `StyleSheet` 사용
  - 견적서 레이아웃 구현 (발행자 정보, 항목 테이블, 합계)
- [ ] Route Handler `src/app/api/invoice/[slug]/pdf/route.ts` (난이도: 중간)
  - Notion에서 slug로 데이터 조회
  - `renderToBuffer()` → `Response` with `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="invoice-{slug}.pdf"`

#### 프론트엔드 연결
- [ ] 견적서 확인 페이지 PDF 다운로드 버튼 연결 (난이도: 낮음)
  - `/api/invoice/[slug]/pdf` GET 요청 → 파일 다운로드

### 완료 기준
- [ ] PDF 다운로드 버튼 클릭 → 파일 다운로드
- [ ] PDF 내 한국어 텍스트 정상 렌더링
- [ ] 금액 계산 일치 (웹 화면과 PDF 동일)
- [ ] Vercel 환경에서 폰트 파일 접근 가능

### 관련 파일
- `src/app/api/invoice/[slug]/pdf/route.ts`
- `src/components/invoice/invoice-pdf.tsx`
- `public/fonts/NotoSansKR-Regular.ttf`

---

## Phase 6: 마무리 및 Vercel 배포

**기간**: 2026-05-03 ~ 2026-05-09

### 목표
전체 기능 통합 테스트, 에러 처리 강화, Vercel 프로덕션 배포

### 세부 작업

#### 에러 처리 및 UX
- [ ] 전역 에러 페이지 `src/app/error.tsx` (난이도: 낮음)
- [ ] Notion API 호출 실패 시 에러 UI (난이도: 낮음)
- [ ] 로딩 상태 전반적 검토 (Suspense 경계 확인) (난이도: 중간)
- [ ] 메타데이터 설정 (`src/app/layout.tsx` — title, description, og:image) (난이도: 낮음)

#### 반응형 디자인 검토
- [ ] 모바일(320px) ~ 데스크톱(1280px) 전 페이지 확인 (난이도: 중간)
- [ ] 견적 항목 테이블 모바일 대응 (가로 스크롤 또는 카드형) (난이도: 중간)

#### Vercel 배포
- [ ] GitHub 저장소 연결 및 Vercel 프로젝트 생성 (난이도: 낮음)
- [ ] Vercel 환경변수 설정 (난이도: 낮음)
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - `NOTION_TOKEN`, `NOTION_DATABASE_ID`
- [ ] `npm run build` 에러 없음 확인 (난이도: 낮음)
- [ ] 프로덕션 URL로 전체 사용자 흐름 검증 (난이도: 중간)

#### 최종 검증
- [ ] 회원가입 → 노션 설정 → 견적서 목록 → URL 복사 → 클라이언트 접근 → PDF 다운로드 E2E 흐름 확인
- [ ] Supabase RLS 정책 프로덕션 환경 확인

### 완료 기준
- [ ] Vercel 프로덕션 URL에서 전체 기능 정상 동작
- [ ] 타 사용자의 notion_config 접근 불가 (RLS 검증)
- [ ] PDF 다운로드 프로덕션 환경에서 정상 동작

### 관련 파일
- `src/app/error.tsx`
- `src/app/layout.tsx`
- `vercel.json` (필요 시)

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
