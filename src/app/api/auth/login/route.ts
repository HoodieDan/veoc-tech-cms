// /app/api/auth/login.ts
import { NextRequest, NextResponse } from "next/server";
// Consider using bcryptjs if you had issues with bcrypt, otherwise stick to bcrypt
import bcrypt from "bcryptjs"; // Or import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Import jsonwebtoken

export async function POST(req: NextRequest) {
  try {
    // --- Only get password from request body ---
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    // --- Retrieve Stored Hash and JWT Secret ---
    const storedHash = process.env.ADMIN_PASSWORD_HASH;
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "20d"; // Default expiration

    // Check if required environment variables are set
    if (!storedHash || !jwtSecret) {
      console.error(
        "ADMIN_PASSWORD_HASH or JWT_SECRET environment variable is not set."
      );
      return NextResponse.json(
        { message: "Login configuration error." }, // Keep error generic
        { status: 500 }
      );
    }

    // --- Compare Password ---
    const isMatch = await bcrypt.compare(password, storedHash);

    if (!isMatch) {
      // Keep logging minimal for security, avoid indicating *why* it failed
      console.log("Login attempt failed (Invalid Credentials)");
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 } // Unauthorized
      );
    }

    // --- Login Successful - Generate JWT ---
    console.log(`Login successful`); // Removed email reference

    const payload = {
      role: "admin",
    };

    // Sign the token
    const token = jwt.sign(payload, jwtSecret as jwt.Secret);

    // Return the token
    return NextResponse.json(
      {
        message: "Login successful",
        token: token, // Include the token in the response
        expiresIn: expiresIn, // Optionally inform the client about expiration
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API error:", error);
    // Handle specific JWT errors
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: "Error generating session token." },
        { status: 500 }
      );
    }
    // Generic fallback error
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
