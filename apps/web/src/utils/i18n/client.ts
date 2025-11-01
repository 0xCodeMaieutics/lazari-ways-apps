"use client";

import i18next from "./i18next";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function useTranslations(
  ns: string,
  options: { keyPrefix?: string } = {}
) {
  const { lng = "" } = useParams();
  const [activeLng, setActiveLng] = useState(i18next.resolvedLanguage);
  useEffect(() => {
    if (activeLng === i18next.resolvedLanguage) return;
    setActiveLng(i18next.resolvedLanguage);
  }, [activeLng]);

  useEffect(() => {
    if (!lng || i18next.resolvedLanguage === lng) return;
    i18next.changeLanguage(Array.isArray(lng) ? lng[0] : lng);
  }, [lng]);
  return useTranslation(ns, options);
}
