"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useEffect, useCallback } from "react";

import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Radio } from "@workspace/ui/components/radio";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { FileUpload } from "@/components/file-upload";
import { Textarea } from "@workspace/ui/components/textarea";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ApplicationFormData,
  applicationFormSchema,
} from "@/utils/models/applications";
import { ApplicationType } from "@workspace/server/db/models";
import { authClient } from "@workspace/server/auth/client";
import { tryCatchAsync } from "@workspace/shared/error-handling/result";
import { err } from "@workspace/shared/error-handling/result";
import { Result, ok } from "@workspace/shared/error-handling/result";
import { BaseError } from "@workspace/shared/error-handling/result";

export function ApplicationForm({ type }: { type: ApplicationType }) {
  const router = useRouter();
  const { data: session } = authClient.useSession.get();
  console.log({ session });

  const form = useForm<z.infer<typeof applicationFormSchema>>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      // firstName: "Anna",
      // lastName: "Schmidt",
      // gender: "female",
      // nationality: "Deutsch",
      // birthDate: "1999-03-15",
      // birthPlace: "München",
      // birthCountry: "Deutschland",
      // street: "Musterstraße 45",
      // postalCode: "80331",
      // city: "München",
      // country: "Deutschland",

      foto: undefined,
      passport: undefined,

      agencyName: "Müller Personalvermittlung GmbH",
      agencyAddress: "Hauptstraße 123, 10115 Berlin, Deutschland",

      semesterBreakFrom: undefined,
      semesterBreakTo: undefined,
      university: "Ludwig-Maximilians-Universität München",
      studySubject: "Betriebswirtschaftslehre",
      germanLevel: "B2",
      otherLanguages: "Englisch B2, Französisch A2",

      driverLicense: "B",
      canRideBike: false,
      shiftWork: false,

      healthRestrictions: "Keine besonderen Einschränkungen",
      allergies: "Nussallergie",
      clothingSize: "M",
      shoeSize: "38",
      previousStayInGermany: "Ja",
      previousStayPlace: "Hamburg",
      previousStayPeriodFrom: undefined,
      previousStayPeriodTo: "August 2023",
      taxId: "12345678901",
      phone: "+49 151 12345678",

      email: "anna.schmidt@email.de",
      instagram: "@anna_schmidt_99",
      emergencyContactName: "Maria Schmidt",
      emergencyPhone: "+49 89 98765432",
    },
  });

  const scrollToFirstError = useCallback(() => {
    const errors = form.formState.errors;
    const firstErrorField = Object.keys(errors)[0];

    if (firstErrorField) {
      let fieldElement: Element | null = null;

      const inputFilesName = ["foto", "passport", "introductionVideo"];

      if (inputFilesName.includes(firstErrorField)) {
        fieldElement = document.querySelector(`[data-invalid="true"]`);

        if (fieldElement) {
          const allInvalidFields = document.querySelectorAll(
            `[data-invalid="true"]`
          );
          for (const field of allInvalidFields) {
            const fileInput = field.querySelector(
              `input[type="file"]#${firstErrorField}`
            );
            if (fileInput) {
              fieldElement = field;
              break;
            }
          }
        }
      } else {
        fieldElement =
          document.getElementById(firstErrorField) ||
          document.querySelector(`[name="${firstErrorField}"]`) ||
          document.querySelector(`[data-field="${firstErrorField}"]`);
      }

      if (fieldElement) {
        fieldElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });

        if (inputFilesName.includes(firstErrorField)) {
          const browseButton = fieldElement!.querySelector(
            'button[type="button"]'
          );
          if (browseButton instanceof HTMLElement) {
            browseButton.focus();
          }
        } else {
          const input = fieldElement!.querySelector("input, textarea, select");
          if (input instanceof HTMLElement) {
            input.focus();
          }
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

  const { mutateAsync: submitApplication, isPending: isSubmitting } =
    useMutation<
      Result<
        {
          success: boolean;
          message: string;
        },
        BaseError
      >,
      unknown,
      ApplicationFormData
    >({
      mutationFn: async (data) => {
        if (session?.user.id === undefined)
          return err({
            type: "Unauthorized",
            message: "User is not authenticated",
          });

        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value === undefined || value === null) return;

          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (value instanceof File) {
            formData.append(key, value, value.name);
          } else {
            formData.append(key, value as string);
          }
        });

        formData.append("type", type);
        formData.append("userId", session.user.id);
        const applicationResponseResult = await tryCatchAsync(() =>
          fetch("/api/application", {
            method: "POST",
            body: formData,
          })
        );
        if (applicationResponseResult.isErr()) {
          return err({
            type: "InernalServerError",
            message: "Failed to submit application",
          });
        }
        const applicationResponse = applicationResponseResult.value;
        if (!applicationResponse.ok) {
          return err({
            type: "InternalServerError",
            message: "Server not responding 'not ok'",
          });
        }
        return ok({
          success: true,
          message: "Application submitted successfully",
        });
      },
      onSuccess: (result) => {
        result.match({
          ok: () => {
            router.push("/?submitted=true");
          },
          err: (error) => {
            toast.error(
              `Fehler bei der Einreichung der Bewerbung: ${error.message}`
            );
          },
        });
      },
    });

  // Handle validation errors on form submission
  function onInvalid() {
    setTimeout(() => {
      scrollToFirstError();
    }, 100); // Small delay to ensure DOM is updated with error states
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-2">KKB Bewerbungsformular</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Bitte füllen Sie alle erforderlichen Felder aus.
      </p>

      <form
        id="application-form"
        onSubmit={form.handleSubmit(
          (data) => submitApplication(data),
          onInvalid
        )}
        noValidate
      >
        <div className="space-y-8">
          <div>
            <FieldGroup>
              <h2 className="text-lg font-semibold">Agentur Information</h2>

              <Controller
                name="agencyName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="agencyName">
                      Name der Agentur *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="agencyName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Name der Agentur"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="agencyAddress"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="agencyAddress">
                      Anschrift der Agentur *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="agencyAddress"
                      aria-invalid={fieldState.invalid}
                      placeholder="Vollständige Adresse der Agentur"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* Study Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Studium & Qualifikationen
            </h2>
            <FieldGroup>
              <div className="flex gap-3">
                <Controller
                  name="semesterBreakFrom"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="semesterBreakFrom">
                        Semesterferien von
                      </FieldLabel>
                      <Input
                        {...field}
                        id="semesterBreakFrom"
                        aria-invalid={fieldState.invalid}
                        placeholder="z.B. 01.07.2024"
                        type="date"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="semesterBreakTo"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="semesterBreakTo">
                        Semesterferien (von – bis)
                      </FieldLabel>
                      <Input
                        {...field}
                        id="semesterBreakTo"
                        aria-invalid={fieldState.invalid}
                        placeholder="z.B. 31.09.2024"
                        type="date"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="university"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="university">Universität</FieldLabel>
                      <Input
                        {...field}
                        id="university"
                        aria-invalid={fieldState.invalid}
                        placeholder="Name der Universität"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="studySubject"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="studySubject">
                        Studienfach
                      </FieldLabel>
                      <Input
                        {...field}
                        id="studySubject"
                        aria-invalid={fieldState.invalid}
                        placeholder="Studienfach"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="germanLevel"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Deutschniveau</FieldLabel>
                    <div className="flex gap-4">
                      {["A1", "A2", "B1", "B2", "C1"].map((level) => (
                        <div key={level} className="flex items-center gap-2">
                          <Checkbox
                            key={level}
                            checked={field.value === level}
                            onChange={() =>
                              field.onChange(
                                field.value === level ? undefined : level
                              )
                            }
                            id={`german-${field.value}`}
                          />
                          <label
                            htmlFor={`german-${field.value}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {level}
                          </label>
                        </div>
                      ))}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="otherLanguages"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="otherLanguages">
                      Weitere Sprachkenntnisse / Sprachniveau
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="otherLanguages"
                      aria-invalid={fieldState.invalid}
                      placeholder="z.B. Englisch B2, Französisch A1"
                      rows={3}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="driverLicense"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="driverLicense">
                      Führerschein
                    </FieldLabel>
                    <Input
                      {...field}
                      id="driverLicense"
                      aria-invalid={fieldState.invalid}
                      placeholder="Führerscheinklasse (z.B. B, A1)"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="canRideBike"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Kannst Du Fahrrad fahren?</FieldLabel>
                    <div className="flex gap-4">
                      <Radio
                        {...field}
                        value="Ja"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        label="Ja"
                        id="bike-yes"
                      />
                      <Radio
                        {...field}
                        value="Nein"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        label="Nein"
                        id="bike-no"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="shiftWork"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Schichtbereitschaft</FieldLabel>
                    <div className="flex gap-4">
                      <Radio
                        {...field}
                        value="Ja"
                        checked={field.value === true}
                        onChange={() => field.onChange(true)}
                        label="Ja"
                        id="shift-yes"
                      />
                      <Radio
                        {...field}
                        value="Nein"
                        checked={field.value === false}
                        onChange={() => field.onChange(false)}
                        label="Nein"
                        id="shift-no"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* Health & Personal Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Gesundheit & Persönliche Angaben
            </h2>
            <FieldGroup>
              <Controller
                name="healthRestrictions"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="healthRestrictions">
                      Gesundheitliche Einschränkungen
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="healthRestrictions"
                      aria-invalid={fieldState.invalid}
                      placeholder="Bitte beschreiben Sie eventuelle gesundheitliche Einschränkungen"
                      rows={3}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="allergies"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="allergies">Allergien</FieldLabel>
                    <Textarea
                      {...field}
                      id="allergies"
                      aria-invalid={fieldState.invalid}
                      placeholder="Bitte listen Sie bekannte Allergien auf"
                      rows={3}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="clothingSize"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="clothingSize">
                        Kleidergröße
                      </FieldLabel>
                      <Input
                        {...field}
                        id="clothingSize"
                        aria-invalid={fieldState.invalid}
                        placeholder="z.B. M, L, XL"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="shoeSize"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="shoeSize">Schuhgröße</FieldLabel>
                      <Input
                        {...field}
                        id="shoeSize"
                        aria-invalid={fieldState.invalid}
                        placeholder="z.B. 42, 43, 44"
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

          {/* Previous Stay in Germany */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Aufenthalt in Deutschland
            </h2>
            <FieldGroup>
              <Controller
                name="previousStayInGermany"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Aufenthalt in Deutschland</FieldLabel>
                    <div className="flex gap-4">
                      <Radio
                        {...field}
                        value="Ja"
                        checked={field.value === "Ja"}
                        onChange={() => field.onChange("Ja")}
                        label="Ja"
                        id="stay-yes"
                      />
                      <Radio
                        {...field}
                        value="Nein"
                        checked={field.value === "Nein"}
                        onChange={() => field.onChange("Nein")}
                        label="Nein"
                        id="stay-no"
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {form.watch("previousStayInGermany") === "Ja" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="previousStayPlace"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="previousStayPlace">
                          Wenn ja, wo
                        </FieldLabel>
                        <Input
                          {...field}
                          id="previousStayPlace"
                          aria-invalid={fieldState.invalid}
                          placeholder="Stadt/Region in Deutschland"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="previousStayPeriodFrom"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="previousStayPeriodFrom">
                          Zeitraum
                        </FieldLabel>
                        <Input
                          {...field}
                          id="previousStayPeriodFrom"
                          aria-invalid={fieldState.invalid}
                          placeholder="z.B. Juli 2023"
                          type="date"
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              )}
            </FieldGroup>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Kontaktdaten</h2>
            <FieldGroup>
              <Controller
                name="taxId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="taxId">
                      Steuer-ID (falls vorhanden)
                    </FieldLabel>
                    <Input
                      {...field}
                      id="taxId"
                      aria-invalid={fieldState.invalid}
                      placeholder="Steuerliche Identifikationsnummer"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="phone"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="phone">Telefonnummer *</FieldLabel>
                      <Input
                        {...field}
                        id="phone"
                        type="tel"
                        aria-invalid={fieldState.invalid}
                        placeholder="+49 XXX XXXXXXX"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">E-Mail *</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="ihre.email@beispiel.de"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="instagram"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="instagram">
                      Instagram-Profil
                    </FieldLabel>
                    <Input
                      {...field}
                      id="instagram"
                      aria-invalid={fieldState.invalid}
                      placeholder="@ihr_instagram_name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* Emergency Contact */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Notfallkontakt</h2>
            <FieldGroup>
              <Controller
                name="emergencyContactName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="emergencyContactName">
                      Notfall-Kontaktperson *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="emergencyContactName"
                      aria-invalid={fieldState.invalid}
                      placeholder="Vollständiger Name der Kontaktperson"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="emergencyPhone"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="emergencyPhone">
                      Notfall-Telefonnummer *
                    </FieldLabel>
                    <Input
                      {...field}
                      id="emergencyPhone"
                      type="tel"
                      aria-invalid={fieldState.invalid}
                      placeholder="+49 XXX XXXXXXX"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* File Upload */}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Foto & Reisepass Upload
            </h2>
            <FieldGroup>
              <Controller
                name="foto"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="foto">Foto *</FieldLabel>
                    <FileUpload
                      id="foto"
                      accept=".png,.jpg,.jpeg"
                      value={field.value}
                      onChange={(file) => field.onChange(file)}
                      placeholder="Foto hochladen"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="passport"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="passport">Passport *</FieldLabel>
                    <FileUpload
                      id="passport"
                      accept=".pdf"
                      value={field.value || null}
                      onChange={(file) => field.onChange(file)}
                      placeholder="Reisepass hochladen"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="languageCertificate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="languageCertificate">
                      Sprach Nachweis (optional)
                    </FieldLabel>
                    <FileUpload
                      id="languageCertificate"
                      accept=".pdf"
                      value={field.value || null}
                      onChange={(file) => field.onChange(file)}
                      placeholder="Sprach Nachweis hochladen"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="studyCertificate"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="studyCertificate">
                      Sprach Nachweis (optional)
                    </FieldLabel>
                    <FileUpload
                      id="studyCertificate"
                      accept=".pdf"
                      value={field.value || null}
                      onChange={(file) => field.onChange(file)}
                      placeholder="Studien Nachweis hochladen"
                      required
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => {
              form.reset();
              const fileInputs =
                document.querySelectorAll('input[type="file"]');
              fileInputs.forEach((input) => {
                (input as HTMLInputElement).value = "";
              });
            }}
          >
            Formular zurücksetzen
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Wird eingereicht..." : "Bewerbung einreichen"}
          </Button>
        </div>
      </form>
    </div>
  );
}
