"use client";

import {
  Plus,
  Signal,
  ShoppingBasket,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Lightbulb,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useState } from "react";
import "react-day-picker/dist/style.css";

interface CalendarHeaderProps {
  title: string;
  onChangeView: () => void;
  backButton?: boolean;
  buttonText?: string;
  showNavigation?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onBasketClick?: () => void;
  onSignalClick?: () => void;
  onPlusClick?: () => void;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export function CalendarHeader({
  title,
  onChangeView,
  backButton = false,
  buttonText,
  showNavigation = false,
  onPrevious,
  onNext,
  onBasketClick,
  onSignalClick,
  onPlusClick,
  selectedDate,
  onDateSelect,
}: CalendarHeaderProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const textColor = "text-gray-500";

  return (
    <div className="p-4 border-b border-[#989898]/20 flex justify-between items-center">
      <div className="flex items-center">
        {showNavigation && (
          <button
            onClick={onPrevious}
            className="mr-2 p-1 rounded-full hover:bg-gray-100"
            aria-label="Previous week"
            type="button"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        <button
          onClick={onChangeView}
          className="p-2 text-xl font-medium rounded-md hover:bg-gray-100"
          type="button"
        >
          {backButton ? <span>←</span> : <span>{title || "보기 변경"}</span>}
        </button>

        {showNavigation && (
          <button
            onClick={onNext}
            className="ml-2 p-1 rounded-full hover:bg-gray-100"
            aria-label="Next week"
            type="button"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      <div className="flex items-center relative">
        {backButton && (
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100"
            type="button"
          >
            <Calendar className="h-4 w-4" />
            <span>
              {selectedDate?.toLocaleDateString("ko-KR") || "날짜 선택"}
            </span>{" "}
          </button>
        )}
        {showDatePicker && backButton && (
          <div className="absolute top-full mt-1 bg-white shadow-lg rounded-md z-50">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date && onDateSelect) {
                  onDateSelect(date);
                  setShowDatePicker(false);
                }
              }}
              className="p-3"
            />
          </div>
        )}
      </div>

      <div className="flex items-center">
        <div>
          <button
            onClick={onPlusClick}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Add Item"
            type="button"
          >
            <Plus className={`h-4 w-4 ${textColor}`} />
          </button>
        </div>

        <div className="mr-1">
          <button
            onClick={onBasketClick}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Grocery List"
            type="button"
          >
            <ShoppingBasket className={`h-4 w-4 ${textColor}`} />
          </button>
        </div>
        <div className="mr-1">
          <button
            onClick={onSignalClick}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="View Stats"
            type="button"
          >
            <Signal className={`h-4 w-4 ${textColor}`} />
          </button>
        </div>
        <div className="mr-1">
          <a
            href="https://k-schoolmeals.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-full hover:bg-gray-100 inline-block"
            aria-label="K-School Meals"
          >
            <Lightbulb className={`h-4 w-4 ${textColor}`} />
          </a>
        </div>
      </div>
    </div>
  );
}
