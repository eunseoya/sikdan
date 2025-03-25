import CalendarApp from "@/components/calendar-app";
import { Metadata } from "next";

interface CalendarDatePageProps {
  params: {
    date: string;
  };
}

export function generateMetadata({ params }: CalendarDatePageProps): Metadata {
  return {
    title: `Calendar - ${params.date}`,
  };
}

export default function CalendarDatePage({ params }: CalendarDatePageProps) {
  return <CalendarApp initialDate={params.date} initialPanelIndex={2} />;
}
