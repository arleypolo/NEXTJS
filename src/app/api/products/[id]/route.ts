import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models";
import { auth } from "@/lib/auth";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/products/[id] - Obtener un producto por ID
export async function GET(request: Request, { params }: Params) {
  try {
    await dbConnect();
    const { id } = await params;

    // Buscar por ID o por slug
    const product = await Product.findOne({
      $or: [
        { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
        { slug: id },
      ],
    }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener el producto" },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Actualizar un producto (requiere autenticación)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();

    // Verificar autenticación
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    // Buscar producto
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el usuario sea el dueño o admin
    const isOwner = product.createdBy.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "No tienes permiso para editar este producto" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, price, category, stock, image, featured, status } = body;

    // Actualizar campos
    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = price;
    if (category) product.category = category;
    if (stock !== undefined) product.stock = stock;
    if (image !== undefined) product.image = image || null;
    if (featured !== undefined) product.featured = featured;
    if (status) product.status = status;

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: product,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    if ((error as { name?: string }).name === "ValidationError") {
      const mongooseError = error as { errors: Record<string, { message: string }> };
      const messages = Object.values(mongooseError.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, error: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Error al actualizar el producto" },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id] - Eliminar un producto (requiere autenticación)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();

    // Verificar autenticación
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await params;

    // Buscar producto
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que el usuario sea el dueño o admin
    const isOwner = product.createdBy.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "No tienes permiso para eliminar este producto" },
        { status: 403 }
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Producto eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar el producto" },
      { status: 500 }
    );
  }
}
