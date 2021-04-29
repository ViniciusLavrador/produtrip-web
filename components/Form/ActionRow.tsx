import cx from 'classnames';
import { Control, UseFormReset, useFormState } from 'react-hook-form';
import Submit from './Submit';
import Cancel from './Cancel';

export interface ActionRowProps {
  control: Control<any>;
  submitLabel?: string;
  cancelLabel?: string;
  reset?: UseFormReset<any>;
}

export const ActionRow = ({ control, submitLabel, cancelLabel, reset }: ActionRowProps) => {
  const rootClasses = cx('md:col-span-full', 'flex flex-col md:flex-row-reverse gap-5 gap-5', 'mt-5 md:mt-0');
  const { isDirty, isValid } = useFormState({ control: control });

  return (
    <div className={rootClasses}>
      <Submit disabled={!isDirty || !isValid} label={submitLabel} />
      <Cancel label={cancelLabel} reset={reset} />
    </div>
  );
};

export default ActionRow;
