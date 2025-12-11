import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Like from "@/models/Like";
import Product from "@/models/Product";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST - Dar like a un producto
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { id: productId } = await params;

    // Obtener userId del body o headers (en producción vendría de la sesión)
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Validar que el productId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: "ID de producto inválido" },
        { status: 400 }
      );
    }

    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Verificar si ya existe el like
    const existingLike = await Like.findOne({
      user: userId,
      product: productId,
    });

    if (existingLike) {
      return NextResponse.json(
        { success: false, error: "Ya has dado like a este producto" },
        { status: 400 }
      );
    }

    // Crear el like
    const like = await Like.create({
      user: userId,
      product: productId,
    });

    // Contar total de likes del producto
    const likesCount = await Like.countDocuments({ product: productId });

    return NextResponse.json(
      {
        success: true,
        message: "Like agregado exitosamente",
        data: {
          like,
          likesCount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al dar like:", error);

    // Error de duplicado (índice único)
    if ((error as { code?: number }).code === 11000) {
      return NextResponse.json(
        { success: false, error: "Ya has dado like a este producto" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Error al procesar el like" },
      { status: 500 }
    );
  }
}

// DELETE - Quitar like de un producto
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { id: productId } = await params;

    // Obtener userId del body
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Validar que el productId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: "ID de producto inválido" },
        { status: 400 }
      );
    }

    // Buscar y eliminar el like
    const deletedLike = await Like.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (!deletedLike) {
      return NextResponse.json(
        { success: false, error: "No has dado like a este producto" },
        { status: 404 }
      );
    }

    // Contar total de likes del producto
    const likesCount = await Like.countDocuments({ product: productId });

    return NextResponse.json({
      success: true,
      message: "Like eliminado exitosamente",
      data: {
        likesCount,
      },
    });
  } catch (error) {
    console.error("Error al quitar like:", error);
    return NextResponse.json(
      { success: false, error: "Error al quitar el like" },
      { status: 500 }
    );
  }
}

// GET - Obtener información de likes de un producto
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { id: productId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Validar que el productId sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: "ID de producto inválido" },
        { status: 400 }
      );
    }

    // Contar likes del producto
    const likesCount = await Like.countDocuments({ product: productId });

    // Verificar si el usuario actual dio like
    let userLiked = false;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const userLike = await Like.findOne({
        user: userId,
        product: productId,
      });
      userLiked = !!userLike;
    }

    return NextResponse.json({
      success: true,
      data: {
        likesCount,
        userLiked,
      },
    });
  } catch (error) {
    console.error("Error al obtener likes:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener información de likes" },
      { status: 500 }
    );
  }
}
