"use client";

import { Vacancy } from "@workspace/server/db";
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
import z from "zod";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";

const vacancyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  beginDate: z.string().min(1, "Begin date is required"),
  duration: z.string().min(1, "Duration is required"),
  salary: z.string().min(1, "Salary is required"),
  jobDescription: z.string().min(1, "Job description is required"),
  schedule: z.string().min(1, "Schedule is required"),
  accommodation: z.string().min(1, "Accommodation information is required"),
  meals: z.string().min(1, "Meals information is required"),
  availableTo: z.string().nullable().optional(),
  languageLevel: z.string().nullable().optional(),
  additionalInfo: z.string().nullable().optional(),
  hide: z.boolean().nullable().optional(),
  photos: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});

type VacancyFormData = z.infer<typeof vacancyFormSchema>;

export const VacancyProfile = ({ vacancy }: { vacancy: Vacancy }) => {
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
      photos: vacancy.photos ?? [],
      videos: vacancy.videos ?? [],
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: VacancyFormData) => {
      const result = await updateVacancy({
        id: vacancy.id,
        data: {
          ...data,
          availableTo: data.availableTo || null,
          languageLevel: data.languageLevel || null,
          additionalInfo: data.additionalInfo || null,
        },
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
              ვაკანსიის დეტალები
            </h1>
            <p className="text-muted-foreground mt-1">
              ვაკანსიის ID:{" "}
              <span className="font-semibold">{vacancy.vacancyId}</span>
            </p>
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={updateMutation.isPending || !hasFormChanged}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        {/* Basic Information Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">
            ძირითადი ინფორმაცია
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    {...field}
                    id="title"
                    placeholder="e.g., Bäcker"
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
                  <Label htmlFor="location">ლოკაცია *</Label>
                  <Input
                    {...field}
                    id="location"
                    placeholder="e.g., Nähe Berlin, Germany"
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
                  <Label htmlFor="beginDate">დაწყების თარიღი *</Label>
                  <Input
                    {...field}
                    id="beginDate"
                    placeholder="e.g., January 2025"
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
                  <Label htmlFor="duration">ხანგრძლივობა *</Label>
                  <Input
                    {...field}
                    id="duration"
                    placeholder="e.g., 6 months"
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
                  <Label htmlFor="salary">ხელფასი *</Label>
                  <Input
                    {...field}
                    id="salary"
                    placeholder="e.g., 1200 EUR/month"
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
                  <Label htmlFor="schedule">გრაფიკი *</Label>
                  <Textarea
                    {...field}
                    id="schedule"
                    placeholder="e.g., 40-50 hours/week"
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
            სამუშაო აღწერა
          </h2>
          <Controller
            name="jobDescription"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="jobDescription">აღწერა *</Label>
                <Textarea
                  {...field}
                  id="jobDescription"
                  placeholder="დეტალური სამუშაო აღწერა..."
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
            სარგებელი და პირობები
          </h2>
          <div className="space-y-6">
            <Controller
              name="accommodation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="accommodation">საცხოვრებელი *</Label>
                  <Textarea
                    {...field}
                    id="accommodation"
                    placeholder="e.g., Unterkunft wird gestellt"
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
                  <Label htmlFor="meals">კვება *</Label>
                  <Textarea
                    {...field}
                    id="meals"
                    placeholder="e.g., Mahlzeiten werden gestellt"
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
            მოთხოვნები და დამატებითი ინფორმაცია
          </h2>
          <div className="space-y-6">
            <Controller
              name="availableTo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Label htmlFor="availableTo">მიმართვა (არასავალდებულო)</Label>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="availableTo"
                    placeholder="e.g., მხოლოდ ქალბატონებისთვის"
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
                  <Label htmlFor="languageLevel">
                    ენის დონე (არასავალდებულო)
                  </Label>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    id="languageLevel"
                    placeholder="e.g., Grundkenntnisse in Deutsch"
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
                    დამატებითი ინფორმაცია (არასავალდებულო)
                  </Label>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    id="additionalInfo"
                    placeholder="Any other relevant information..."
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
            ხილვადობის პარამეტრები
          </h2>
          <Controller
            name="hide"
            control={form.control}
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="hide" className="text-base">
                    ვაკანსიის დამალვა
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    როდესაც ჩართულია, ეს ვაკანსია საჯარო ხედვიდან დაიმალება
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
          <h2 className="text-xl font-semibold mb-6 text-foreground">მედია</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-base">ფოტოები</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {vacancy.photos.length > 0
                  ? `${vacancy.photos.length} photo(s) uploaded`
                  : "No photos uploaded"}
              </p>
              {vacancy.photos.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {vacancy.photos.join(", ")}
                </div>
              )}
            </div>
            <div>
              <Label className="text-base">ვიდეოები</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {vacancy.videos.length > 0
                  ? `${vacancy.videos.length} video(s) uploaded`
                  : "No videos uploaded"}
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
            <span className="font-medium">შექმნილია:</span>{" "}
            {new Date(vacancy.createdAt).toLocaleDateString("ka-GE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
