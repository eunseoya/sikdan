import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    let body;

    // Safeguard against empty or malformed JSON input
    try {
      body = await request.json();
    } catch (error) {
      console.error("Error parsing JSON body:", error);
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 }
      );
    }

    // Validate request body
    if (!body || typeof body !== "object" || !body.date || !body.updatedMenu) {
      return NextResponse.json(
        { message: "Invalid request body. 'date' and 'updatedMenu' are required." },
        { status: 400 }
      );
    }

    const { date, updatedMenu } = body;

    const dataDir = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "menu.json");
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Initialize menu data
    let menuData = [];
    
    // Check if file exists and has content
    if (fs.existsSync(filePath)) {
      try {
        const fileContents = fs.readFileSync(filePath, "utf8");
        if (fileContents.trim()) { // Check if file is not empty
          menuData = JSON.parse(fileContents);
        }
      } catch (error) {
        console.error("Error reading or parsing menu.json:", error);
        // Continue with an empty array if there's an error
      }
    }

    // Ensure menuData is an array
    if (!Array.isArray(menuData)) {
      menuData = [];
    }

    // Check if the date exists
    const existingMenuIndex = menuData.findIndex(
      (item) => item.date === date
    );

    if (existingMenuIndex !== -1) {
      // Update existing menu
      menuData[existingMenuIndex] = updatedMenu;
    } else {
      // Add new menu
      menuData.push(updatedMenu);
    }

    // Write the updated menu back to the file
    fs.writeFileSync(filePath, JSON.stringify(menuData, null, 2));

    return NextResponse.json(
      { message: "Menu updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json(
      { message: "Failed to update menu", error: String(error) },
      { status: 500 }
    );
  }
}