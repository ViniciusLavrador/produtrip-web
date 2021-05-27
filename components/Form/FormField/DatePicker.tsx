import 'react-datepicker/dist/react-datepicker.css';

import BaseDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { useEffect, useState } from 'react';

import cx from 'classnames';
import { Typography } from 'components/Typography';

export interface DatePickerProps extends ReactDatePickerProps {
  className?: string;
  datePickerClassName?: string;
  label?: string;
}

export const DatePicker = ({ selected, onChange, className, datePickerClassName, label, ...props }: DatePickerProps) => {
  const [date, setDate] = useState<Date>(new Date());

  const hasColorClass = datePickerClassName ? datePickerClassName.match(/(^|\s)bg-(((\w*)-[0-9]{3})|black|white)($|\s)/) : false;

  const ROOT_CLASSES = cx('select-none', 'w-full', 'flex flex-col items-center', className);

  const DATE_PICKER_CLASSES = cx(
    { 'bg-yellow-300': !hasColorClass },
    'py-2',
    'rounded',
    'text-center font-bold',
    'select-none',
    'cursor-pointer',
    'focus:outline-none focus:shadow-outline',
    datePickerClassName
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
        locale='pt-br'
        dateFormat='dd/MM/yyyy'
        selected={selected || date}
        onChange={(date, event) => (onChange ? onChange(date, event) : setDate(date as Date))}
        onChangeRaw={(e) => e.preventDefault()}
        showPopperArrow={false}
        {...props}
      />
    </label>
  );
};

export default DatePicker;
