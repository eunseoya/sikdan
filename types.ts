export type CalendarView = "weekly" | "monthly";

export interface MenuItem {
  id: string;
  category: string;
  item: string;
  details: string[];
}

export interface ScheduleItem {
  day: string;
  mainDish: string;
  sideDish: string;
}
