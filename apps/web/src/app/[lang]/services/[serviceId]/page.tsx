// FIXME: Placeholder file to keep the folder structure intact
export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string; serviceId: string }>;
}) {
  const { lang, serviceId } = await params;
  return <main className="min-h-screen w-full flex flex-col">{serviceId}</main>;
}
