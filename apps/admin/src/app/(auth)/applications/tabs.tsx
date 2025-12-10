"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  {
    label: "Alle Bewerbungen",
    href: "/applications/all",
  },
  {
    label: "Benötigt Bearbeitung",
    href: "/applications/needs-review",
  },
];

export function ApplicationsTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 border-b border-slate-200 mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "px-4 py-3 font-medium border-b-2 transition-colors",
              isActive
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
