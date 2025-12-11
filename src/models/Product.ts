import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  stock: number;
  status: "available" | "out_of_stock" | "discontinued";
  featured: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Interfaz para traducciones (internacionalización)
export interface IProductTranslation {
  name: string;
  description: string;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es requerida"],
      minlength: [10, "La descripción debe tener al menos 10 caracteres"],
      maxlength: [2000, "La descripción no puede exceder 2000 caracteres"],
    },
    price: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0, "El precio no puede ser negativo"],
    },
    category: {
      type: String,
      required: [true, "La categoría es requerida"],
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "El stock no puede ser negativo"],
    },
    status: {
      type: String,
      enum: ["available", "out_of_stock", "discontinued"],
      default: "available",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generar slug automáticamente antes de validar
ProductSchema.pre("validate", function () {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

// Actualizar status basado en stock
ProductSchema.pre("save", function () {
  if (this.stock === 0 && this.status === "available") {
    this.status = "out_of_stock";
  } else if (this.stock > 0 && this.status === "out_of_stock") {
    this.status = "available";
  }
});

// Índices
ProductSchema.index({ category: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ name: "text", description: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
