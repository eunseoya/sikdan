"use client";
import { Plus, Trash2, Check, Loader2, X, Share } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import type { ShoppingList, ShoppingListItem } from "@/types";
import { onShare } from "@/hooks/utils";
interface ShoppingListPanelProps {
  title: string;
  onSave: (list: ShoppingList) => void;
  initialList?: ShoppingList;
}

export function ShoppingListPanel({
  title,
  onSave,
  initialList = { stores: [] },
}: ShoppingListPanelProps) {
  const [list, setList] = useState<ShoppingList>(initialList);
  const [newStore, setNewStore] = useState("");
  const [newItems, setNewItems] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [showStoreInput, setShowStoreInput] = useState(false);
  <Plus className="w-4 h-4" />;
  const [isComposing, setIsComposing] = useState(false);

  // Debounce function to prevent too many save calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Create a debounced save function
  const debouncedSave = useCallback(
    debounce((data: ShoppingList) => {
      setSaveStatus("saving");
      onSave(data);
      setTimeout(() => {
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 1500);
      }, 500);
    }, 500),
    [onSave],
  );

  // Auto-save when list changes
  useEffect(() => {
    // Skip initial render to avoid redundant API call
    const isInitialRender =
      JSON.stringify(list) === JSON.stringify(initialList);
    if (!isInitialRender) {
      debouncedSave(list);
    }
  }, [list, initialList, debouncedSave]);

  const handleAddStore = () => {
    if (!newStore.trim()) return;
    setList((prev) => ({
      stores: [
        ...prev.stores,
        { id: crypto.randomUUID(), store: newStore, items: [] },
      ],
    }));
    setNewStore("");
    setShowStoreInput(false); // Hide input after adding
  };

  const cancelAddStore = () => {
    setNewStore("");
    setShowStoreInput(false);
  };

  const addItem = (storeId: string) => {
    const item = newItems[storeId];
    if (!item?.trim() || isComposing) return; // Don't add if still composing

    setList((prev) => ({
      stores: prev.stores.map((store) =>
        store.id === storeId
          ? { ...store, items: [...store.items, item] }
          : store,
      ),
    }));
    setNewItems((prev) => ({ ...prev, [storeId]: "" }));
  };

  const removeStore = (storeId: string) => {
    setList((prev) => ({
      stores: prev.stores.filter((store) => store.id !== storeId),
    }));
  };

  const removeItem = (storeId: string, itemIndex: number) => {
    setList((prev) => ({
      stores: prev.stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              items: store.items.filter((_, idx) => idx !== itemIndex),
            }
          : store,
      ),
    }));
  };

  return (
    <div id="all" className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={() => onShare("all")}
            className="flex items-center text-[#989898] hover:text-[#000000] transition-colors"
          >
            <Share size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Save status indicator */}
          {saveStatus !== "idle" && (
            <span
              className={`text-sm flex items-center ${saveStatus === "saving" ? "text-yellow-600" : "text-green-600"}`}
            >
              {saveStatus === "saving" ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-1" />
                  저장 중...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  저장됨
                </>
              )}
            </span>
          )}

          {/* Add Store button */}
          {!showStoreInput && (
            <button
              onClick={() => setShowStoreInput(true)}
              className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <Plus className="w-4 h-4" />새 마트
            </button>
          )}
        </div>
      </div>

      {/* Conditional Store Input */}
      {showStoreInput && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={newStore}
            onChange={(e) => setNewStore(e.target.value)}
            placeholder="마트 이름"
            className="px-3 py-2 border rounded-md flex-1 bg-white"
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newStore.trim() && !isComposing) {
                handleAddStore();
              } else if (e.key === "Escape") {
                cancelAddStore();
              }
            }}
            autoFocus
          />
          <button
            onClick={handleAddStore}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={cancelAddStore}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="space-y-4">
        {list.stores.map((store) => (
          <div
            id={store.store}
            key={store.id}
            className="border rounded-md p-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-800">{store.store}</h3>
                <button
                  onClick={() => onShare(store.store)}
                  className="flex items-center text-[#989898] hover:text-[#000000] transition-colors"
                >
                  <Share size={18} />
                </button>
              </div>
              <button
                onClick={() => removeStore(store.id)}
                className="p-1 hover:bg-red-100 rounded-md"
                aria-label="Remove store"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            <ul className="space-y-2 mb-3">
              {store.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 group">
                  <div className="flex items-center flex-1 p-2 hover:bg-gray-50 rounded-md">
                    <input
                      type="checkbox"
                      id={`item-${store.id}-${idx}`}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                    />
                    <label
                      htmlFor={`item-${store.id}-${idx}`}
                      className="ml-2 flex-1 text-gray-700"
                    >
                      {item}
                    </label>
                  </div>
                  <button
                    onClick={() => removeItem(store.id, idx)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded-md transition-opacity"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newItems[store.id] || ""}
                onChange={(e) =>
                  setNewItems((prev) => ({
                    ...prev,
                    [store.id]: e.target.value,
                  }))
                }
                placeholder="재료"
                className="px-3 py-2 border rounded-md flex-1 bg-white text-sm"
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => {
                  setIsComposing(false);
                  // Optionally handle submission after composition ends
                  if (newItems[store.id]?.trim()) {
                    // Adding a small delay helps ensure the value is fully composed
                    setTimeout(() => addItem(store.id), 10);
                  }
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    newItems[store.id]?.trim() &&
                    !isComposing
                  ) {
                    addItem(store.id);
                  }
                }}
              />
              <button
                onClick={() => !isComposing && addItem(store.id)}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Empty state when no stores exist */}
        {list.stores.length === 0 && !showStoreInput && (
          <div className="text-center py-8 text-gray-500">
            마트를 추가해서 쇼핑 목록을 만들어보세요
          </div>
        )}
      </div>
    </div>
  );
}
