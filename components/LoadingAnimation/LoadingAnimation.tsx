import { Logo, LogoProps } from 'components';
import { motion } from 'framer-motion';

export interface LoadingAnimationProps {
  size?: LogoProps['size'];
}

export const LoadingAnimation = ({ size }: LoadingAnimationProps) => {
  return (
    <motion.div layoutId='loadingAnimation' className='flex h-full w-full justify-center items-center'>
      <Logo size={size || '3xl'} className='animate-bounce' />
    </motion.div>
  );
};

export default LoadingAnimation;
