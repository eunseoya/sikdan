"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CalendarHeader } from "@/components/calendar-header";
import { MenuPanel } from "@/components/menu-panel";
import { ShoppingListPanel } from "@/components/shopping-list-panel";
import { WeeklySchedulePanel } from "@/components/weekly-schedule-panel";
import { MonthlyCalendarPanel } from "@/components/monthly-calendar-panel";
import { SelectedItemPanel } from "@/components/selected-item-panel";
import { StatsPanel } from "@/components/stats-panel";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { MenuItem, ScheduleItem, CalendarView } from "@/types";
import menuData from "@/data/menu.json";
import {
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  addWeeks,
  format,
} from "date-fns";
import { ko } from "date-fns/locale";
import type { ShoppingList } from "@/types/shopping-list";

interface CalendarAppProps {
  initialDate?: string;
  initialPanelIndex?: number;
}

export default function CalendarApp({
  initialDate = "",
  initialPanelIndex = 1,
}: CalendarAppProps) {
  const [activeView, setActiveView] = useState<CalendarView>("weekly");
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({
    중식: true,
    석식: true,
    간식: true,
  });
  const [shoppingList, setShoppingList] = useState<ShoppingList>({
    stores: [],
  });
  const [isShoppingListLoading, setIsShoppingListLoading] = useState(true);
  const [activePanelIndex, setActivePanelIndex] =
    useState<number>(initialPanelIndex);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  ); // Add currentWeek state
  const [editMode, setEditMode] = useState({
    lunch: false,
    dinner: false,
    dessert: false,
    sideLunch: false,
    sideDinner: false,
  });

  const [editValues, setEditValues] = useState({
    lunch: "",
    dinner: "",
    dessert: "",
    sideLunch: "",
    sideDinner: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize state from props
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    setSelectedDate(initialDate || today);
    if (initialPanelIndex !== undefined) {
      setActivePanelIndex(initialPanelIndex);
    }
  }, [initialDate, initialPanelIndex]);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 768px)");
  const router = useRouter();

  // Format date for URL: convert YYYY-MM-DD or MM/DD to a consistent format
  const formatDateForUrl = (date: string): string => {
    const today = new Date();
    if (date.includes("/")) {
      return date; // Keep MM/DD format as is since it matches our data
    }
    // If it's YYYY-MM-DD format, convert to MM/DD
    const parts = date.split("-");
    if (parts.length === 3) {
      return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
    }
    return `${today.getMonth() + 1}/${today.getDate()}`; // fallback to today
  };

  const goBackToCalendar = () => {
    setActivePanelIndex(1);
    router.push("/calendar", { scroll: false });
  };

  const goToCalendarView = () => {
    setActivePanelIndex(1);
    // Reset to weekly view when coming from menu
    setActiveView("weekly");
  };

  const goToShoppingList = () => {
    setActivePanelIndex(4);
  };

  const changeView = (view: CalendarView) => {
    setActiveView(view);
  };

  const selectDate = (date: string) => {
    setSelectedDate(date); // Use the MM/DD format directly
    setActivePanelIndex(2);
  };

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const scheduleItems: ScheduleItem[] = menuData; // Assuming you have schedule items data

  // Filter schedule items based on current week
  const currentScheduleItems = useMemo(() => {
    if (activeView !== "weekly") return scheduleItems;

    return menuData.filter((item) => {
      const [month, day] = item.date.split("/");
      const itemDate = new Date(
        new Date().getFullYear(),
        parseInt(month) - 1,
        parseInt(day),
      );
      const start = startOfWeek(currentWeek, { weekStartsOn: 0 });
      const end = endOfWeek(currentWeek, { weekStartsOn: 0 });

      return isWithinInterval(itemDate, { start, end });
    });
  }, [currentWeek, activeView]);

  // Update navigation functions to use currentWeek
  const navigateToPreviousWeek = () => {
    const newWeek = addWeeks(currentWeek, -1);
    setCurrentWeek(newWeek);
    const firstDayOfWeek = startOfWeek(newWeek, { weekStartsOn: 0 });
    const formattedDate = `${firstDayOfWeek.getMonth() + 1}/${firstDayOfWeek.getDate()}`;
    setSelectedDate(formattedDate);
  };

  const navigateToNextWeek = () => {
    const newWeek = addWeeks(currentWeek, 1);
    setCurrentWeek(newWeek);
    const firstDayOfWeek = startOfWeek(newWeek, { weekStartsOn: 0 });
    const formattedDate = `${firstDayOfWeek.getMonth() + 1}/${firstDayOfWeek.getDate()}`;
    setSelectedDate(formattedDate);
  };

  const goToStatsPanel = () => {
    setActivePanelIndex(3);
  };

  const goToSelectedItemPanel = () => {
    setActivePanelIndex(2);
    setIsActive(true); // Set isActive to true when the user clicks plus
  };

  // Calculate stats
  const stats = useMemo(() => {
    const dishStats: Map<string, number> = new Map();

    menuData.forEach((item: MenuItem) => {
      // Count dishes across all meal types (lunch, dinner, dessert)
      const dishTypes = [
        { type: "lunch", dish: item.lunch?.mainDish },
        { type: "dinner", dish: item.dinner?.mainDish },
        { type: "dessert", dish: item.dessert?.mainDish },
      ];

      dishTypes.forEach(({ dish }) => {
        if (dish) {
          // Normalize dish name: trim whitespace
          const normalizedDish = dish.trim();
          if (normalizedDish) {
            dishStats.set(
              normalizedDish,
              (dishStats.get(normalizedDish) || 0) + 1,
            );
          }
        }
      });
    });

    return { dishStats };
  }, []);

  const handleEditModeChange = useCallback((type: string, value: boolean) => {
    setEditMode((prev) => ({ ...prev, [type]: value }));
  }, []);

  const handleEditValueChange = useCallback((field: string, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  }, []);
  const handleSaveChanges = useCallback(async () => {
    if (!selectedDate || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // Find the current menu item
      const currentMenuItem = menuData.find(
        (item) => item.date === selectedDate,
      );

      // Create updated or new menu item
      const updatedMenu = currentMenuItem
        ? {
            ...currentMenuItem,
            lunch: {
              ...currentMenuItem.lunch,
              mainDish: editValues.lunch || currentMenuItem.lunch.mainDish,
              sideDishes: editValues.sideLunch
                ? editValues.sideLunch.split(",").map((s) => s.trim())
                : currentMenuItem.lunch.sideDishes,
            },
            dinner: {
              ...currentMenuItem.dinner,
              mainDish: editValues.dinner || currentMenuItem.dinner.mainDish,
              sideDishes: editValues.sideDinner
                ? editValues.sideDinner.split(",").map((s) => s.trim())
                : currentMenuItem.dinner.sideDishes,
            },
            dessert: {
              ...currentMenuItem.dessert,
              mainDish: editValues.dessert || currentMenuItem.dessert.mainDish,
              sideDishes: currentMenuItem.dessert.sideDishes,
            },
          }
        : {
            date: selectedDate,
            lunch: {
              mainDish: editValues.lunch || "",
              sideDishes: editValues.sideLunch
                ? editValues.sideLunch.split(",").map((s) => s.trim())
                : [],
            },
            dinner: {
              mainDish: editValues.dinner || "",
              sideDishes: editValues.sideDinner
                ? editValues.sideDinner.split(",").map((s) => s.trim())
                : [],
            },
            dessert: {
              mainDish: editValues.dessert || "",
              sideDishes: [],
            },
            category: "", // Add a default category or derive it from other data
          };

      const response = await fetch("/api/update-menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          updatedMenu,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save changes");
      }

      const result = await response.json();
      console.log("Changes saved successfully:", result);

      // Update local state
      const updatedScheduleItems = currentMenuItem
        ? scheduleItems.map((item) =>
            item.date === selectedDate ? updatedMenu : item,
          )
        : [...scheduleItems, updatedMenu];

      // Force a re-render of the schedule items
      setSelectedItems((prev) => ({ ...prev }));

      // Reset edit states
      setEditMode({
        lunch: false,
        dinner: false,
        dessert: false,
        sideLunch: false,
        sideDinner: false,
      });
      setEditValues({
        lunch: "",
        dinner: "",
        dessert: "",
        sideLunch: "",
        sideDinner: "",
      });
    } catch (error) {
      console.error("Error saving changes:", error);
      setError(
        error instanceof Error ? error.message : "Failed to save changes",
      );
    } finally {
      setIsLoading(false);
    }
  }, [editValues, selectedDate, menuData, scheduleItems, isLoading]);

  const handleClearChanges = useCallback(async () => {
    if (!selectedDate || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      // Check if there's actually data to clear
      const currentMenuItem = menuData.find(
        (item) => item.date === selectedDate,
      );
      if (!currentMenuItem) {
        throw new Error("No data found for selected date");
      }

      const response = await fetch("/api/update-menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          updatedMenu: {
            date: selectedDate,
            lunch: { mainDish: "", sideDishes: [] },
            dinner: { mainDish: "", sideDishes: [] },
            dessert: { mainDish: "", sideDishes: [] },
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to clear data");
      }

      // Reset all related states atomically
      setEditValues({
        lunch: "",
        dinner: "",
        dessert: "",
        sideLunch: "",
        sideDinner: "",
      });
      setEditMode({
        lunch: false,
        dinner: false,
        dessert: false,
        sideLunch: false,
        sideDinner: false,
      });

      // Update schedule items
      const updatedItems = scheduleItems.map((item) =>
        item.date === selectedDate
          ? {
              ...item,
              lunch: { mainDish: "", sideDishes: [] },
              dinner: { mainDish: "", sideDishes: [] },
              dessert: { mainDish: "", sideDishes: [] },
            }
          : item,
      );
      setSelectedItems((prev) => ({ ...prev }));
    } catch (error) {
      console.error("Error clearing data:", error);
      setError(error instanceof Error ? error.message : "Failed to clear data");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, isLoading, menuData, scheduleItems]);

  const handleDateSelect = (date: Date) => {
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    selectDate(formattedDate);
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const [month, day] = dateStr.split("/");
      if (!month || !day || isNaN(parseInt(month)) || isNaN(parseInt(day))) {
        throw new Error("Invalid date format");
      }
      const date = new Date(
        new Date().getFullYear(),
        parseInt(month) - 1,
        parseInt(day),
      );
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return format(date, "M월 d일", { locale: ko });
    } catch (e) {
      const today = new Date();
      return format(today, "M월 d일", { locale: ko });
    }
  };

  const [initialList, setInitialList] = useState<ShoppingList | undefined>();

  useEffect(() => {
    const loadShoppingList = async () => {
      setIsShoppingListLoading(true);
      try {
        const response = await fetch("/api/shopping-list");
        if (!response.ok) throw new Error("Failed to load shopping list");
        const data = await response.json();
        setShoppingList(data);
      } catch (error) {
        console.error("Error loading shopping list:", error);
      } finally {
        setIsShoppingListLoading(false);
      }
    };

    if (activePanelIndex === 4) {
      loadShoppingList();
    }
  }, [activePanelIndex]);

  const handleShoppingListSave = async (list: ShoppingList) => {
    try {
      const response = await fetch("/api/shopping-list", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(list),
      });
      if (!response.ok) throw new Error("Failed to save shopping list");
      setShoppingList(list);
    } catch (error) {
      console.error("Error saving shopping list:", error);
    }
  };

  return (
    <div className="flex flex-row h-screen bg-white text-black overflow-hidden">
      {/* Calendar (Weekly/Monthly) */}
      {activePanelIndex === 1 && (
        <div className="flex-grow overflow-y-auto border-r border-[#989898]/20">
          <CalendarHeader
            title={
              activeView === "weekly"
                ? `${format(startOfWeek(currentWeek, { weekStartsOn: 0 }), "M월 d일", { locale: ko })} 주간 식단`
                : `${format(currentWeek, "yyyy")}`
            }
            onChangeView={() =>
              changeView(activeView === "weekly" ? "monthly" : "weekly")
            }
            buttonText={activeView === "weekly" ? "월간 보기" : "주간 보기"}
            showNavigation={activeView === "weekly"}
            onPrevious={navigateToPreviousWeek}
            onNext={navigateToNextWeek}
            onBasketClick={goToShoppingList}
            onSignalClick={goToStatsPanel}
            onPlusClick={goToSelectedItemPanel}
            currentWeek={currentWeek}
            setCurrentWeek={setCurrentWeek}
          />
          {activeView === "weekly" ? (
            <WeeklySchedulePanel
              scheduleItems={currentScheduleItems}
              onSelectDate={selectDate}
              currentWeek={currentWeek}
            />
          ) : (
            <MonthlyCalendarPanel year={2025} onSelectDate={selectDate} />
          )}
        </div>
      )}
      {/* Date Details */}
      {activePanelIndex === 2 && selectedDate && (
        <div className="flex-grow overflow-y-auto">
          <CalendarHeader
            title={formatDisplayDate(selectedDate)} // Updated to use consistent formatting
            onChangeView={goBackToCalendar}
            backButton={true}
            buttonText="달력으로"
            onBasketClick={goToShoppingList} // Add handler for Basket click
            onSignalClick={goToStatsPanel} // Add handler for Signal click
            onPlusClick={goToSelectedItemPanel} // Add handler for Plus click
            selectedDate={
              new Date(
                new Date().getFullYear(),
                parseInt(selectedDate.split("/")[0]) - 1,
                parseInt(selectedDate.split("/")[1]),
              )
            } // Pass selectedDate as Date object with current year
            onDateSelect={handleDateSelect}
          />
          <SelectedItemPanel
            title={formatDisplayDate(selectedDate)} // Updated to use consistent formatting
            menuItems={scheduleItems.filter(
              (item) => item.date === selectedDate,
            )}
            isActive={isActive} // Use isActive state
            editMode={editMode}
            editValues={editValues}
            onEditModeChange={handleEditModeChange}
            onEditValueChange={handleEditValueChange}
            onSave={handleSaveChanges}
            onClear={handleClearChanges}
            isLoading={isLoading}
            error={error}
          />
        </div>
      )}
      {/* Stats Panel */}
      {activePanelIndex === 3 && (
        <div className="flex-grow overflow-y-auto">
          <CalendarHeader
            title="통계"
            onChangeView={goBackToCalendar}
            backButton={true}
            buttonText="달력으로"
            onBasketClick={goToShoppingList} // Add handler for Basket click
            onSignalClick={goToStatsPanel} // Add handler for Signal click
            onPlusClick={goToSelectedItemPanel} // Add handler for Plus click
          />
          <StatsPanel stats={stats} />
        </div>
      )}
      {/* Shopping List */}
      {activePanelIndex === 4 && (
        <div className="flex-grow overflow-y-auto">
          <CalendarHeader
            title="장보기 목록"
            onChangeView={goBackToCalendar}
            backButton={true}
            buttonText="달력으로"
            onBasketClick={goToShoppingList}
            onSignalClick={goToStatsPanel}
            onPlusClick={goToSelectedItemPanel}
          />
          {isShoppingListLoading ? (
            <div className="p-4">Loading shopping list...</div>
          ) : (
            <ShoppingListPanel
              title="장보기 목록"
              onSave={handleShoppingListSave}
              initialList={shoppingList}
            />
          )}
        </div>
      )}
    </div>
  );
}
