import type { Card } from '@/types/card';
import { Image } from '@heroui/react';
import MyLink from './Link';

export default function Card({ image, title, link }: Card) {
  return (
    <MyLink addHoverOpacity href={link}>
      <div className="w-96">
        <figure>
          <Image src={image} alt={title} className='opacity-100' />
        </figure>
        <div className="card-body">
          <h2 className="text-center text-2xl">{title}</h2>
        </div>
      </div>
    </MyLink>
  );
}
