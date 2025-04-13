"use client";
import { useEffect, useState } from "react";
import CalendarApp from "@/components/calendar-app";

export default function Home() {
  const [initialDate, setInitialDate] = useState<string | null>(null);

  useEffect(() => {
    setInitialDate(new Date().toISOString());
  }, []);

  if (!initialDate) return null; // Avoid rendering until the date is set

  return (
    <main className="min-h-screen">
      <CalendarApp {...{ initialDate }} />
    </main>
  );
}
