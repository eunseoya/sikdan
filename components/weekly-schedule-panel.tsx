"use client";

import type { ScheduleItem } from "@/types";
import { Share } from "lucide-react";
import { onShare } from "@/hooks/utils";
import React from "react";

const getKoreanDayName = (date: Date): string => {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
};

const getWeekDates = (
  scheduleItems: ScheduleItem[],
  currentWeek: Date,
): Date[] => {
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
  const weekDates = getWeekDates(scheduleItems, currentWeek);

  return (
    <div id="share" className="p-4">

      {/* Mobile View */}
      <div className="grid grid-cols-5 gap-4 pl-4 md:hidden">
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
      <button
        onClick={() => onShare("share")}
        className="flex text-[#989898] hover:text-[#000000] transition-colors"
      ><Share size={20} />
      </button>
      </div>

      <div className="md:hidden">
      {weekDates.map((date, index) => {
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

      {/* Desktop View */}
      {/* Desktop View */}
<div className="hidden md:grid grid-cols-[80px_repeat(7,minmax(0,1fr))_40px] gap-4 pl-4">
  {/* First Row: Header */}
  <div className="text-sm text-[#989898] mb-1">메뉴</div>
  {weekDates.map((date, index) => {
    const dateString = `${date.getMonth() + 1}/${date.getDate()}`;
    const dayName = getKoreanDayName(date);
    return (
      <div key={index} className="flex flex-col items-start">
        <div className="text-sm text-[#989898]">{dayName}</div>
        <div className="text-sm text-[#989898]">{dateString}</div>
      </div>
    );
  })}
  <button
    onClick={() => onShare("share")}
    className="flex items-start text-[#989898] hover:text-[#000000] transition-colors"
  >
    <Share size={20} />
  </button>

  {/* Remaining Rows: Meals */}
  {["중식", "석식", "간식"].map((menuType, rowIndex) => (
    <React.Fragment key={rowIndex}>
      <div className="text-sm text-[#989898] mb-1">{menuType}</div>
      {weekDates.map((date, colIndex) => {
        const dateString = `${date.getMonth() + 1}/${date.getDate()}`;
        const scheduleItem = scheduleItems.find(
          (item) => item.date === dateString,
        );
        const menu =
          menuType === "중식"
            ? scheduleItem?.lunch
            : menuType === "석식"
            ? scheduleItem?.dinner
            : scheduleItem?.dessert;

        return (
          <div
            key={colIndex}
            className="flex flex-col cursor-pointer hover:bg-gray-50 rounded-md p-2"
            onClick={() => onSelectDate(dateString)}
          >
            {menu ? (
              <>
                <div className="text-lg font-medium">{menu.mainDish}</div>
                {menu.sideDishes.length > 0 && (
                  <div className="text-sm text-[#989898]">
                    {menu.sideDishes.join(", ")}
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-400"></div>
            )}
          </div>
        );
      })}
      {/* Empty cell for the share button's column */}
      <div></div>
    </React.Fragment>
  ))}
</div>
    </div>
  );
}

