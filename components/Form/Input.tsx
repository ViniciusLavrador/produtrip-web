import cx from 'classnames';
import { ChangeEventHandler, DetailedHTMLProps, InputHTMLAttributes, useState } from 'react';

export interface InputProps extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string;
}

export const Input = (props: InputProps) => {
  let { className, label, name, placeholder, value, onChange } = props;

  const inputClasses = cx(
    'border border-gray-400',
    'rounded',
    'px-3 py-2',
    'text-gray-900',
    'w-full',
    'focus:outline-none focus:shadow-outline', // Disable Focus Native Format
    'focus:border-gray-700 focus:shadow',
    className
  );

  const labelClasses = cx('my-4', 'text-sm');

  return (
    <div className='w-full'>
      {label && (
        <label className={labelClasses} htmlFor={name}>
          {label}
        </label>
      )}
      <input name={name} value={value} onChange={onChange} className={inputClasses} placeholder={placeholder} />
    </div>
  );
};

export default Input;
