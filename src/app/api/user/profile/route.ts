import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/models";
import { cookies } from "next/headers";

// GET /api/user/profile - Obtener perfil del usuario actual
export async function GET() {
  try {
    await dbConnect();

    // Por ahora, simular obtener el usuario del token/sesión
    // Más adelante se integrará con NextAuth
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener perfil" },
      { status: 500 }
    );
  }
}
