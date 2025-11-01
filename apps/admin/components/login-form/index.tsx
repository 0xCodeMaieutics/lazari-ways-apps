"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Field, FieldError } from "@workspace/ui/components/field";
import { adminLoginFormSchema } from "./schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const DEV_EMAIL = "anna@application.com";
const DEV_PASSWORD = "#AdminIsCool2025";

export function LoginForm() {
  const signInMutation = useMutation<
    {
      success: boolean;
      redirectUrl?: string;
    },
    Error,
    {
      email: string;
      password: string;
    }
  >({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return {
        success: true,
        redirectUrl: response.redirected ? response.url : undefined,
      };
    },
    onSuccess: (data) => {
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
    onError: (error) => {
      toast.error("Login failed. Please try again.");
      console.error("Sign in error:", error);
    },
  });

  const form = useForm<z.infer<typeof adminLoginFormSchema>>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: {
      email: process.env.NODE_ENV === "development" ? DEV_EMAIL : undefined,
      password:
        process.env.NODE_ENV === "development" ? DEV_PASSWORD : undefined,
    },
  });

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <h1 className="text-2xl text-center font-bold mb-6">Admin Login</h1>
      <form
        onSubmit={form.handleSubmit((data) => signInMutation.mutate(data))}
        noValidate
      >
        <div className="space-y-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  type="email"
                  id="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Input
                  {...field}
                  type="password"
                  id="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full"
            disabled={signInMutation.isPending}
          >
            {signInMutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </div>
  );
}
