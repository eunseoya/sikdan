export interface MenuItem {
  id: string
  category: string
  mainDish: string
  sideDishes: string[]
}

export interface ScheduleItem {
  day: string
  date: string
  lunch: MenuItem
  dinner: MenuItem
  dessert: MenuItem
}

export type CalendarView = "weekly" | "monthly" | "daily"
export interface ShoppingListItem {
  id: string;
  store: string;
  items: string[];
}

export interface ShoppingList {
  stores: ShoppingListItem[];
}
