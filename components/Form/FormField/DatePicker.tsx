import 'react-datepicker/dist/react-datepicker.css';

import BaseDatePicker, { registerLocale, ReactDatePickerProps } from 'react-datepicker';
import { useEffect, useState } from 'react';

import ptBR from 'date-fns/locale/pt-BR';

import cx from 'classnames';
import { Typography } from 'components/Typography';

export interface DatePickerProps extends ReactDatePickerProps {
  className?: string;
  label?: string;
}

export const DatePicker = ({ selected, onChange, className, label }: DatePickerProps) => {
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    registerLocale('ptBR', ptBR);
  }, [ptBR]);

  const ROOT_CLASSES = cx('select-none', 'w-full', 'flex flex-col items-center', className);

  const DATE_PICKER_CLASSES = cx(
    'bg-yellow-300',
    'py-2',
    'rounded',
    'text-center font-bold',
    'select-none',
    'cursor-pointer',
    'focus:outline-none focus:shadow-outline'
  );

  return (
    <label style={{ caretColor: 'transparent' }} className={ROOT_CLASSES}>
      {label && (
        <Typography variant='span' className='mb-1' bold>
          {label}
        </Typography>
      )}
      <BaseDatePicker
        className={DATE_PICKER_CLASSES}
        locale='ptBR'
        dateFormat='dd/MM/yyyy'
        selected={selected || date}
        onChange={(date, event) => (onChange ? onChange(date, event) : setDate(date as Date))}
        onChangeRaw={(e) => e.preventDefault()}
      />
    </label>
  );
};

export default DatePicker;
