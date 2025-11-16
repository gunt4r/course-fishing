import type { Card } from "@/types/card";
import MyLink from "./Link";
import Image from "next/image";
export default function Card({ image, title, link }: Card) {
  return (
    <MyLink addHoverOpacity href={link}>
      <div className="w-96">
        <figure>
          <Image
            width={300}
            height={400}
            className="justify-self-center"
            src={image}
            alt={title}
          />
        </figure>
        <div className="card-body">
          <h2 className="text-center text-2xl">{title}</h2>
        </div>
      </div>
    </MyLink>
  );
}
