"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

const tabs = [
  {
    label: "Alle Bewerbungen",
    value: "/applications/all",
  },
  {
    label: "Benötigt Bearbeitung",
    value: "/applications/needs-review",
  },
];

export function ApplicationsTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab =
    tabs.find((tab) => pathname === tab.value)?.value ?? tabs[0]?.value ?? "";

  return (
    <Tabs value={activeTab} onValueChange={(value) => router.push(value)}>
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
