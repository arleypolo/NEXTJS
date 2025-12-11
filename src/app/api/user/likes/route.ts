import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Like from "@/models/Like";
import mongoose from "mongoose";

// GET - Obtener todos los likes de un usuario
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Obtener likes con información del producto
    const likes = await Like.find({ user: userId })
      .populate("product", "name slug image price category status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Like.countDocuments({ user: userId });

    return NextResponse.json({
      success: true,
      data: {
        likes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener likes del usuario:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener los likes" },
      { status: 500 }
    );
  }
}
