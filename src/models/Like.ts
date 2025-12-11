import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILike extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema: Schema<ILike> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El usuario es requerido"],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "El producto es requerido"],
    },
  },
  {
    timestamps: true,
  }
);

// Índice compuesto único para evitar likes duplicados
LikeSchema.index({ user: 1, product: 1 }, { unique: true });

// Índice para buscar likes por usuario
LikeSchema.index({ user: 1 });

// Índice para contar likes por producto
LikeSchema.index({ product: 1 });

const Like: Model<ILike> =
  mongoose.models.Like || mongoose.model<ILike>("Like", LikeSchema);

export default Like;
