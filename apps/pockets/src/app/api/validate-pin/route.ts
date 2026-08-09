import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();

    if (!pin || typeof pin !== "string") {
      return NextResponse.json(
        { error: "PIN is required and must be a string" },
        { status: 400 },
      );
    }

    const correctPin = process.env.NEXT_LOGIN_PIN;

    if (!correctPin) {
      console.error("NEXT_LOGIN_PIN environment variable is not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const isValid = pin === correctPin;

    return NextResponse.json({
      valid: isValid,
      message: isValid ? "PIN is valid" : "Invalid PIN",
    });
  } catch (error) {
    console.error("Error validating PIN:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
