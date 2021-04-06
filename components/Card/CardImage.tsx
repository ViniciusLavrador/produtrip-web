import Image from 'next/image';
import cx from 'classnames';

export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const CardImage = ({ src, alt, className }: CardImageProps) => {
  const rootClasses = cx('relative', 'w-full h-full', className);

  return (
    <div className={rootClasses}>
      <Image src={src} layout='fill' objectFit='cover' objectPosition='center' alt={alt} />
    </div>
  );
};

export default CardImage;
