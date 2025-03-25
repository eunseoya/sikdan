import CalendarApp from "@/components/calendar-app";

// Simplest possible page component definition
export default function CalendarDatePage({ params }: any) {
  return <CalendarApp initialDate={params.date} initialPanelIndex={2} />;
}
