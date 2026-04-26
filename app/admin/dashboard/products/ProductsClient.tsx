"use client";

import { useEffect, useState } from "react";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import { Product } from "@/lib/types";

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (res.ok) {
        setProducts(data.products || []);
      } else {
        setError(data.error || "Failed to fetch products");
      }
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-violet-400 mb-4">Product Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProductForm
              key={editing?._id || "new"}
              product={editing}
              onSaved={() => {
                setEditing(null);
                fetchProducts();
              }}
              onCancel={() => setEditing(null)}
            />
          </div>

          <div className="lg:col-span-2">
            <ProductList
              products={products}
              loading={loading}
              error={error}
              onDelete={() => fetchProducts()}
              onEdit={(p) => setEditing(p)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
