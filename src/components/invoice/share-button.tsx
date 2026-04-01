"use client";

import { toast } from "sonner";
import { Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  // url이 전달되면 해당 URL을 복사, 없으면 현재 페이지 URL 복사
  url?: string;
}

// URL 복사 버튼 — url prop 또는 현재 페이지 URL을 클립보드에 복사
export function ShareButton({ className, url }: Props) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url ?? window.location.href);
      toast.success("URL이 클립보드에 복사되었습니다");
    } catch {
      toast.error("URL 복사에 실패했습니다");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      className={cn(className)}
    >
      <Link2 className="mr-2 h-4 w-4" />
      URL 복사
    </Button>
  );
}
