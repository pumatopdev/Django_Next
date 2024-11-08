import Layout from "@/components/Layout";
import ProductDetail from "@/components/ProductDetail"; // Import your client component

// Server Component
const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id: product_id } = await params; // This works on the server side without `use client`

  return (
    <Layout>
      <ProductDetail product_id={product_id} />
    </Layout>
  );
};

export default ProductPage;