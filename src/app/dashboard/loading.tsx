import { Container } from "@/components/layout/container";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// 개별 카드 스켈레톤
function CardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between border-t pt-2">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-5 w-28" />
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-0">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </CardFooter>
    </Card>
  );
}

// 대시보드 로딩 스켈레톤 — 카드 6개 그리드
export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <div className="space-y-6">
            <div className="space-y-1">
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-4 w-56" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
