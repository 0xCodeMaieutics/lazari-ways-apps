import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="h-dvh flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
