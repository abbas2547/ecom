import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProductsClient from "./ProductsClient";

export default async function Page() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-auth")?.value === "true";
  if (!isAdmin) redirect("/admin/login");

  return <ProductsClient />;
}
