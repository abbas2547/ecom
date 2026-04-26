"use client";

import { Product } from "@/lib/types";
import { useState } from "react";

interface Props {
  products: Product[];
  loading: boolean;
  error: string;
  onDelete: () => void;
  onEdit: (p: Product) => void;
}

export default function ProductList({ products, loading, error, onDelete, onEdit }: Props) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm("Delete this product?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      onDelete();
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-400">{error}</div>;

  return (
    <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
      <h2 className="text-lg font-semibold text-violet-300 mb-4">All Products ({products.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p._id} className="bg-slate-800 rounded p-4 flex">
            <img src={p.image} alt={p.name} className="w-28 h-28 object-cover rounded mr-4" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-slate-400">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">₹{p.price?.toFixed(2)}</p>
                  <p className="text-xs text-slate-400">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}</p>
                </div>
              </div>

              <p className="mt-2 text-sm text-slate-300">{p.description}</p>

              <div className="mt-3 flex space-x-2">
                <button onClick={() => onEdit(p)} className="px-3 py-1 bg-blue-600 rounded text-sm">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-600 rounded text-sm">
                  {deletingId === p._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
