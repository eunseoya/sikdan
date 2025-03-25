import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Define the ShoppingList type matching your component
export type ShoppingListItem = {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
};

export type ShoppingList = ShoppingListItem[];

// Path to store shopping list data
const dataFilePath = path.join(process.cwd(), "data", "shopping-list.json");

// GET handler for shopping list
export async function GET() {
  try {
    // Check if file exists, if not return empty array
    if (!fs.existsSync(dataFilePath)) {
      return NextResponse.json([], { status: 200 });
    }

    const data = fs.readFileSync(dataFilePath, "utf8");
    const shoppingList = JSON.parse(data);
    return NextResponse.json(shoppingList, { status: 200 });
  } catch (error) {
    console.error("Error reading shopping list:", error);
    return NextResponse.json(
      { error: "Failed to load shopping list" },
      { status: 500 },
    );
  }
}

// PUT handler to update shopping list
export async function PUT(request: Request) {
  try {
    const shoppingList: ShoppingList = await request.json();

    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write the updated list to file
    fs.writeFileSync(dataFilePath, JSON.stringify(shoppingList, null, 2));
    return NextResponse.json(shoppingList, { status: 200 });
  } catch (error) {
    console.error("Error saving shopping list:", error);
    return NextResponse.json(
      { error: "Failed to save shopping list" },
      { status: 500 },
    );
  }
}
