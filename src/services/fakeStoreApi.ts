                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    // Tipos para FakeStoreAPI
export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Producto normalizado para nuestra app
export interface NormalizedProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  status: "available" | "unavailable";
}

// Datos para crear/actualizar producto
export interface ProductInput {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

const BASE_URL = "https://fakestoreapi.com";

// Normalizar producto de FakeStoreAPI a nuestro formato
function normalizeProduct(product: FakeStoreProduct): NormalizedProduct {
  return {
    id: product.id.toString(),
    name: product.title,
    price: product.price,
    description: product.description,
    category: product.category,
    image: product.image,
    images: [product.image],
    rating: product.rating?.rate || 0,
    reviewCount: product.rating?.count || 0,
    stock: Math.floor(Math.random() * 50) + 10,
    status: "available",
  };
}

// ========== OPERACIONES CRUD ==========

// Obtener todos los productos
export async function getProducts(options?: {
  limit?: number;
  category?: string;
  sort?: "asc" | "desc";
}): Promise<{ products: NormalizedProduct[]; total: number }> {
  try {
    let url = `${BASE_URL}/products`;

    if (options?.category) {
      url = `${BASE_URL}/products/category/${encodeURIComponent(options.category)}`;
    }

    const params = new URLSearchParams();
    if (options?.limit) {
      params.set("limit", options.limit.toString());
    }
    if (options?.sort) {
      params.set("sort", options.sort);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const res = await fetch(url, { 
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error fetching products");
    }

    const products: FakeStoreProduct[] = await res.json();

    return {
      products: products.map(normalizeProduct),
      total: products.length,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { products: [], total: 0 };
  }
}

// Obtener un producto por ID
export async function getProductById(id: string): Promise<NormalizedProduct | null> {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const product: FakeStoreProduct = await res.json();
    return normalizeProduct(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Crear un nuevo producto
export async function createProduct(input: ProductInput): Promise<NormalizedProduct | null> {
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Error creating product");
    }

    const data = await res.json();
    
    return {
      id: data.id?.toString() || Date.now().toString(),
      name: input.title,
      price: input.price,
      description: input.description,
      category: input.category,
      image: input.image,
      images: [input.image],
      rating: 0,
      reviewCount: 0,
      stock: 50,
      status: "available",
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
}

// Actualizar un producto
export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<NormalizedProduct | null> {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Error updating product");
    }

    const data: FakeStoreProduct = await res.json();
    return normalizeProduct(data);
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
}

// Eliminar un producto
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting product");
    }

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

// ========== CATEGORÍAS ==========

// Obtener todas las categorías
export async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/products/categories`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error("Error fetching categories");
    }

    const categories: string[] = await res.json();
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

// Obtener productos por categoría
export async function getProductsByCategory(
  category: string,
  limit?: number
): Promise<NormalizedProduct[]> {
  const { products } = await getProducts({ category, limit });
  return products;
}

// ========== UTILIDADES ==========

// Buscar productos
export async function searchProducts(query: string): Promise<NormalizedProduct[]> {
  const { products } = await getProducts();
  const lowerQuery = query.toLowerCase();

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
  );
}

// Obtener productos destacados
export async function getFeaturedProducts(limit = 4): Promise<NormalizedProduct[]> {
  const { products } = await getProducts();

  return products.sort((a, b) => b.rating - a.rating).slice(0, limit);
}

// Obtener productos relacionados
export async function getRelatedProducts(
  productId: string,
  limit = 4
): Promise<NormalizedProduct[]> {
  const product = await getProductById(productId);

  if (!product) {
    return [];
  }

  const { products } = await getProducts({ category: product.category });

  return products.filter((p) => p.id !== productId).slice(0, limit);
}

// ========== USUARIOS ==========

// Tipo para usuario de FakeStoreAPI
export interface FakeStoreUser {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address: {
    geolocation: {
      lat: string;
      long: string;
    };
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
  phone: string;
}

// Usuario normalizado para nuestra app
export interface NormalizedUser {
  id: string;
  email: string;
  username: string;
  name: string;
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
  role: "admin" | "user";
}

// Normalizar usuario
function normalizeUser(user: FakeStoreUser): NormalizedUser {
  return {
    id: user.id.toString(),
    email: user.email,
    username: user.username,
    name: `${user.name.firstname} ${user.name.lastname}`,
    firstname: user.name.firstname,
    lastname: user.name.lastname,
    phone: user.phone,
    address: `${user.address.street} ${user.address.number}, ${user.address.city} ${user.address.zipcode}`,
    role: user.id === 1 ? "admin" : "user",
  };
}

// Obtener todos los usuarios
export async function getUsers(): Promise<NormalizedUser[]> {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error fetching users");
    }

    const users: FakeStoreUser[] = await res.json();
    return users.map(normalizeUser);
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Obtener usuario por ID
export async function getUserById(id: string): Promise<NormalizedUser | null> {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    const user: FakeStoreUser = await res.json();
    return normalizeUser(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Obtener usuario por username
export async function getUserByUsername(username: string): Promise<NormalizedUser | null> {
  try {
    const users = await getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return null;
  }
}

// Login - autenticar usuario
export async function loginUser(username: string, password: string): Promise<{ token: string } | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return { token: data.token };
  } catch (error) {
    console.error("Error logging in:", error);
    return null;
  }
}

// Datos para crear usuario
export interface UserInput {
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  address?: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation?: {
      lat: string;
      long: string;
    };
  };
  phone?: string;
}

// Crear usuario (registro)
export async function createUser(input: UserInput): Promise<NormalizedUser | null> {
  try {
    const res = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Error creating user");
    }

    const data = await res.json();
    
    // FakeStoreAPI devuelve solo el ID del usuario creado
    return {
      id: data.id?.toString() || Date.now().toString(),
      email: input.email,
      username: input.username,
      name: `${input.name.firstname} ${input.name.lastname}`,
      firstname: input.name.firstname,
      lastname: input.name.lastname,
      phone: input.phone || "",
      address: input.address 
        ? `${input.address.street} ${input.address.number}, ${input.address.city} ${input.address.zipcode}`
        : "",
      role: "user",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

// Actualizar usuario
export async function updateUser(id: string, input: Partial<UserInput>): Promise<NormalizedUser | null> {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Error updating user");
    }

    const data: FakeStoreUser = await res.json();
    return normalizeUser(data);
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
}

// Eliminar usuario
export async function deleteUser(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting user");
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
}

// ========== CARRITOS ==========

// Tipo para carrito de FakeStoreAPI
export interface FakeStoreCart {
  id: number;
  userId: number;
  date: string;
  products: Array<{
    productId: number;
    quantity: number;
  }>;
}

// Tipo para carrito normalizado con detalles de producto
export interface CartItemWithDetails {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface NormalizedCart {
  id: string;
  userId: string;
  date: string;
  products: CartItemWithDetails[];
  total: number;
}

// Obtener carritos de un usuario
export async function getUserCarts(userId: string): Promise<FakeStoreCart[]> {
  try {
    const res = await fetch(`${BASE_URL}/carts/user/${userId}`, {
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error fetching user carts");
    }

    const carts: FakeStoreCart[] = await res.json();
    return carts;
  } catch (error) {
    console.error("Error fetching user carts:", error);
    return [];
  }
}

// Obtener un carrito por ID
export async function getCartById(cartId: string): Promise<FakeStoreCart | null> {
  try {
    const res = await fetch(`${BASE_URL}/carts/${cartId}`, {
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const cart: FakeStoreCart = await res.json();
    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

// Obtener carrito con detalles de productos
export async function getCartWithDetails(cartId: string): Promise<NormalizedCart | null> {
  try {
    const cart = await getCartById(cartId);
    if (!cart) return null;

    // Obtener detalles de cada producto
    const productsWithDetails = await Promise.all(
      cart.products.map(async (item) => {
        const product = await getProductById(item.productId.toString());
        return {
          productId: item.productId.toString(),
          name: product?.name || "Producto no encontrado",
          price: product?.price || 0,
          quantity: item.quantity,
          image: product?.image || "/images/placeholder.svg",
        };
      })
    );

    const total = productsWithDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return {
      id: cart.id.toString(),
      userId: cart.userId.toString(),
      date: cart.date,
      products: productsWithDetails,
      total,
    };
  } catch (error) {
    console.error("Error fetching cart with details:", error);
    return null;
  }
}

// Input para crear carrito
export interface CartInput {
  userId: number;
  date: string;
  products: Array<{
    productId: number;
    quantity: number;
  }>;
}

// Crear un nuevo carrito (enviar carrito al servidor)
export async function createCart(input: CartInput): Promise<{ id: number; success: boolean }> {
  try {
    const res = await fetch(`${BASE_URL}/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Error creating cart");
    }

    const data = await res.json();
    
    return {
      id: data.id || Date.now(),
      success: true,
    };
  } catch (error) {
    console.error("Error creating cart:", error);
    return {
      id: 0,
      success: false,
    };
  }
}

// Actualizar un carrito existente
export async function updateCart(
  cartId: string,
  products: Array<{ productId: number; quantity: number }>
): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/carts/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: new Date().toISOString().split("T")[0],
        products,
      }),
    });

    if (!res.ok) {
      throw new Error("Error updating cart");
    }

    return true;
  } catch (error) {
    console.error("Error updating cart:", error);
    return false;
  }
}

// Eliminar un carrito
export async function deleteCart(cartId: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/carts/${cartId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Error deleting cart");
    }

    return true;
  } catch (error) {
    console.error("Error deleting cart:", error);
    return false;
  }
}

// Obtener todos los carritos (para admin)
export async function getAllCarts(options?: {
  limit?: number;
  sort?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}): Promise<FakeStoreCart[]> {
  try {
    let url = `${BASE_URL}/carts`;

    const params = new URLSearchParams();
    if (options?.limit) {
      params.set("limit", options.limit.toString());
    }
    if (options?.sort) {
      params.set("sort", options.sort);
    }
    if (options?.startDate) {
      params.set("startdate", options.startDate);
    }
    if (options?.endDate) {
      params.set("enddate", options.endDate);
    }

    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const res = await fetch(url, {
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Error fetching carts");
    }

    const carts: FakeStoreCart[] = await res.json();
    return carts;
  } catch (error) {
    console.error("Error fetching carts:", error);
    return [];
  }
}
