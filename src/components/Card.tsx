import type { Card } from "@/types/card";
import MyLink from "./Link";
export default function Card({ image, title, link }: Card) {
  return (
    <MyLink addHoverOpacity href={link}>
      <div className="w-96">
        <figure>
          <img src={image} alt={title} />
        </figure>
        <div className="card-body">
          <h2 className="text-center text-2xl">{title}</h2>
        </div>
      </div>
    </MyLink>
  );
}
