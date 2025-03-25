import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { date, updatedMenu } = body;

  const filePath = path.join(process.cwd(), "data", "menu.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const menuData = JSON.parse(fileContents);

  // Check if the date exists
  const existingMenuIndex = menuData.findIndex(
    (item: any) => item.date === date,
  );

  if (existingMenuIndex !== -1) {
    // Update existing menu
    menuData[existingMenuIndex] = updatedMenu;
  } else {
    // Add new menu쳑
    menuData.push(updatedMenu);
  }

  fs.writeFileSync(filePath, JSON.stringify(menuData, null, 2));

  return NextResponse.json(
    { message: "Menu updated successfully" },
    { status: 200 },
  );
}
