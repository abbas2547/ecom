"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/lib/types";

interface Props {
  product?: Product | null;
  onSaved: () => void;
  onCancel?: () => void;
}

export default function ProductForm({ product, onSaved, onCancel }: Props) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [category, setCategory] = useState(product?.category || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(product?.image || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setName(product?.name || "");
    setDescription(product?.description || "");
    setPrice(product?.price?.toString() || "");
    setCategory(product?.category || "");
    setImagePreview(product?.image || "");
    setImageFile(null);
  }, [product]);

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!description.trim()) return "Description is required";
    if (!price || Number.isNaN(Number(price))) return "Valid price is required";
    if (!category.trim()) return "Category is required";
    if (!imagePreview) return "Image is required";
    return null;
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data: publicData } = supabase.storage.from("product-images").getPublicUrl(data.path);
    return publicData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    setLoading(true);
    try {
      let image = imagePreview;
      if (imageFile) {
        image = await uploadImage(imageFile);
      }

      const payload = { name, description, price: Number(price), category, image };

      let res;
      if (product && product._id) {
        res = await fetch(`/api/products/${product._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      setSuccess("Saved successfully");
      onSaved();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
      <h2 className="text-lg font-semibold text-violet-300 mb-4">{product ? "Edit Product" : "Add Product"}</h2>

      <div className="space-y-3">
        <div>
          <label className="text-sm text-slate-300">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 text-white" />
        </div>

        <div>
          <label className="text-sm text-slate-300">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 text-white" rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-300">Price</label>
            <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 text-white" type="number" step="0.01" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 p-2 rounded bg-slate-800 text-white" />
          </div>
        </div>

        <div>
          <label className="text-sm text-slate-300">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setImageFile(f);
              if (f) setImagePreview(URL.createObjectURL(f));
            }}
            className="w-full mt-1 p-2 rounded bg-slate-800 text-white"
          />
          {imagePreview && (
            <img src={imagePreview} alt="preview" className="mt-2 w-full h-40 object-contain rounded" />
          )}
        </div>

        {error && <p className="text-red-400">{error}</p>}
        {success && <p className="text-emerald-400">{success}</p>}

        <div className="flex items-center space-x-2">
          <button disabled={loading} type="submit" className="px-4 py-2 bg-violet-600 rounded">
            {loading ? "Saving..." : product ? "Update" : "Add Product"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-700 rounded">
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
