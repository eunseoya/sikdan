import CalendarApp from "@/components/calendar-app";

export default function Home() {
  return <CalendarApp {...{ initialDate: new Date().toISOString() }} />;
}
