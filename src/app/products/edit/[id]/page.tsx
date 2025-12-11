import { redirect } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Editar Producto | ProductPlatform",
  description: "Edita un producto existente",
};

// Redirigir a la página de edición del admin (FakeStoreAPI)
export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  redirect(`/admin/edit/${id}`);
}
