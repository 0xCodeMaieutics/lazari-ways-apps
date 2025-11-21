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
import z from "zod";
import { useRouter } from "next/navigation";
import { createVacancy } from "@/utils/server-actions/vacancy/create-vacancy";

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

export default function VacanciesNewPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(vacancyFormSchema),
    defaultValues: {
      title: "მუშაობა სათბურში და მინდორში",
      location: "დრეზდენის მახლობლად",
      beginDate: "მაისი",
      duration: "3 თვე",
      salary: "13,90 ევრო/საათში ბრუტო",
      jobDescription: `-სათბურში და მინდორში ჟოლოების, მაყვლის, კენკრისა და სხვა ხილის შეგროვება;
-მცენარეების დარგვა სათბურში
-მოყვანილი ბალახის ამოღება;
-შემოდგომაზე საწარმოში გატეხილი ვაშლისა და არონიას შეგროვება;
-და სხვა დამხმარე სამუშაოები საწარმოში`,
      schedule: `-48 საათი/კვირაში და მეტი
-დღეში 8 - 10 საათი
-45 წთ შესვენება
-კვირაში 1 გამოსავალი.`,
      accommodation: `მიწოდებულია საცხოვრებელი კონტეინერები ან სახლები – 13 ევრო/დღეში ერთ ადამიანზე, 4 - 8 ადამიანი ერთ ოთახში.
არსებული კომფორტი: თბილი წყალი, გათბობა, ინტერნეტი.
საძინებელი: მატრასიანი საწოლი, ბალიშები, გადასაფარებელი, თეთრეული, ტანსაცმლის კარადა.
სამზარეულო: ქურა, მაცივარი, საჭმლის ხელსაწყოები, ჭურჭელი.
სააბაზანო: საშხაპე კაბინა.`,
      meals: "საკუთარი ხარჯით.",
      availableTo: "ქალბატონები და მამაკაცები",
      languageLevel: "Grundkenntnisse Deutsch-ში",
      additionalInfo: `დამსაქმებელი უზრუნველყოფს სამუშაო ფეხსაცმელს, მაგრამ საჭიროა თან ჰქონდეთ ნებისმიერი ამინდისთვის შესაბამისი ტანსაცმელი და საკუთარი კომფორტული ფეხსაცმელი. ხელფასი გაიცემა გადარიცხვით ან ნაღდად მომდევნო თვის 20 რიცხვში. ხელფასის ოდენობა შეიძლება იცვალოს გამომუშავებულ საათებზე დაყრდნობით. საათში სასანთლოს, მაყვლისა და ჟოლოების მოსაწყვილებლად საჭიროა 4 - 5 ყუთი. საწარმოში არსებობს ნორმები, რომლებიც უნდა შესრულდეს. ყურადღება! დასაქმების ვადა შეიძლება გაიზარდოს ან შემცირდეს მოსავლისა და ამინდის პირობების მიხედვით. ცალკე იხდის მგზავრობის ხარჯი და სადაზღვევო პოლისი.**`,
      hide: false,
      photos: [],
      videos: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: VacancyFormData) => createVacancy(data),
    onSuccess: ({ isSuccess, id: createdVacancyid }) => {
      if (isSuccess) return router.push(`/vacancies/${createdVacancyid}`);
      toast.error("Failed to create vacancy. Please try again.");
    },
  });

  const onSubmit = (data: VacancyFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="container mx-auto pt-44 px-4 max-w-7xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              ახალი ვაკანსიის შექმნა
            </h1>
            <p className="text-muted-foreground mt-1">
              შეავსეთ ყველა სავალდებულო ველი ვაკანსიის შესაქმნელად
            </p>
          </div>
          <Button type="submit" size="lg" disabled={createMutation.isPending}>
            {createMutation.isPending
              ? "მიმდინარეობს შექმნა..."
              : "ვაკანსიის შექმნა"}
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
                    placeholder="მაგ., მცხობელი"
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
                    placeholder="მაგ., ბერლინთან ახლოს"
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
                    placeholder="მაგ., 2025 წლის იანვარი"
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
                    placeholder="მაგ., 6 თვე"
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
                    placeholder="მაგ., 1200 EUR/თვე"
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
                    placeholder={`მაგ.,
-48 საათი/კვირაში და მეტი
-დღეში 8
- 10 საათი
-45 წთ შესვენება
-კვირაში 1 გამოსავალი.`}
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
                <Label htmlFor="jobDescription">სამუშაოს არსი *</Label>
                <Textarea
                  {...field}
                  id="jobDescription"
                  placeholder={`მაგ.,
-სათბურში და მინდორში ჟოლოების, მაყვლის, კენკრისა და სხვა ხილის შეგროვება
-მცენარეების დარგვა სათბურში
-მოყვანილი ბალახის ამოღება
-შემოდგომაზე საწარმოში გატეხილი ვაშლისა და არონიას შეგროვება
-და სხვა დამხმარე სამუშაოები საწარმოში.`}
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
                    placeholder="მაგ., საცხოვრებელი ჩვენთან ჯესტელტად არის"
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
                    placeholder="მაგ., კვება უზრუნველყოფილია"
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
                    placeholder="მაგ., მხოლოდ ქალბატონებისთვის"
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
                    placeholder="მაგ., Grundkenntnisse Deutsch-ში"
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

        {/* Media Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 text-foreground">მედია</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-base">ფოტოები</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Photo upload functionality will be added later
              </p>
            </div>
            <div>
              <Label className="text-base">ვიდეოები</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Video upload functionality will be added later
              </p>
            </div>
          </div>
        </Card>

        <div className="pb-10" />
      </form>
    </div>
  );
}
