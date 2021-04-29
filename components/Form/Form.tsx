import * as yup from 'yup';
import React, { useImperativeHandle, useRef } from 'react';
import { DeepPartial, UnpackNestedValue } from 'react-hook-form';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormField } from './FormField';
import ActionRow from './ActionRow';
import cx from 'classnames';
import { toast } from 'react-toastify';

interface FormProps<T> {
  schema: yup.SchemaOf<T>;
  defaultValues?: UnpackNestedValue<DeepPartial<T>>;
  fieldsOptions?: {
    [key in keyof UnpackNestedValue<DeepPartial<T>>]: {
      type?: Forms.PossibleHTMLInputTypes;
      autoComplete?: Forms.PossibleHTMLInputAutocomplete;
      inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
      mask?: string | (string | RegExp)[];
      label?: string;
      placeholder?: string;
    };
  };
  classNames?: { root?: string; grid?: string; actionRow?: string } & UnpackNestedValue<DeepPartial<T>>;
  onSubmit: SubmitHandler<T>;
  submitLabel?: string;
  cancelLabel?: string;
  externalRef?: ((instance: unknown) => void) | React.MutableRefObject<unknown>;
}

export const Form = <T extends unknown>({
  schema,
  defaultValues,
  fieldsOptions,
  classNames,
  onSubmit,
  submitLabel,
  cancelLabel,
  externalRef,
}: FormProps<T>) => {
  const { control, handleSubmit, formState, reset, setValue } = useForm<T>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues,
  });

  if (externalRef) {
    useImperativeHandle(externalRef, () => ({
      reset: reset,
    }));
  }

  const hasGridSizingClass = classNames?.grid
    ? classNames.grid.match(/(^|\s)((sm|md|lg|xl|2xl):)?(grid-cols-)(\d{1,2})($|\s)/)
    : false;

  const rootClasses = cx('bg-white dark:bg-gray-800', 'rounded', 'px-8 pt-6 pb-8', 'mb-4', 'shadow-md', classNames?.root);
  const gridClasses = cx('md:grid', { 'md:grid-cols-6': !hasGridSizingClass }, 'md:gap-5', classNames?.grid);

  defaultValues &&
    Object.keys(defaultValues).map((key) => {
      defaultValues[key] = defaultValues[key] ? defaultValues[key] : ''; // Defaulting "undefined" defaultValues to empty strings
    });

  return (
    <form
      className={rootClasses}
      onSubmit={handleSubmit(onSubmit, (err) => {
        toast.error('Erro. Revalide o formulário.', { toastId: 'formError' });
        console.error(err);
      })}
    >
      <div className={gridClasses}>
        {Object.entries(schema.fields).map(([name, schema]) => {
          let isRequired = schema && schema['exclusiveTests'] && schema['exclusiveTests']['required'];
          return (
            <div className={classNames[name] || 'md:col-span-2'} key={name}>
              <FormField
                setValue={setValue}
                name={`${name}`}
                control={control}
                error={formState.errors[name] || undefined}
                label={
                  fieldsOptions && fieldsOptions[name] && fieldsOptions[name]['label']
                    ? `${fieldsOptions[name]['label']}${isRequired ? '*' : ''}`
                    : undefined
                }
                placeholder={
                  fieldsOptions && fieldsOptions[name] && fieldsOptions[name]['placeholder']
                    ? fieldsOptions[name]['placeholder']
                    : fieldsOptions && fieldsOptions[name] && fieldsOptions[name]['label']
                    ? fieldsOptions[name]['label']
                    : undefined
                }
                autoComplete={
                  fieldsOptions && fieldsOptions[name] && fieldsOptions[name]['autoComplete']
                    ? fieldsOptions[name]['autoComplete']
                    : undefined
                }
                inputMode={
                  fieldsOptions && fieldsOptions[name] && fieldsOptions[name]['inputMode']
                    ? fieldsOptions[name]['inputMode']
                    : undefined
                }
                mask={
                  fieldsOptions && fieldsOptions[name] && fieldsOptions[name]['mask'] ? fieldsOptions[name]['mask'] : undefined
                }
                type={
                  fieldsOptions && fieldsOptions[name] && fieldsOptions[name]['type'] ? fieldsOptions[name]['type'] : undefined
                }
              />
            </div>
          );
        })}
        <ActionRow control={control} submitLabel={submitLabel} cancelLabel={cancelLabel} reset={reset}></ActionRow>
      </div>
    </form>
  );
};
