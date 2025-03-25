"use client";

interface SelectedItemPanelProps {
  title: string;
  menuItems: ScheduleItems[];
  isActive: boolean;
  editMode: EditModeState;
  editValues: EditValuesState;
  onEditModeChange: (type: string, value: boolean) => void;
  onEditValueChange: (field: string, value: string) => void;
  onSave: () => void;
  onClear: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function SelectedItemPanel({
  title,
  menuItems,
  isActive,
  editMode,
  editValues,
  onEditModeChange,
  onEditValueChange,
  onSave,
  onClear,
  isLoading = false,
  error = null,
}: SelectedItemPanelProps) {
  const activeColor = "text-[#3b82f6]";
  const inactiveColor = "text-gray-500";
  const placeholderColor = "text-gray-400";

  const getTextColor = (hasValue: boolean) => {
    if (!isActive) return inactiveColor;
    return hasValue ? activeColor : placeholderColor;
  };

  const handleMainDishClick = (meal: string) => {
    if (!isActive) return;
    onEditModeChange(meal, true);

    const hasLunchMain = Boolean(menuItems[0]?.lunch?.mainDish);
    const hasLunchSides = Boolean(
      menuItems[0]?.lunch?.sideDishes &&
        menuItems[0]?.lunch?.sideDishes.length > 0,
    );
    const hasDinnerMain = Boolean(menuItems[0]?.dinner?.mainDish);
    const hasDinnerSides = Boolean(
      menuItems[0]?.dinner?.sideDishes &&
        menuItems[0]?.dinner?.sideDishes.length > 0,
    );
    const hasDessertMain = Boolean(menuItems[0]?.dessert?.mainDish);

    // Pre-fill the input with existing data
    let existingValue =
      meal === "lunch"
        ? menuItems[0]?.lunch?.mainDish
        : meal === "dinner"
          ? menuItems[0]?.dinner?.mainDish
          : menuItems[0]?.dessert?.mainDish;

    // Always call onEditValueChange, even with an empty string
    onEditValueChange(meal, existingValue || "");
  };

  const handleSideDishClick = (meal: string) => {
    if (!isActive) return;
    const type = `side${meal.charAt(0).toUpperCase() + meal.slice(1)}`;
    onEditModeChange(type, true);

    // Pre-fill the input with existing side dishes
    const existingSides =
      meal === "lunch"
        ? (menuItems[0]?.lunch?.sideDishes || []).join(", ")
        : (menuItems[0]?.dinner?.sideDishes || []).join(", ");

    // Always call onEditValueChange, even with an empty string
    onEditValueChange(type, existingSides || "");
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: string) => {
    if (e.key === "Enter") {
      onEditModeChange(type, false);
      onSave();
    }
  };

  let lunchValue = editValues.lunch || menuItems[0]?.lunch?.mainDish;
  if (lunchValue === "") {
    lunchValue = "메인";
  }
  let dinnerValue =
    editValues.dinner || menuItems[0]?.dinner?.mainDish || "메인";
  if (dinnerValue === " ") {
    console.log("dinnerValue is empty");
    dinnerValue = "메인";
  }
  let dessertValue =
    editValues.dessert || menuItems[0]?.dessert?.mainDish || "특식/후식";

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-medium">{title}</div>
        {isActive && (
          <div className="flex items-center gap-2">
            {error && <span className="text-sm text-red-500">{error}</span>}
            <button
              onClick={onClear}
              disabled={isLoading}
              className={`text-sm text-red-500 hover:text-red-700 px-2 py-1 rounded border border-red-500 hover:border-red-700 disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? "animate-pulse" : ""}`}
            >
              {isLoading ? "삭제중..." : "Clear All"}
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between mb-2 mt-4">
        <div className={`text-xl font-medium flex items-center`}>중식</div>
      </div>
      <div className="ml-2">
        {editMode.lunch && isActive ? (
          <input
            className="text-xl border-b border-blue-500 w-full outline-none"
            value={editValues.lunch}
            onChange={(e) => onEditValueChange("lunch", e.target.value)}
            onBlur={() => {
              console.log(title, lunchValue);
              onEditModeChange("lunch", false);
              onSave();
            }}
            onKeyPress={(e) => handleKeyPress(e, "lunch")}
            autoFocus
          />
        ) : (
          <div
            className={`text-xl ${getTextColor(Boolean(menuItems[0]?.lunch?.mainDish))} ${isActive ? "cursor-pointer hover:text-blue-700" : ""}`}
            onClick={() => handleMainDishClick("lunch")}
          >
            {editValues.lunch || menuItems[0]?.lunch?.mainDish || "메인"}
          </div>
        )}

        {editMode.sideLunch && isActive ? (
          <input
            className="text-sm border-b border-blue-500 w-full outline-none"
            value={editValues.sideLunch}
            onChange={(e) => onEditValueChange("sideLunch", e.target.value)}
            onBlur={() => {
              onEditModeChange("sideLunch", false);
              onSave();
            }}
            onKeyPress={(e) => handleKeyPress(e, "sideLunch")}
            autoFocus
          />
        ) : (
          <div
            className={`text-sm ${getTextColor(Boolean(menuItems[0]?.lunch?.sideDishes?.length))} ${isActive ? "cursor-pointer hover:text-blue-700" : ""}`}
            onClick={() => handleSideDishClick("lunch")}
          >
            {editValues.sideLunch ||
              (menuItems[0]?.lunch?.sideDishes || []).join(", ") ||
              "반찬1, 반찬2"}
          </div>
        )}
      </div>

      {/* Similar pattern for dinner section */}
      <div className="flex items-center justify-between mb-2 mt-4">
        <div className={`text-xl font-medium flex items-center`}>석식</div>
      </div>
      <div className="ml-2">
        {editMode.dinner && isActive ? (
          <input
            className="text-xl border-b border-blue-500 w-full outline-none"
            value={editValues.dinner}
            onChange={(e) => onEditValueChange("dinner", e.target.value)}
            onBlur={() => {
              onEditModeChange("dinner", false);
              onSave();
            }}
            onKeyPress={(e) => handleKeyPress(e, "dinner")}
            autoFocus
          />
        ) : (
          <div
            className={`text-xl ${getTextColor(Boolean(menuItems[0]?.dinner?.mainDish))} ${isActive ? "cursor-pointer hover:text-blue-700" : ""}`}
            onClick={() => handleMainDishClick("dinner")}
          >
            {dinnerValue}
          </div>
        )}

        {editMode.sideDinner && isActive ? (
          <input
            className="text-sm border-b border-blue-500 w-full outline-none"
            value={editValues.sideDinner}
            onChange={(e) => onEditValueChange("sideDinner", e.target.value)}
            onBlur={() => {
              onEditModeChange("sideDinner", false);
              onSave();
            }}
            onKeyPress={(e) => handleKeyPress(e, "sideDinner")}
            autoFocus
          />
        ) : (
          <div
            className={`text-sm ${getTextColor(Boolean(menuItems[0]?.dinner?.sideDishes?.length))} ${isActive ? "cursor-pointer hover:text-blue-700" : ""}`}
            onClick={() => handleSideDishClick("dinner")}
          >
            {editValues.sideDinner ||
              (menuItems[0]?.dinner?.sideDishes || []).join(", ") ||
              "반찬1, 반찬2"}
          </div>
        )}
      </div>

      {/* Similar pattern for dessert section */}
      <div className="flex items-center justify-between mb-2 mt-4">
        <div className={`text-xl font-medium flex items-center`}>간식</div>
      </div>
      <div className="ml-2">
        {editMode.dessert && isActive ? (
          <input
            className="text-xl border-b border-blue-500 w-full outline-none"
            value={editValues.dessert}
            onChange={(e) => onEditValueChange("dessert", e.target.value)}
            onBlur={() => {
              onEditModeChange("dessert", false);
              onSave();
            }}
            onKeyPress={(e) => handleKeyPress(e, "dessert")}
            autoFocus
          />
        ) : (
          <div
            className={`text-xl ${getTextColor(Boolean(menuItems[0]?.dessert?.mainDish))} ${isActive ? "cursor-pointer hover:text-blue-700" : ""}`}
            onClick={() => handleMainDishClick("dessert")}
          >
            {editValues.dessert ||
              menuItems[0]?.dessert?.mainDish ||
              "특식/후식"}
          </div>
        )}
      </div>
    </div>
  );
}
