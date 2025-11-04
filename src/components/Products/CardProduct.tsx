import MyLink from "../Link";
import { CardProductProps } from "@/types/product";
import { useTranslations } from "next-intl";
import LinkWhiteBorder from "../Buttons/ButtonWhiteBorder";
export default function CardProduct({
  id,
  name,
  price,
  image,
}: CardProductProps) {
  const t = useTranslations("Products");
  return (
    <MyLink
      addHoverOpacity
      additionalClassNames="flex flex-col gap-4"
      href={`/products/${id}`}
    >
      <img src={image || "https://picsum.photos/192/180"} alt={name} />
      <p className="text-3xl text-left">{name}</p>
      <p className="text-zinc-400 text-xl">{price} €</p>
      <LinkWhiteBorder href={`/products/${id}`}>{t("buy_now")}</LinkWhiteBorder>
    </MyLink>
  );
}
