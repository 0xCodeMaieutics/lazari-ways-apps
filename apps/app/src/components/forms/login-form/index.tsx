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
import {
  BaseError,
  err,
  ok,
  Result,
} from "@workspace/shared/error-handling/result";

const DEV_EMAIL = "applicant@lazaryways.eu";
const DEV_PASSWORD = "#ApplicantIsCool2025!";

export function LoginForm({ loginType }: { loginType?: "login" | "signup" }) {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(loginType === "signup");

  const onSuccess = () => {
    window.location.href = "/?" + searchParams.toString();
  };

  const signUpMutation = useMutation<
    Result<unknown, BaseError>,
    Error,
    {
      email: string;
      password: string;
    }
  >({
    mutationFn: async (data) => {
      const result = await authClient.signUp.email({
        email: data.email,
        name: "",
        password: data.password,
      });
      if (result.data === null) {
        return err({
          type: result.error.code || "UNKNOWN_ERROR",
        });
      }
      return ok(result);
    },
    onSuccess: (result) => {
      result.match({
        ok: () => {
          toast.success("Registrierung erfolgreich");
          onSuccess();
        },
        err: (error) => {
          if (error.type === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL")
            return form.setError("email", {
              message:
                "E-Mail-Adresse ist bereits in Verwendung. Bitte verwenden Sie eine andere E-Mail-Adresse.",
            });
          form.setError("email", {
            message:
              "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
          });
        },
      });
    },
  });

  const signInMutation = useMutation<
    Result<unknown, BaseError>,
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
      if (result.data === null) {
        return err({
          type: result.error.code || "UNKNOWN_ERROR",
        });
      }
      return ok(result);
    },
    onSuccess: (result) => {
      result.match({
        ok: () => {
          toast.success("Anmeldung erfolgreich");
          onSuccess();
        },
        err: (error) => {
          console.log(error);

          if (error.type === "INVALID_EMAIL_OR_PASSWORD")
            return form.setError("email", {
              message: "Ungültige E-Mail-Adresse oder Passwort.",
            });
          form.setError("password", {
            message:
              "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
          });
        },
      });
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
                alt="Lazary Ways Logo"
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
                  placeholder="E-Mail"
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
                  placeholder="Passwort"
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
                ? "Registrierung läuft..."
                : "Registrieren"
              : signInMutation.isPending
                ? "Anmeldung läuft..."
                : "Anmelden"}
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
            ? "Bereits ein Konto? Anmelden"
            : "Noch kein Konto? Registrieren"}
        </Button>
      </div>
    </div>
  );
}
