import CalendarApp from "@/components/calendar-app";

export default function Home() {
  return (
    <main className="min-h-screen">
      <CalendarApp {...{ initialDate: new Date().toISOString() }} />
    </main>
  );
}
