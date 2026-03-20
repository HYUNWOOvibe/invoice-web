import { Github, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { Container } from "./container";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40">
      <Container>
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 브랜드 섹션 */}
          <div>
            <h3 className="font-bold text-lg mb-2">Next.js Starter</h3>
            <p className="text-sm text-muted-foreground">
              모던한 웹 프로젝트를 위한 완성도 높은 스타터킷
            </p>
          </div>

          {/* 링크 섹션 */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">링크</h4>
            <ul className="space-y-2 text-sm">
              <li>
                {/* TODO: 실제 문서 URL로 교체 필요 */}
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  문서
                </Link>
              </li>
              <li>
                {/* TODO: 실제 GitHub 저장소 URL로 교체 필요 */}
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </Link>
              </li>
              <li>
                {/* TODO: 실제 이슈 페이지 URL로 교체 필요 */}
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  이슈 신고
                </Link>
              </li>
            </ul>
          </div>

          {/* 소셜 링크 */}
          <div>
            <h4 className="font-semibold mb-3 text-sm">팔로우</h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@example.com"
                aria-label="Email"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* 저작권 */}
        <div className="py-4 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Next.js Starter. 모든 권리 보유.</p>
        </div>
      </Container>
    </footer>
  );
}
