import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";



let styles = "h-screen"

export async function GET(request: Request) {
    return NextResponse.json({ styles: styles });
}

export async function POST(request: Request){
    const res = await request.json();
    styles = res.styles
    const cssContent = `
.bg-red-500{
    background: red;
}
`;
    fs.writeFile("src/app/styles.css", cssContent, (err) => {
        if (err) {
          console.error('Error creating CSS file:', err);
        } else {
          console.log('CSS file created successfully!');
        }
      });
    return NextResponse.json({ styles: styles });
}