import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/models/Cart";
import Product from "@/models/Product";
import mongoose from "mongoose";

// GET - Obtener carrito del usuario
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

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

    // Buscar carrito activo del usuario
    let cart = await Cart.findOne({ user: userId, status: "active" }).populate(
      "items.product",
      "name slug image price stock status"
    );

    // Si no existe, crear uno vacío
    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
        status: "active",
      });
    }

    return NextResponse.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener el carrito" },
      { status: 500 }
    );
  }
}

// POST - Agregar/Actualizar items en el carrito
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, productId, quantity = 1 } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "El ID del producto es requerido" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { success: false, error: "ID de producto inválido" },
        { status: 400 }
      );
    }

    // Verificar que el producto existe y está disponible
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    if (product.status !== "available") {
      return NextResponse.json(
        { success: false, error: "El producto no está disponible" },
        { status: 400 }
      );
    }

    if (quantity > product.stock) {
      return NextResponse.json(
        {
          success: false,
          error: `Solo hay ${product.stock} unidades disponibles`,
        },
        { status: 400 }
      );
    }

    // Buscar o crear carrito activo
    let cart = await Cart.findOne({ user: userId, status: "active" });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        status: "active",
      });
    }

    // Buscar si el producto ya está en el carrito
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Actualizar cantidad
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return NextResponse.json(
          {
            success: false,
            error: `Solo hay ${product.stock} unidades disponibles`,
          },
          { status: 400 }
        );
      }
      cart.items[itemIndex].quantity = newQuantity;
      cart.items[itemIndex].price = product.price; // Actualizar precio
    } else {
      // Agregar nuevo item
      cart.items.push({
        product: new mongoose.Types.ObjectId(productId),
        quantity,
        price: product.price,
      });
    }

    await cart.save();

    // Populate para la respuesta
    await cart.populate("items.product", "name slug image price stock status");

    return NextResponse.json(
      {
        success: true,
        message: "Producto agregado al carrito",
        data: cart,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    return NextResponse.json(
      { success: false, error: "Error al agregar al carrito" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar cantidad de un item o reemplazar todo el carrito
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, productId, quantity, items } = body;

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

    let cart = await Cart.findOne({ user: userId, status: "active" });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Carrito no encontrado" },
        { status: 404 }
      );
    }

    // Si se envía un array de items, reemplazar todo el carrito
    if (items && Array.isArray(items)) {
      // Validar y procesar cada item
      const processedItems = [];

      for (const item of items) {
        if (
          !item.productId ||
          !mongoose.Types.ObjectId.isValid(item.productId)
        ) {
          continue;
        }

        const product = await Product.findById(item.productId);
        if (!product || product.status !== "available") {
          continue;
        }

        const qty = Math.min(item.quantity || 1, product.stock);
        if (qty > 0) {
          processedItems.push({
            product: new mongoose.Types.ObjectId(item.productId),
            quantity: qty,
            price: product.price,
          });
        }
      }

      cart.items = processedItems;
    }
    // Si se envía productId y quantity, actualizar solo ese item
    else if (productId && typeof quantity === "number") {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json(
          { success: false, error: "ID de producto inválido" },
          { status: 400 }
        );
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        return NextResponse.json(
          { success: false, error: "Producto no está en el carrito" },
          { status: 404 }
        );
      }

      if (quantity <= 0) {
        // Eliminar item
        cart.items.splice(itemIndex, 1);
      } else {
        // Verificar stock
        const product = await Product.findById(productId);
        if (product && quantity > product.stock) {
          return NextResponse.json(
            {
              success: false,
              error: `Solo hay ${product.stock} unidades disponibles`,
            },
            { status: 400 }
          );
        }
        cart.items[itemIndex].quantity = quantity;
        if (product) {
          cart.items[itemIndex].price = product.price;
        }
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Datos inválidos para actualizar" },
        { status: 400 }
      );
    }

    await cart.save();
    await cart.populate("items.product", "name slug image price stock status");

    return NextResponse.json({
      success: true,
      message: "Carrito actualizado",
      data: cart,
    });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar el carrito" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar item del carrito o vaciar carrito
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { userId, productId, clearAll = false } = body;

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

    const cart = await Cart.findOne({ user: userId, status: "active" });

    if (!cart) {
      return NextResponse.json(
        { success: false, error: "Carrito no encontrado" },
        { status: 404 }
      );
    }

    if (clearAll) {
      // Vaciar todo el carrito
      cart.items = [];
    } else if (productId) {
      // Eliminar un producto específico
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json(
          { success: false, error: "ID de producto inválido" },
          { status: 400 }
        );
      }

      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex === -1) {
        return NextResponse.json(
          { success: false, error: "Producto no está en el carrito" },
          { status: 404 }
        );
      }

      cart.items.splice(itemIndex, 1);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Especifica productId o clearAll para eliminar",
        },
        { status: 400 }
      );
    }

    await cart.save();
    await cart.populate("items.product", "name slug image price stock status");

    return NextResponse.json({
      success: true,
      message: clearAll ? "Carrito vaciado" : "Producto eliminado del carrito",
      data: cart,
    });
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar del carrito" },
      { status: 500 }
    );
  }
}
