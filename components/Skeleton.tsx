import InnerSkeleton, { SkeletonTheme, SkeletonProps } from 'react-loading-skeleton';
import { useThemeMode } from '../hooks';

export const Skeleton = (props: SkeletonProps) => {
  const { currentMode } = useThemeMode();

  return (
    <SkeletonTheme color='red'>
      <InnerSkeleton {...props} />
    </SkeletonTheme>
  );
};

export default Skeleton;
