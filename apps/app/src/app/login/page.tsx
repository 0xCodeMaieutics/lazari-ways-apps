import { LoginForm } from "@/components/forms/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ loginType?: string }>;
}) {
  const { loginType } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm loginType={loginType as "login" | "signup"} />
    </div>
  );
}
