import Image from 'next/image';
import cx from 'classnames';

export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const CardImage = ({ src, alt, className }: CardImageProps) => {
  return (
    <div className={`relative w-full h-full shadow-lg ${className}`}>
      <Image src={src} layout='fill' objectFit='cover' objectPosition='center' alt={alt} className='' />
    </div>
  );
};

export default CardImage;
