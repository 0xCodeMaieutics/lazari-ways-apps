"use client";

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
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import { createVacancy } from "@/utils/server-actions/vacancy/create-vacancy";
import { FileUpload } from "@/components/file-upload";
import { X } from "lucide-react";
import { NewVacancyFormData, newVacancyFormSchema } from "./schema";

export default function VacanciesNewPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(newVacancyFormSchema),
    defaultValues: {
      title:
        process.env.NODE_ENV === "development"
          ? "Arbeit im Gewächshaus und auf dem Feld"
          : "",
      location:
        process.env.NODE_ENV === "development" ? "In der Nähe von Dresden" : "",
      photo: undefined,
      beginDate: process.env.NODE_ENV === "development" ? "Mai" : "",
      duration: process.env.NODE_ENV === "development" ? "3 Monate" : "",
      salary:
        process.env.NODE_ENV === "development" ? "13,90 €/Stunde brutto" : "",
      jobDescription:
        process.env.NODE_ENV === "development"
          ? `- Ernte von Erdbeeren, Himbeeren, Johannisbeeren und anderen Früchten im Gewächshaus und auf dem Feld;
- Pflanzen von Pflanzen im Gewächshaus
- Unkraut entfernen;
- Im Herbst Sammeln von gepflückten Äpfeln und Aronia im Betrieb;
- und andere Hilfsarbeiten im Betrieb`
          : "",
      schedule:
        process.env.NODE_ENV === "development"
          ? `- 48 Stunden/Woche und mehr
- 8 - 10 Stunden täglich
- 45 Min. Pause
- 1 freier Tag pro Woche.`
          : "",
      accommodation:
        process.env.NODE_ENV === "development"
          ? `Unterkunft in Containern oder Häusern – 13 Euro/Tag pro Person, 4 - 8 Personen pro Zimmer.
Vorhandener Komfort: Warmwasser, Heizung, Internet.
Schlafzimmer: Bett mit Matratze, Kissen, Decke, Bettwäsche, Kleiderschrank.
Küche: Herd, Kühlschrank, Kochgeschirr, Geschirr.
Badezimmer: Duschkabine.`
          : "",
      meals: process.env.NODE_ENV === "development" ? "Auf eigene Kosten." : "",
      availableTo:
        process.env.NODE_ENV === "development" ? "Damen und Herren" : "",
      languageLevel:
        process.env.NODE_ENV === "development" ? "Grundkenntnisse Deutsch" : "",
      additionalInfo:
        process.env.NODE_ENV === "development"
          ? `Der Arbeitgeber stellt Arbeitsschuhe zur Verfügung, aber Sie sollten wettergerechte Kleidung und bequemes eigenes Schuhwerk mitbringen. Das Gehalt wird per Überweisung oder bar am 20. des Folgemonats ausgezahlt. Die Gehaltshöhe kann je nach geleisteten Arbeitsstunden variieren. Pro Stunde müssen 4 - 5 Kisten Erdbeeren, Himbeeren und Johannisbeeren gepflückt werden. Es gibt im Betrieb Normen, die erfüllt werden müssen. Achtung! Die Beschäftigungsdauer kann je nach Ernte und Wetterbedingungen verlängert oder verkürzt werden. Reisekosten und Versicherungspolice werden separat bezahlt.**`
          : "",
      hide: false,
      photos: [],
      videos: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: createVacancy,
    onSuccess: ({ isSuccess, id: createdVacancyid }) => {
      if (isSuccess) return router.push(`/vacancies/${createdVacancyid}`);
      toast.error(
        "Fehler beim Erstellen der Stellenanzeige. Bitte versuchen Sie es erneut."
      );
    },
  });

  const onSubmit = (data: NewVacancyFormData) => {
    createMutation.mutate(data);
  };

  const fillDefaultValues = () => {
    const defaultValues = {
      title: "Arbeit im Gewächshaus und auf dem Feld",
      location: "In der Nähe von Dresden",
      beginDate: "Mai",
      duration: "3 Monate",
      salary: "13,90 €/Stunde brutto",
      jobDescription: `- Ernte von Erdbeeren, Himbeeren, Johannisbeeren und anderen Früchten im Gewächshaus und auf dem Feld;
- Pflanzen von Pflanzen im Gewächshaus
- Unkraut entfernen;
- Im Herbst Sammeln von gepflückten Äpfeln und Aronia im Betrieb;
- und andere Hilfsarbeiten im Betrieb`,
      schedule: `- 48 Stunden/Woche und mehr
- 8 - 10 Stunden täglich
- 45 Min. Pause
- 1 freier Tag pro Woche.`,
      accommodation: `Unterkunft in Containern oder Häusern – 13 Euro/Tag pro Person, 4 - 8 Personen pro Zimmer.
Vorhandener Komfort: Warmwasser, Heizung, Internet.
Schlafzimmer: Bett mit Matratze, Kissen, Decke, Bettwäsche, Kleiderschrank.
Küche: Herd, Kühlschrank, Kochgeschirr, Geschirr.
Badezimmer: Duschkabine.`,
      meals: "Auf eigene Kosten.",
      availableTo: "Damen und Herren",
      languageLevel: "Grundkenntnisse Deutsch",
      additionalInfo: `Der Arbeitgeber stellt Arbeitsschuhe zur Verfügung, aber Sie sollten wettergerechte Kleidung und bequemes eigenes Schuhwerk mitbringen. Das Gehalt wird per Überweisung oder bar am 20. des Folgemonats ausgezahlt. Die Gehaltshöhe kann je nach geleisteten Arbeitsstunden variieren. Pro Stunde müssen 4 - 5 Kisten Erdbeeren, Himbeeren und Johannisbeeren gepflückt werden. Es gibt im Betrieb Normen, die erfüllt werden müssen. Achtung! Die Beschäftigungsdauer kann je nach Ernte und Wetterbedingungen verlängert oder verkürzt werden. Reisekosten und Versicherungspolice werden separat bezahlt.**`,
      hide: false,
    };

    // Reset the form with default values
    form.reset(defaultValues);

    // Show a subtle toast notification
    toast.success("Standardwerte eingefügt", {
      duration: 1500,
    });
  };

  return (
    <div className="container mx-auto pt-44 px-4 max-w-7xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold text-foreground select-none"
              onDoubleClick={fillDefaultValues}
              title="Doppelklick zum Ausfüllen der Standardwerte"
            >
              Neue Stellenanzeige erstellen
            </h1>
            <p className="text-muted-foreground mt-1">
              Füllen Sie alle erforderlichen Felder aus, um eine Stellenanzeige
              zu erstellen
            </p>
          </div>
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
                    placeholder="z.B. Koch"
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
                    placeholder="z.B. in der Nähe von Berlin"
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
                    placeholder={`z.B.
-48 Stunden/Woche und mehr
-8-10 Stunden täglich
-45 Min. Pause
-1 freier Tag pro Woche.`}
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
                  placeholder={`z.B.
-Ernte von Erdbeeren, Himbeeren, Johannisbeeren und anderen Früchten im Gewächshaus und auf dem Feld
-Pflanzen von Pflanzen im Gewächshaus
-Unkraut entfernen
-Im Herbst Sammeln von Äpfeln und Aronia im Betrieb
-und andere Hilfsarbeiten im Betrieb.`}
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

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Medien</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-base">Foto *</Label>

              {form.watch("photo") ? (
                <div className="h-12 flex items-center justify-between border border-dashed px-2 rounded-xl text-sm mt-1">
                  <span className="text-green-600">
                    Datei erfolgreich hochgeladen.
                    {form.getValues("photo")?.name}
                  </span>
                  <Button
                    onClick={() => {
                      form.reset({
                        photo: undefined,
                      });
                    }}
                    variant={"ghost"}
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <FileUpload
                  placeholder="Datei auswählen"
                  accept=".png,.jpg,.jpeg,.webp"
                  onChange={(file) => {
                    if (file === null) return;
                    form.setValue("photo", file as File);
                  }}
                />
              )}
              {form.formState.errors.photo && (
                <p className="text-sm text-red-600 mt-1">
                  {form.formState.errors.photo.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-base">Fotos (optional)</Label>
              <FileUpload
                placeholder="Datei auswählen"
                accept=".png,.jpg,.jpeg"
                multiple
              />
            </div>
            <div className="space-y-4">
              <Label className="text-base">Videos (optional)</Label>
              <FileUpload
                placeholder="Datei auswählen"
                accept=".video/*"
                multiple
              />
            </div>
          </div>
          <Button
            className="ml-auto"
            type="submit"
            size="lg"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending
              ? "Wird erstellt..."
              : "Stellenanzeige erstellen"}
          </Button>
        </Card>

        <div className="pb-10" />
      </form>
    </div>
  );
}
