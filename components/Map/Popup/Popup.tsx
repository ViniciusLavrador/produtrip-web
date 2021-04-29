import { Popup as BasePopup, PopupProps as BasePopupProps } from 'react-map-gl';

export interface PopupProps extends BasePopupProps {}

export const Popup = ({ children, ...basePopupProps }: PopupProps) => {
  return (
    <BasePopup anchor='top' closeOnClick={true} {...basePopupProps}>
      {children}
    </BasePopup>
  );
};

export default Popup;
