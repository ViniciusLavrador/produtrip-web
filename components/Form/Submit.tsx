import cx from 'classnames';

export interface SubmitProps {
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Submit = ({ disabled, label = 'Enviar', className }: SubmitProps) => {
  const buttonClasses = cx(
    'bg-yellow-300 hover:bg-yellow-500 disabled:hover:bg-yellow-300',
    'w-full',
    'text-white font-bold',
    'py-2 px-4',
    'rounded',
    'focus:outline-none focus:shadow-outline',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  );

  return (
    <button className={buttonClasses} type='submit' disabled={disabled}>
      {label}
    </button>
  );
};

export default Submit;
