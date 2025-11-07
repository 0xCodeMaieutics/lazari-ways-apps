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
import { authClient } from "@/lib/auth-client";

const DEV_EMAIL = "applicant@lazaryways.eu";
const DEV_PASSWORD = "#ApplicantIsCool2025!";

export function LoginForm({ loginType }: { loginType?: "login" | "signup" }) {
  const [isSignUp, setIsSignUp] = useState(loginType === "signup");

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
    onSuccess: () => {
      window.location.href = "/";
    },
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
    onSuccess: () => {
      window.location.href = "/";
    },
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
    <div className="w-full max-w-md mx-auto px-4">
      <h1 className="text-2xl text-center font-bold mb-6">
        {isSignUp ? "Sign Up" : "Login"}
      </h1>
      <form
        onSubmit={form.handleSubmit((data) =>
          isSignUp ? signUpMutation.mutate(data) : signInMutation.mutate(data)
        )}
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
