import { Typography } from 'components/Typography';
import cx from 'classnames';

export interface LabelProps {
  htmlFor: string;
  label: string;
}

export const Label = ({ htmlFor, label }: LabelProps) => {
  const labelClasses = cx('block', 'mb-2');

  return (
    <label className={labelClasses} htmlFor={htmlFor}>
      <Typography variant='span' bold>
        {label}
      </Typography>
    </label>
  );
};

export default Label;
