"use client";

import type { ScheduleItem } from "@/types";
import { Share } from "lucide-react";
import { onShare } from "@/hooks/utils";
const getKoreanDayName = (date: Date): string => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
};

const getWeekDates = (scheduleItems: ScheduleItem[], currentWeek: Date): Date[] => {
  // Always use the provided currentWeek
  const weekStart = new Date(currentWeek);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });
};

interface WeeklySchedulePanelProps {
  scheduleItems: ScheduleItem[];
  onSelectDate: (date: string) => void;
  currentWeek: Date;
}

export function WeeklySchedulePanel({
  scheduleItems,
  onSelectDate,
  currentWeek,
}: WeeklySchedulePanelProps) {
  return (
    <div id="share" className="p-4">
      <div className="relative">
        <button 
          onClick={() => onShare("share")}
          className="absolute right-4 top-0 flex items-center text-[#989898] hover:text-[#000000] transition-colors"
        >
          <Share size={20} />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-4 pl-4">
        <div className="flex flex-col">
          <div className="text-sm text-[#989898] mb-1">날짜</div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-[#989898] mb-1">중식</div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-[#989898] mb-1">석식</div>
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-[#989898] mb-1">간식</div>
        </div>
        

      </div>
      
     


      {getWeekDates(scheduleItems, currentWeek).map((date, index) => {
        const dateString = `${date.getMonth() + 1}/${date.getDate()}`;
        const dayName = getKoreanDayName(date);
        const scheduleItem = scheduleItems.find(
          (item) => item.date === dateString,
        );

        return (
          <div
        key={index}
        className="grid grid-cols-4 gap-4 mt-4 cursor-pointer hover:bg-gray-50 rounded-md p-4"
        onClick={() => onSelectDate(dateString)}
          >
        <div className="flex">
          <div className="text-2xl font-medium">{dayName}</div>
          <div className="text-2xl text-[#989898] ml-2">{dateString}</div>
        </div>
        <div className="flex flex-col">
              {scheduleItem ? (
                <>
                  <div className="text-lg font-medium">
                    {scheduleItem.lunch.mainDish}
                  </div>
                  {scheduleItem.lunch.sideDishes.length > 0 && (
                    <div className="text-sm text-[#989898]">
                      {scheduleItem.lunch.sideDishes.join(", ")}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-400"></div>
              )}
            </div>
            <div className="flex flex-col">
              {scheduleItem ? (
                <>
                  <div className="text-lg font-medium">
                    {scheduleItem.dinner.mainDish}
                  </div>
                  {scheduleItem.dinner.sideDishes.length > 0 && (
                    <div className="text-sm text-[#989898]">
                      {scheduleItem.dinner.sideDishes.join(", ")}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-400"></div>
              )}
            </div>
            <div className="flex flex-col">
              {scheduleItem ? (
                <>
                  <div className="text-lg font-medium">
                    {scheduleItem.dessert.mainDish}
                  </div>
                  {scheduleItem.dessert.sideDishes.length > 0 && (
                    <div className="text-sm text-[#989898]">
                      {scheduleItem.dessert.sideDishes.join(", ")}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-sm text-gray-400"></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
