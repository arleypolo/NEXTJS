import mongoose from "mongoose";

// ==========================================
// Tipos base comunes
// ==========================================

export type ObjectId = mongoose.Types.ObjectId | string;

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// Interfaces de Usuario
// ==========================================

export type UserRole = "user" | "admin" | "moderator";
export type UserStatus = "active" | "inactive" | "suspended" | "pending";

export interface IUserBase {
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
}

export interface IUser extends IUserBase, Timestamps {
  _id: ObjectId;
  password: string;
  status: UserStatus;
  emailVerified?: Date | null;
  phone?: string;
  address?: IAddress;
  preferences?: IUserPreferences;
  lastLogin?: Date;
}

export interface IUserPublic extends Omit<IUser, "password"> {
  likesCount?: number;
  productsCount?: number;
}

export interface IUserPreferences {
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  theme: "light" | "dark" | "system";
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// ==========================================
// Interfaces de Producto
// ==========================================

export type ProductStatus = "available" | "out_of_stock" | "discontinued" | "draft";

export interface IProductBase {
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image?: string | null;
  stock: number;
  status: ProductStatus;
  featured: boolean;
}

export interface IProduct extends IProductBase, Timestamps {
  _id: ObjectId;
  createdBy: ObjectId;
  sku?: string;
  compareAtPrice?: number;
  costPrice?: number;
  weight?: number;
  dimensions?: IProductDimensions;
  tags?: string[];
  images?: string[];
  variants?: IProductVariant[];
  metadata?: Record<string, unknown>;
  seo?: IProductSEO;
  translations?: Record<string, IProductTranslation>;
}

export interface IProductWithRelations extends IProduct {
  createdByUser?: IUserPublic;
  likesCount?: number;
  userLiked?: boolean;
}

export interface IProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: "cm" | "in";
}

export interface IProductVariant {
  id: string;
  name: string;
  sku?: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface IProductSEO {
  title?: string;
  description?: string;
  keywords?: string[];
}

export interface IProductTranslation {
  name: string;
  description: string;
  seo?: IProductSEO;
}

// ==========================================
// Interfaces de Carrito
// ==========================================

export type CartStatus = "active" | "abandoned" | "converted" | "merged";

export interface ICartItem {
  product: ObjectId;
  quantity: number;
  price: number;
  variant?: string;
}

export interface ICartItemPopulated extends Omit<ICartItem, "product"> {
  product: IProduct;
}

export interface ICart extends Timestamps {
  _id: ObjectId;
  user: ObjectId;
  items: ICartItem[];
  totalItems: number;
  totalPrice: number;
  status: CartStatus;
  couponCode?: string;
  discount?: number;
  expiresAt?: Date;
}

export interface ICartPopulated extends Omit<ICart, "items" | "user"> {
  user: IUserPublic;
  items: ICartItemPopulated[];
}

// ==========================================
// Interfaces de Like
// ==========================================

export interface ILike extends Timestamps {
  _id: ObjectId;
  user: ObjectId;
  product: ObjectId;
}

export interface ILikePopulated extends Omit<ILike, "product"> {
  product: IProduct;
}

// ==========================================
// Interfaces de API Response
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ==========================================
// Interfaces de Autenticación
// ==========================================

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface IRegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface IAuthResponse {
  user: IUserPublic;
  token?: string;
}

// ==========================================
// Interfaces de Formularios
// ==========================================

export interface IProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  featured?: boolean;
  status?: ProductStatus;
  tags?: string[];
}

export interface IUserFormData {
  name: string;
  email: string;
  phone?: string;
  image?: string;
  address?: IAddress;
}

// ==========================================
// Tipos de utilidad
// ==========================================

export type WithId<T> = T & { _id: ObjectId };
export type CreateInput<T> = Omit<T, "_id" | "createdAt" | "updatedAt">;
export type UpdateInput<T> = Partial<CreateInput<T>>;
