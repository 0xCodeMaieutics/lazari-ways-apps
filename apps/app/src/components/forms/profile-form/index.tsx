"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@workspace/ui/components/button";
import { Radio } from "@workspace/ui/components/radio";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { ProfileFormData, profileFormSchema } from "./schema";
import { Save, X } from "lucide-react";
import { GetUserProfile } from "@workspace/server/db";
import { Gender } from "@workspace/server/db/models";
import { updateUser } from "@/utils/server-actions/user/update-user";
import { authClient } from "@workspace/server/auth/client";
import {
  BaseError,
  err,
  ok,
  Result,
} from "@workspace/shared/error-handling/result";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { format } from "date-fns";

/**
 * Form is missing the following fields
 * TODO: phone
 * TODO: instagram
 * TODO: facebook
 * TODO: taxIs (move this to application)
 */

export function ProfileForm({
  userInformation,
  onSaveSuccess,
  onCancel,
}: {
  userInformation: GetUserProfile["employee"];
  onSaveSuccess?: () => void;
  onCancel?: () => void;
}) {
  const router = useRouter();
  const session = authClient.useSession.get();

  const isUpdating = userInformation !== null;

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName:
        userInformation?.firstName === null ||
        userInformation?.firstName === undefined
          ? process.env.NODE_ENV === "development"
            ? "Anna"
            : ""
          : userInformation.firstName,
      lastName:
        userInformation?.lastName === null ||
        userInformation?.lastName === undefined
          ? process.env.NODE_ENV === "development"
            ? "Schmidt"
            : ""
          : userInformation.lastName,
      gender:
        userInformation?.gender === null ||
        userInformation?.gender === undefined
          ? process.env.NODE_ENV === "development"
            ? Gender.FEMALE
            : Gender.MALE
          : userInformation.gender,
      nationality:
        userInformation?.nationality === null ||
        userInformation?.nationality === undefined
          ? process.env.NODE_ENV === "development"
            ? "Deutsch"
            : ""
          : userInformation.nationality,
      birthDate:
        userInformation?.birthDate === null ||
        userInformation?.birthDate === undefined
          ? process.env.NODE_ENV === "development"
            ? "1990-05-15"
            : undefined
          : format(new Date(userInformation.birthDate), "yyyy-MM-dd"),
      birthPlace:
        userInformation?.birthPlace === null ||
        userInformation?.birthPlace === undefined
          ? process.env.NODE_ENV === "development"
            ? "München"
            : ""
          : userInformation.birthPlace,
      birthCountry:
        userInformation?.birthCountry === null ||
        userInformation?.birthCountry === undefined
          ? process.env.NODE_ENV === "development"
            ? "Deutschland"
            : ""
          : userInformation.birthCountry,
      street:
        userInformation?.street === null ||
        userInformation?.street === undefined
          ? process.env.NODE_ENV === "development"
            ? "Musterstraße 45"
            : ""
          : userInformation.street,
      postalCode:
        userInformation?.postalCode === null ||
        userInformation?.postalCode === undefined
          ? process.env.NODE_ENV === "development"
            ? "80331"
            : ""
          : userInformation.postalCode,
      city:
        userInformation?.city === null || userInformation?.city === undefined
          ? process.env.NODE_ENV === "development"
            ? "München"
            : ""
          : userInformation.city,
      country:
        userInformation?.country === null ||
        userInformation?.country === undefined
          ? process.env.NODE_ENV === "development"
            ? "Deutschland"
            : ""
          : userInformation.country,
      foto: undefined,
    },
  });

  const isDirty = form.formState.isDirty;

  const scrollToFirstError = useCallback(() => {
    const errors = form.formState.errors;
    const firstErrorField = Object.keys(errors)[0];

    if (firstErrorField) {
      const fieldElement =
        document.getElementById(firstErrorField) ||
        document.querySelector(`[name="${firstErrorField}"]`) ||
        document.querySelector(`[data-field="${firstErrorField}"]`);

      if (fieldElement) {
        fieldElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        const input = fieldElement.querySelector("input, textarea, select");
        if (input instanceof HTMLElement) {
          input.focus();
        }
      }
    }
  }, [form.formState.errors]);

  useEffect(() => {
    const errors = form.formState.errors;
    if (Object.keys(errors).length > 0 && form.formState.isSubmitted) {
      scrollToFirstError();
    }
  }, [form.formState.errors, form.formState.isSubmitted, scrollToFirstError]);

  const { mutateAsync: updateProfile, isPending: isSubmitting } = useMutation<
    Result<ProfileFormData, BaseError>,
    unknown,
    ProfileFormData
  >({
    mutationFn: async (data) => {
      if (session.data?.user === undefined)
        return err({
          type: "Unauthorized",
          message: "User is not authenticated",
        });

      const updatedUserResult = await updateUser({
        userId: session.data.user.id,
        data,
      });
      if (updatedUserResult.success === false) {
        return err({
          type: "UpdateFailed",
          message: updatedUserResult.message,
        });
      }
      return ok(data);
    },
    onSuccess: (result) => {
      result.match({
        ok: () => {
          toast.success("Profil erfolgreich aktualisiert");
          router.refresh();
          onSaveSuccess?.();
        },
        err: (error) => {
          toast.error(
            `Fehler beim Aktualisieren des Profils: ${error.message}`
          );
        },
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    // If this is a new profile (not updating), require foto
    if (!isUpdating && !data.foto) {
      form.setError("foto", {
        type: "manual",
        message: "Foto ist erforderlich",
      });
      scrollToFirstError();
      return;
    }
    updateProfile(data);
  };

  const onInvalid = () => {
    setTimeout(() => {
      scrollToFirstError();
    }, 100);
  };

  const handleReset = () => {
    form.reset();
  };

  return (
    <div className="w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
        noValidate
        className="space-y-8"
      >
        {/* Basic Information */}

        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            Grundlegende Informationen
          </h3>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="firstName"
                      className="text-sm font-medium"
                    >
                      Vorname *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="firstName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ihr Vorname"
                      className="transition-colors"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="lastName"
                      className="text-sm font-medium"
                    >
                      Nachname *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="lastName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ihr Nachname"
                      className="transition-colors"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-sm font-medium">
                    Geschlecht *
                  </FieldLabel>
                  <div className="flex gap-6 mt-2">
                    <Radio
                      {...field}
                      value={Gender.MALE}
                      checked={field.value === Gender.MALE}
                      onChange={() => field.onChange(Gender.MALE)}
                      label="Männlich"
                      id="gender-male"
                    />
                    <Radio
                      {...field}
                      value="female"
                      checked={field.value === Gender.FEMALE}
                      onChange={() => field.onChange(Gender.FEMALE)}
                      label="Weiblich"
                      id="gender-female"
                    />
                    <Radio
                      {...field}
                      value={Gender.DIVERSE}
                      checked={field.value === Gender.DIVERSE}
                      onChange={() => field.onChange(Gender.DIVERSE)}
                      label="Divers"
                      id="gender-diverse"
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="nationality"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="nationality"
                    className="text-sm font-medium"
                  >
                    Staatsangehörigkeit *
                  </FieldLabel>
                  <Input
                    {...field}
                    id="nationality"
                    aria-invalid={fieldState.invalid}
                    placeholder="z.B. Deutsch, Georgisch"
                    className="transition-colors"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        {/* Birth Information */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            Geburtsinformationen
          </h3>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name="birthDate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="birthDate"
                      className="text-sm font-medium"
                    >
                      Geburtsdatum *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="birthDate"
                      type="date"
                      aria-invalid={fieldState.invalid}
                      className="transition-colors"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="birthPlace"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="birthPlace"
                      className="text-sm font-medium"
                    >
                      Geburtsort *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="birthPlace"
                      aria-invalid={fieldState.invalid}
                      placeholder="Stadt"
                      className="transition-colors"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="birthCountry"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="birthCountry"
                      className="text-sm font-medium"
                    >
                      Geburtsland *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="birthCountry"
                      aria-invalid={fieldState.invalid}
                      placeholder="Land"
                      className="transition-colors"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </div>

        {/* Address Information */}
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            Adresse
          </h3>
          <FieldGroup>
            <Controller
              name="street"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="street" className="text-sm font-medium">
                    Straße, Hausnummer *
                  </FieldLabel>
                  <Input
                    {...field}
                    id="street"
                    aria-invalid={fieldState.invalid}
                    placeholder="Musterstraße 45"
                    className="transition-colors"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Controller
                name="postalCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="postalCode"
                      className="text-sm font-medium"
                    >
                      Postleitzahl *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="postalCode"
                      aria-invalid={fieldState.invalid}
                      placeholder="12345"
                      className="transition-colors"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="city" className="text-sm font-medium">
                      Stadt *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="city"
                      aria-invalid={fieldState.invalid}
                      placeholder="Berlin"
                      className="transition-colors"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="country"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="country"
                      className="text-sm font-medium"
                    >
                      Land *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="country"
                      aria-invalid={fieldState.invalid}
                      placeholder="Deutschland"
                      className="transition-colors"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </div>
        <div className="border-t pt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary" />
            Profilfoto
          </h3>
          <FieldGroup>
            <Controller
              name="foto"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="foto">
                    Foto hochladen {isUpdating ? "(optional)" : "*"}
                  </FieldLabel>
                  <FileUpload
                    id="foto"
                    accept=".png,.jpg,.jpeg"
                    value={field.value}
                    onChange={(file) => field.onChange(file)}
                    placeholder={
                      isUpdating ? "Neues Foto auswählen" : "Foto auswählen"
                    }
                    required={!isUpdating}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t">
          {isUpdating && onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Abbrechen
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={!isDirty || isSubmitting}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Zurücksetzen
          </Button>
          <Button
            type="submit"
            disabled={!isDirty || isSubmitting}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Wird gespeichert..." : "Änderungen speichern"}
          </Button>
        </div>
      </form>
    </div>
  );
}
