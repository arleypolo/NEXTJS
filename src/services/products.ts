import dbConnect from "@/lib/mongodb";
import { Product, IProduct } from "@/models";

export interface ProductData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  status: "available" | "out_of_stock" | "discontinued";
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: ProductData[];
  total: number;
  page: number;
  totalPages: number;
}

interface GetProductsOptions {
  category?: string;
  featured?: boolean;
  status?: string;
  limit?: number;
  page?: number;
}

// Obtener todos los productos (para SSG/ISR)
export async function getProducts(
  options: GetProductsOptions = {}
): Promise<ProductsResponse> {
  await dbConnect();

  const { category, featured, status, limit = 10, page = 1 } = options;

  const query: Record<string, unknown> = {};

  if (category) query.category = category;
  if (featured !== undefined) query.featured = featured;
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// Obtener un producto por ID o slug (para SSG/ISR)
export async function getProductById(id: string): Promise<ProductData | null> {
  await dbConnect();

  const product = await Product.findOne({
    $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { slug: id }],
  }).lean();

  if (!product) return null;

  return JSON.parse(JSON.stringify(product));
}

// Obtener todos los IDs/slugs de productos (para generateStaticParams)
export async function getAllProductSlugs(): Promise<string[]> {
  await dbConnect();

  const products = await Product.find({}, { slug: 1 }).lean();

  return products.map((p) => p.slug);
}

// Obtener productos destacados
export async function getFeaturedProducts(
  limit: number = 6
): Promise<ProductData[]> {
  await dbConnect();

  const products = await Product.find({ featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return JSON.parse(JSON.stringify(products));
}

// Obtener categorías únicas
export async function getCategories(): Promise<string[]> {
  await dbConnect();

  const categories = await Product.distinct("category");

  return categories;
}
