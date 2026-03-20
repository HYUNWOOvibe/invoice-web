# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

## 개발 환경

- **프레임워크**: Next.js 16.1.6 (App Router)
- **런타임**: React 19
- **언어**: TypeScript (strict mode)
- **스타일링**: Tailwind CSS v4 + CVA (Class Variance Authority)
- **UI 라이브러리**: shadcn, Radix UI, Lucide React

## 주요 의존성

| 라이브러리 | 용도 |
|-----------|------|
| `react-hook-form` + `zod` | 폼 관리 및 검증 |
| `next-themes` | 라이트/다크 모드 테마 |
| `sonner` | 토스트 알림 |
| `tailwind-merge` | Tailwind 클래스 병합 유틸 |
| `clsx` | 조건부 클래스 생성 |

## 개발 명령어

```bash
# 개발 서버 실행 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# ESLint 검사 및 자동 수정
npm run lint                  # 모든 파일 검사
npm run lint -- src/         # 특정 디렉토리 검사
npm run lint -- --fix        # 자동 수정 가능한 오류 수정

# TypeScript 타입 검사 (개발 중)
npx tsc --noEmit           # 타입만 검사 (빌드 없음)
```

## 프로젝트 구조

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 루트 레이아웃 (ThemeProvider, Toaster)
│   ├── page.tsx                 # 홈페이지
│   └── globals.css              # 글로벌 스타일
├── components/
│   ├── layout/                  # 레이아웃 컴포넌트
│   │   ├── header.tsx           # 헤더 (네비게이션, 테마토글)
│   │   ├── footer.tsx           # 푸터
│   │   └── container.tsx        # 컨테이너 (Max-width wrapper)
│   ├── theme/                   # 테마 관련
│   │   ├── theme-provider.tsx   # next-themes 설정
│   │   └── theme-toggle.tsx     # 테마 전환 버튼
│   └── ui/                      # shadcn UI 컴포넌트들
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ...
└── lib/                         # 유틸리티 함수
```

## 핵심 아키텍처

### 루트 레이아웃
- `src/app/layout.tsx`에 `ThemeProvider`와 `TooltipProvider` 설정
- 글로벌 폰트 (Geist Sans, Geist Mono)는 CSS 변수로 적용
- `Toaster` 컴포넌트로 모든 페이지에서 Sonner 알림 사용 가능

### 컴포넌트 조직
- **UI 컴포넌트** (`src/components/ui/`): shadcn 기반 재사용 가능한 저수준 컴포넌트
- **레이아웃 컴포넌트** (`src/components/layout/`): Header, Footer, Container 등 페이지 레이아웃 구성
- **테마 컴포넌트** (`src/components/theme/`): next-themes 통합 및 테마 토글

### 스타일링 규칙
- **Tailwind CSS**: 유틸리티 클래스 기반 스타일링
- **CVA**: 복잡한 컴포넌트의 바리안트 관리 (예: Button의 variant, size)
- **클래스 병합**: `tailwind-merge`로 동적 클래스 충돌 해결

### 타입스크립트 설정
- `tsconfig.json`에 경로 별칭 설정: `@/*` → `src/*`
- Strict mode 활성화 (타입 안정성)

## 개발 워크플로우

### 일반적인 작업 순서
1. 기능/컴포넌트 작성
2. `npm run dev`로 개발 서버에서 테스트
3. `npm run lint -- --fix` 로 스타일 자동 정정
4. `npx tsc --noEmit`로 타입 오류 확인
5. `npm run build`로 프로덕션 빌드 검증
6. 변경사항 커밋 (한국어 메시지 사용)

### 경로 별칭 (@/) 사용
- `tsconfig.json`에 설정됨: `@/* → src/*`
- 항상 상대 경로 대신 절대 경로 사용 예시:
  ```tsx
  import { Button } from "@/components/ui/button";
  import { Container } from "@/components/layout/container";
  ```

## 코딩 가이드

### 컴포넌트 작성
- React 19 문법 사용 (useActionState 등 최신 기능 활용)
- `"use client"` directive는 필요한 경우에만 추가 (Server Components 우선)
- Tailwind + CVA 조합으로 스타일링

### 폼 개발
1. React Hook Form으로 폼 상태 관리
2. Zod로 스키마 정의 및 검증
3. 에러 메시지는 `form.formState.errors`에서 조회

### 테마 구현
- `next-themes`의 `useTheme()` hook 사용
- "light", "dark", "system" 값 지원
- localStorage에 자동 저장

### 반응형 디자인
모바일 우선 설계 원칙. Tailwind의 기본 breakpoints:
- `sm`: 640px (기본 위에 작은 화면)
- `md`: 768px (태블릿, 사용 예: `hidden md:flex`)
- `lg`: 1024px (데스크톱)
- `xl`: 1280px (큰 화면)

예시:
```tsx
{/* 모바일에서는 숨김, md 이상에서 표시 */}
<nav className="hidden md:flex gap-6">...</nav>

{/* 모바일에서는 한 열, md 이상에서 그리드 */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">...</div>
```

## ESLint 설정
- `eslint.config.mjs`에 설정
- Next.js 기본 설정 적용
- 명령어: `npm run lint`

## Git 커밋 규칙
한국어 메시지 사용. 권장 형식:
```
<type>: <subject>

<body (선택사항)>
```

**Type 예시:**
- `feat:` - 새로운 기능 추가
- `fix:` - 버그 수정
- `refactor:` - 코드 리팩토링
- `style:` - 스타일/CSS 변경
- `docs:` - 문서 추가/수정
- `config:` - 설정 파일 변경

예시:
```
feat: 로그인 폼 컴포넌트 추가

- React Hook Form과 Zod로 검증 구현
- 에러 메시지 표시 기능 추가
```

## UI 컴포넌트 추가

shadcn 또는 Radix UI 컴포넌트가 필요하면:

```bash
npx shadcn@latest add button    # 특정 컴포넌트 추가
npx shadcn@latest add          # 인터랙티브 설치
```

추가된 컴포넌트는 `src/components/ui/`에 저장되며, 자유롭게 수정 가능합니다.

## 알려진 패턴

### Header 레이아웃
- 모바일: 햄버거 메뉴 (md 이하에서만 표시)
- 데스크톱: Grid 3-column 레이아웃으로 중앙 정렬 (로고 | 네비게이션 | 테마토글)
- 구현 파일: `src/components/layout/header.tsx` (23줄의 `grid grid-cols-3`)

### 페이지 구조
- `Container` 컴포넌트로 max-width 제한
- `Header` + 콘텐츠 + `Footer` 조합

## 성능 최적화

### Server Components 우선
- 모든 컴포넌트는 기본적으로 Server Component
- `"use client"`는 인터렉션이 필요할 때만 추가
- 예: 폼, 상태 관리, 브라우저 API 사용

### 이미지 최적화
```tsx
import Image from "next/image";

<Image
  src="/image.png"
  alt="설명"
  width={100}
  height={100}
/>
```

### Dynamic Import (큰 컴포넌트)
```tsx
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("@/components/heavy"), {
  loading: () => <div>로딩...</div>,
});
```

## 개발 팁

- 타입 안정성 유지: TypeScript strict mode에서 모든 타입 명시
- 컴포넌트 재사용: UI 컴포넌트는 가능한 한 범용적으로 작성
- 성능: Server Components 활용으로 불필요한 클라이언트 번들 최소화
- 레이아웃: 복잡한 레이아웃은 CSS Grid 또는 Flex 조합으로 구성
