import Pin from './Pin';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import {
  Marker as BaseMarker,
  MarkerProps as BaseMarkerProps,
  Popup as BasePopup,
  PopupProps as BasePopupProps,
} from 'react-map-gl';

import cx from 'classnames';
import useOnclickOutside from 'react-cool-onclickoutside';

export interface MarkerProps extends BaseMarkerProps {
  children?: ReactNode;
  size?: number;
  popupOptions?: Omit<BasePopupProps, 'latitude' | 'longitude' | 'className'>;
  active?: boolean;
}

export const Marker = ({
  size = 20,
  latitude,
  longitude,
  popupOptions,
  children,
  className,
  active = false,
  ...baseMarkerProps
}: MarkerProps) => {
  let [popupOpen, setPopupOpen] = useState(false);

  const clickOutRef = useOnclickOutside(() => {
    setPopupOpen(false);
  });

  const pinClasses = cx(
    'transform transition-colors',
    'hover:text-yellow-500',
    { 'text-yellow-500': popupOpen },
    { 'text-yellow-300': !popupOpen }
  );
  const markerClasses = cx(className);
  const popupClasses = cx('z-10');

  useEffect(() => {
    if (active) {
      setTimeout(() => {
        setPopupOpen(true);
      }, 1500);
    }

    return () => {
      setPopupOpen(false);
    };
  }, [active]);

  return (
    <>
      <AnimatePresence>
        {children && popupOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BasePopup
              latitude={latitude}
              longitude={longitude}
              closeOnClick={false}
              closeButton={false}
              offsetTop={-30}
              onClose={() => setPopupOpen(false)}
              tipSize={5}
              className={popupClasses}
              {...popupOptions}
            >
              <div className='max-w-[10rem] select-none cursor-auto' ref={clickOutRef}>
                {children}
              </div>
            </BasePopup>
          </motion.div>
        )}
      </AnimatePresence>
      <BaseMarker
        latitude={latitude}
        longitude={longitude}
        offsetTop={-20}
        className={markerClasses}
        offsetLeft={-10}
        {...baseMarkerProps}
      >
        {children ? (
          <div onClick={() => setPopupOpen(!popupOpen)} className='cursor-pointer'>
            <Pin size={size} className={pinClasses} />
          </div>
        ) : (
          <Pin size={size} />
        )}
      </BaseMarker>
    </>
  );
};

export default Marker;
