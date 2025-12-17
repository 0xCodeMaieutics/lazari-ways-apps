"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Field } from "@workspace/ui/components/field";
import { FieldError } from "@workspace/ui/components/field";
import { loginFormSchema } from "./schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authClient } from "@workspace/server/auth/client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const DEV_EMAIL = "applicant@lazaryways.eu";
const DEV_PASSWORD = "#ApplicantIsCool2025!";

export function LoginForm({ loginType }: { loginType?: "login" | "signup" }) {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(loginType === "signup");

  const onSuccess = () => {
    window.location.href = "/?" + searchParams.toString();
  };

  const signUpMutation = useMutation<
    unknown,
    Error,
    {
      email: string;
      password: string;
    }
  >({
    mutationFn: async (data) => {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: "",
      });
      if (result.error) throw new Error(result.error.message);
      return result;
    },
    onSuccess,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const signInMutation = useMutation<
    unknown,
    Error,
    {
      email: string;
      password: string;
    }
  >({
    mutationFn: async (data) => {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) throw new Error(result.error.message);
      return result;
    },
    onSuccess,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: process.env.NODE_ENV === "development" ? DEV_EMAIL : undefined,
      password:
        process.env.NODE_ENV === "development" ? DEV_PASSWORD : undefined,
    },
  });

  return (
    <div className="h-dvh w-full flex flex-col justify-center items-center">
      <form
        onSubmit={form.handleSubmit((data) =>
          isSignUp ? signUpMutation.mutate(data) : signInMutation.mutate(data)
        )}
        noValidate
        className="w-full max-w-md mx-auto px-4"
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-1">
            <div
              role="button"
              onClick={() => {
                if (process.env.NODE_ENV === "development") {
                  form.setValue("email", DEV_EMAIL);
                  form.setValue("password", DEV_PASSWORD);
                }
              }}
              className="relative h-12 w-[190px]"
            >
              <Image
                src={"/images/logos/logo-text.svg"}
                alt="Lazary Ways image Logo"
                fill
              />
            </div>
          </div>
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
                  className="h-12"
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
                  className="h-12"
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
            size={"lg"}
            className="w-full h-12 text-lg"
            disabled={
              isSignUp ? signUpMutation.isPending : signInMutation.isPending
            }
          >
            {isSignUp
              ? signUpMutation.isPending
                ? "Signing up..."
                : "Sign Up"
              : signInMutation.isPending
                ? "Logging in..."
                : "Login"}
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center">
        <Button
          type="button"
          variant={"link"}
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm hover:underline"
        >
          {isSignUp
            ? "Already have an account? Login"
            : "Don't have an account? Sign up"}
        </Button>
      </div>
    </div>
  );
}
