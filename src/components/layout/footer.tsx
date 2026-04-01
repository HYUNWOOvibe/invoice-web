import { Container } from "./container";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/40">
      <Container>
        <div className="py-8">
          <div>
            <h3 className="font-bold text-lg mb-2">InvoiceWeb</h3>
            <p className="text-sm text-muted-foreground">
              노션 데이터베이스 기반 견적서 웹 뷰어
            </p>
          </div>
        </div>

        <Separator />

        <div className="py-4 text-center text-sm text-muted-foreground">
          <p>© {currentYear} InvoiceWeb. 모든 권리 보유.</p>
        </div>
      </Container>
    </footer>
  );
}
