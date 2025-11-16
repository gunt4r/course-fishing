"use client";
import { useProduct } from "@/app/queries/product/productQuery";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/react";
import { useTranslations } from "next-intl";
import { useAddToCart } from "@/app/queries/cart/cartQuery";
import { useState } from "react";
export default function ProductPage() {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useProduct(id as string);
  const router = useRouter();
  const { mutate: addToCart, isPending } = useAddToCart();
  const tHeader = useTranslations("Header");
  const tProducts = useTranslations("Products");
  const [ isRedirecting, setIsRedirecting ] = useState<boolean>(false);
  if (isLoading || isPending || isRedirecting) return <Loader />;

  if (isError) {
    toast.error(error.message);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  }
  const handleSubmit = () => {
    addToCart(id as string, {
      onSuccess: () => {
        setIsRedirecting(true);
        toast.success(tProducts("product_has_been_added"));
        setTimeout(() => {
          router.push("/cart");
        }, 1500);
      },
      onError: () => {
        toast.error(tProducts("product_adding_error"));
      },
    });
  };
  return (
    <section className="mt-40">
      <main className="flex items-center gap-16 lg:flex-row flex-col mb-40">
        <img
          src={data.product.image || "https://picsum.photos/192/180"}
          className="w-2/4"
          alt={data.product.name}
        />
        <div>
          <Breadcrumbs variant="light" underline="hover" className="mb-20">
            <BreadcrumbItem
              className="duration-300 transition-opacity cursor-pointer hover:underline-offset-4 hover:opacity-75"
              classNames={{
                item: "text-cyan-50",
                separator: "text-cyan-50",
              }}
              href="/"
            >
              {tHeader("home_link")}
            </BreadcrumbItem>
            <BreadcrumbItem
              className="duration-300 transition-opacity cursor-pointer hover:underline-offset-4 hover:opacity-75"
              href="/products"
              classNames={{
                item: "text-cyan-50",
                separator: "text-cyan-50",
              }}
            >
              {tProducts("title")}
            </BreadcrumbItem>
            <BreadcrumbItem
              className="duration-300 transition-opacity cursor-pointer hover:underline-offset-4 hover:opacity-75"
              classNames={{
                item: "text-cyan-50",
                separator: "text-cyan-50",
              }}
            >
              {data.product.name}
            </BreadcrumbItem>
          </Breadcrumbs>
          <div className="flex flex-col gap-2.5 mb-12">
            <h1 className="text-8xl mb-5">{data.product.name}</h1>
            <p className="text-2xl ">{data.product.description}</p>
            <p className="text-xl text-zinc-400">{data.product.price} €</p>
          </div>
          <button
            onClick={handleSubmit}
            className="text-xl border-cyan-50 py-4 border rounded-full px-6 duration-300 hover:bg-cyan-50 hover:text-zinc-900 cursor-pointer"
          >
            {tProducts("buy_now")}
          </button>
        </div>
      </main>
      <div
        dangerouslySetInnerHTML={{ __html: data.product.sanitizedHtml }}
        className="flex self-center justify-self-center"
      ></div>
    </section>
  );
}
