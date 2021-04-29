import cx from 'classnames';
import { DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes } from 'react';
import { Control, FieldError, useController, UseFormSetValue } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';
import Label from './Label';
import InputMask from 'react-input-mask';
import AutocompleteAddress from './AutocompleteAddress';

export interface FormFieldProps
  extends Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'type' | 'ref' | 'defaultValue'> {
  control: Control<any>;
  error?: FieldError;
  label?: string;
  autoComplete?: Forms.PossibleHTMLInputAutocomplete;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  mask?: string | (string | RegExp)[];
  type?: Forms.PossibleHTMLInputTypes;
  setValue?: UseFormSetValue<any>;
}

export const FormField = ({
  control,
  error,
  name,
  className,
  label,
  type,
  autoComplete,
  inputMode,
  mask,
  setValue,
  ...inputProps
}: FormFieldProps) => {
  const inputClasses = cx(
    'appearance-none',
    'w-full',
    'py-2 px-3',
    'text-gray-700 leading-tight',
    'rounded',
    { 'border-2': !error },
    { 'border-2 border-red-500': !!error },
    'focus:border-2 focus:border-yellow-300',
    'focus:shadow',
    'focus:outline-none focus:shadow-outline'
  );

  const {
    field: { ref, ...fieldProps },
  } = useController({ control, name });

  return (
    <div className='mb-4'>
      {label && <Label htmlFor={name} label={label} />}
      {mask ? (
        <InputMask
          mask={mask}
          className={inputClasses}
          ref={ref}
          name={name}
          type={type || undefined}
          autoComplete={autoComplete || undefined}
          inputMode={inputMode || undefined}
          {...inputProps}
          {...fieldProps}
        />
      ) : autoComplete && autoComplete.includes('address') ? (
        <AutocompleteAddress control={control} name={name} setValue={setValue} error={error} className={inputClasses} />
      ) : (
        <input
          className={inputClasses}
          ref={ref}
          name={name}
          type={type || undefined}
          autoComplete={autoComplete || undefined}
          inputMode={inputMode || undefined}
          {...inputProps}
          {...fieldProps}
        />
      )}
      {error && <ErrorMessage errorMessage={error.message} />}
    </div>
  );
};

export default FormField;
