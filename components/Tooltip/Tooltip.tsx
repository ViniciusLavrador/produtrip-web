import { forwardRef, cloneElement, ReactElement, useEffect, useState } from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import 'tippy.js/themes/light.css';
import { useThemeMode } from 'hooks';

export interface TooltipProps extends TippyProps {
  children: ReactElement;
}

export const Tooltip = ({ children, ...tipProps }: TooltipProps) => {
  const ChildrenWithRef = forwardRef((props, ref) => {
    return cloneElement(children, { ref: ref, ...props });
  });

  return (
    <Tippy {...tipProps}>
      <ChildrenWithRef />
    </Tippy>
  );
};

export default Tooltip;
