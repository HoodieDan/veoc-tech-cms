import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";



// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;



export async function GET(req: NextRequest, { params }: { params: Promise<{ password: string }> }) {
  const plainPassword = (await params).password;
  

  if (!plainPassword) {
    return NextResponse.json(
      { message: "Password parameter is missing in the URL." },
      { status: 400 }
    );
  }

  try {
    // Decode URL-encoded password parameter
    const decodedPassword = decodeURIComponent(plainPassword);

    console.log(`Generating hash for password (length: ${decodedPassword.length})`); // Avoid logging the actual password

    // Generate hash
    const hashedPassword = await bcrypt.hash(decodedPassword, SALT_ROUNDS);

    // Return the generated hash
    return NextResponse.json(
      {
        plainPasswordProvided: `(length: ${decodedPassword.length})`, // Indicate input was received without showing it
        hashedPassword: hashedPassword,
        saltRounds: SALT_ROUNDS,
        instructions: "Copy the hashedPassword and update the ADMIN_PASSWORD_HASH environment variable in your hosting service.",
        securityWarning: "This endpoint is insecure. Do not expose it publicly in production. Use it only for generating the initial hash or during development."
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Password hashing error:", error);
    return NextResponse.json(
      { message: "Failed to hash password." },
      { status: 500 }
    );
  }
}
