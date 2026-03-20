// TODO: 인증 미들웨어 연동 후 비인증 사용자를 /login으로 리디렉션 예정

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
