import cx from 'classnames';
import { UseFormReset } from 'react-hook-form';

export interface CancelProps {
  disabled?: boolean;
  label?: string;
  className?: string;
  reset?: UseFormReset<any>;
}

export const Cancel = ({ disabled, label = 'Cancelar', className, reset }: CancelProps) => {
  const buttonClasses = cx(
    'transform transition-colors',
    'bg-gray-500 hover:bg-gray-700',
    'w-full',
    'text-white font-bold',
    'py-2 px-4',
    'rounded',
    'focus:outline-none focus:shadow-outline',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  );

  const handleClick = () => {
    if (reset) {
      reset();
    }
  };

  return (
    <button className={buttonClasses} type='reset' disabled={disabled} onClick={handleClick}>
      {label}
    </button>
  );
};

export default Cancel;
