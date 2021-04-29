import { Logo, LogoProps } from 'components';
import { AnimatePresence, motion } from 'framer-motion';

export interface LoadingAnimationProps {
  size?: LogoProps['size'];
}

export const LoadingAnimation = ({ size }: LoadingAnimationProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        layoutId='loadingAnimation'
        className='flex h-full w-full justify-center items-center'
      >
        <Logo size={size || '3xl'} className='animate-bounce' />
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingAnimation;
