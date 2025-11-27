"use client";

import { GetVacancy } from "@workspace/server/db";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Field, FieldError } from "@workspace/ui/components/field";
import { Switch } from "@workspace/ui/components/switch";
import { Label } from "@workspace/ui/components/label";
import { Card } from "@workspace/ui/components/card";

import { updateVacancy } from "@/utils/server-actions/vacancy/update-vacancy";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

import { format } from "date-fns";
import { ka } from "date-fns/locale";
import { VacancyFormData, vacancyFormSchema } from "./schema";

export const VacancyProfile = ({ vacancy }: { vacancy: GetVacancy }) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(vacancyFormSchema),
    defaultValues: {
      title: vacancy.title,
      location: vacancy.location,
      beginDate: vacancy.beginDate,
      duration: vacancy.duration,
      salary: vacancy.salary,
      jobDescription: vacancy.jobDescription,
      schedule: vacancy.schedule,
      accommodation: vacancy.accommodation,
      meals: vacancy.meals,
      availableTo: vacancy.availableTo ?? null,
      languageLevel: vacancy.languageLevel ?? null,
      additionalInfo: vacancy.additionalInfo ?? null,
      hide: vacancy.hide ?? false,
      photos: vacancy.photos.map((photo) => photo.key) || [],
      videos: vacancy.videos.map((video) => video.key) || [],
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: VacancyFormData) => {
      const result = await updateVacancy({
        id: vacancy.id,
        data,
      });

      if (!result.isSuccess) {
        throw new Error("Failed to update vacancy");
      }
      return result;
    },
    onSuccess: (result, variables) => {
      router.refresh();
      form.reset(variables);
      toast.success("Vacancy updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update vacancy. Please try again.");
      console.error("Update error:", error);
    },
  });

  const onSubmit = (data: VacancyFormData) => {
    updateMutation.mutate(data);
  };

  const hasFormChanged = form.formState.isDirty;

  return (
    <div className="container mx-auto pt-44 px-4 max-w-7xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Stellenanzeigendetails
            </h1>
            <p className="text-muted-foreground mt-1">
              Stellenanzeigen-ID:{" "}
              <span className="font-semibold">{vacancy.vacancyId}</span>
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={updateMutation.isPending || !hasFormChanged}
          >
            {updateMutation.isPending
              ? "Wird gespeichert..."
              : "Änderungen speichern"}
          </Button>
        </div>

        {/* Basic Information Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">
            Grundlegende Informationen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="title">Stellenbezeichnung *</Label>
                  <Input
                    {...field}
                    id="title"
                    placeholder="z.B. Bäcker"
                    className="mt-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="location"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="location">Standort *</Label>
                  <Input
                    {...field}
                    id="location"
                    placeholder="z.B. in der Nähe von Berlin, Deutschland"
                    className="mt-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="beginDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="beginDate">Startdatum *</Label>
                  <Input
                    {...field}
                    id="beginDate"
                    placeholder="z.B. Januar 2025"
                    className="mt-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="duration"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="duration">Dauer *</Label>
                  <Input
                    {...field}
                    id="duration"
                    placeholder="z.B. 6 Monate"
                    className="mt-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="salary"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="salary">Gehalt *</Label>
                  <Input
                    {...field}
                    id="salary"
                    placeholder="z.B. 1200 EUR/Monat"
                    className="mt-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="schedule"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="schedule">Arbeitszeit *</Label>
                  <Textarea
                    {...field}
                    id="schedule"
                    placeholder="z.B. 40-50 Stunden/Woche"
                    className="mt-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </Card>

        {/* Job Description Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">
            Stellenbeschreibung
          </h2>
          <Controller
            name="jobDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="jobDescription">Tätigkeitsbeschreibung *</Label>
                <Textarea
                  {...field}
                  id="jobDescription"
                  placeholder="Detaillierte Stellenbeschreibung..."
                  className="mt-2 min-h-[150px]"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </Card>

        {/* Benefits & Conditions Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">
            Leistungen und Bedingungen
          </h2>
          <div className="space-y-6">
            <Controller
              name="accommodation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="accommodation">Unterkunft *</Label>
                  <Textarea
                    {...field}
                    id="accommodation"
                    placeholder="z.B. Unterkunft wird gestellt"
                    className="mt-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="meals"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="meals">Verpflegung *</Label>
                  <Textarea
                    {...field}
                    id="meals"
                    placeholder="z.B. Verpflegung wird bereitgestellt"
                    className="mt-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </Card>

        {/* Requirements Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">
            Anforderungen und zusätzliche Informationen
          </h2>
          <div className="space-y-6">
            <Controller
              name="availableTo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="availableTo">Zielgruppe (optional)</Label>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="availableTo"
                    placeholder="z.B. nur für Damen"
                    className="mt-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="languageLevel"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="languageLevel">Sprachniveau (optional)</Label>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="languageLevel"
                    placeholder="z.B. Grundkenntnisse Deutsch"
                    className="mt-2"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="additionalInfo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="additionalInfo">
                    Zusätzliche Informationen (optional)
                  </Label>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    id="additionalInfo"
                    placeholder="Weitere relevante Informationen..."
                    className="mt-2 min-h-[100px]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </Card>

        {/* Visibility Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">
            Sichtbarkeitseinstellungen
          </h2>
          <Controller
            name="hide"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="hide" className="text-base">
                    Stellenanzeige ausblenden
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Wenn aktiviert, wird diese Stellenanzeige in der
                    öffentlichen Ansicht ausgeblendet
                  </p>
                </div>
                <Switch
                  id="hide"
                  checked={field.value ?? false}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </Card>

        {/* Media Section (Read-only for now) */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Medien</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-base">Fotos</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {vacancy.photos.length > 0
                  ? `${vacancy.photos.length} Foto(s) hochgeladen`
                  : "Keine Fotos hochgeladen"}
              </p>
              {vacancy.photos.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {vacancy.photos.join(", ")}
                </div>
              )}
            </div>
            <div>
              <Label className="text-base">Videos</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {vacancy.videos.length > 0
                  ? `${vacancy.videos.length} Video(s) hochgeladen`
                  : "Keine Videos hochgeladen"}
              </p>
              {vacancy.videos.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {vacancy.videos.join(", ")}
                </div>
              )}
            </div>
          </div>
        </Card>
      </form>

      {/* Metadata */}
      <div className="mt-8 pt-6 border-t pb-10">
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Erstellt am:</span>{" "}
            {format(new Date(vacancy.createdAt), "dd MMMM yyyy", {
              locale: ka,
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
