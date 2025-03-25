"use client";

interface MonthlyCalendarPanelProps {
  year: number;
  onSelectDate: (date: string) => void;
}

export function MonthlyCalendarPanel({
  year,
  onSelectDate,
}: MonthlyCalendarPanelProps) {
  const months = generateMonthsData(year);

  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {months.map((month, monthIdx) => (
          <div key={monthIdx} className="flex-1">
            <div className="text-xl font-medium text-center mb-2">
              {month.name}
            </div>
            <div className="grid grid-cols-7 text-xs mb-2">
              {weekdays.map((day, dayIdx) => (
                <div key={dayIdx} className="text-center font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-xs">
              {Array.from({ length: 42 }, (_, i) => {
                const dayOffset = month.startDay - 1;
                const day = i - dayOffset + 1;
                return day > 0 && day <= month.days ? (
                  <div
                    key={i}
                    className="text-center py-1 cursor-pointer hover:bg-gray-100 rounded-full w-6 h-6 mx-auto flex items-center justify-center"
                    onClick={() => onSelectDate(`${monthIdx + 1}/${day}`)}
                  >
                    {day}
                  </div>
                ) : (
                  <div key={i}></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Function to generate months data dynamically
function generateMonthsData(year: number) {
  const monthsData = [];
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  for (let month = 0; month < 12; month++) {
    // Create a date for the first day of the month
    const firstDay = new Date(year, month, 1);

    // Get the day of the week for the first day (0-6, where 0 is Sunday)
    let startDay = firstDay.getDay();

    // Adjust startDay to ensure the week starts on Sunday
    startDay = startDay === 0 ? 0 : startDay;

    // Calculate the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    monthsData.push({
      name: monthNames[month],
      days: daysInMonth,
      startDay: startDay,
    });
  }

  // You can slice this array if you want to display fewer months
  // e.g., return monthsData.slice(0, 3); for just first 3 months
  return monthsData;
}
