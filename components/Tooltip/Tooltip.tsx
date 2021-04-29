import { forwardRef, cloneElement, ReactElement } from 'react';
import Tippy, { TippyProps } from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional
import 'tippy.js/themes/light.css';

export interface TooltipProps extends TippyProps {
  children: ReactElement;
}

export const Tooltip = ({ children, ...tipProps }: TooltipProps) => {
  const ChildrenWithRef = forwardRef((props, ref) => {
    return cloneElement(children, { ref: ref, ...props });
  });

  return (
    <Tippy {...tipProps}>
      <span>
        <ChildrenWithRef />
      </span>
    </Tippy>
  );
};

export default Tooltip;
