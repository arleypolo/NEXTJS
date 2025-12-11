import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Product } from "@/models";
import { auth } from "@/lib/auth";

// GET /api/products - Obtener todos los productos
export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    // Construir query
    const query: Record<string, unknown> = {};
    
    if (category) {
      query.category = category;
    }
    
    if (featured === "true") {
      query.featured = true;
    }
    
    if (status) {
      query.status = status;
    }

    // Ejecutar query con paginación
    const skip = (page - 1) * limit;
    
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

// POST /api/products - Crear nuevo producto (requiere autenticación)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, description, price, category, stock, image, featured, status } = body;

    // Validaciones básicas
    if (!name || !description || price === undefined || !category) {
      return NextResponse.json(
        { success: false, error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Crear producto
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image: image || null,
      featured: featured || false,
      status: status || "available",
      createdBy: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Producto creado exitosamente",
        data: product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);

    // Error de validación de Mongoose
    if ((error as { name?: string }).name === "ValidationError") {
      const mongooseError = error as { errors: Record<string, { message: string }> };
      const messages = Object.values(mongooseError.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, error: messages.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
