import { Typography } from 'components';
import cx from 'classnames';

export interface ErrorMessageProps {
  errorMessage: string;
}

export const ErrorMessage = ({ errorMessage }: ErrorMessageProps) => {
  const errorMessageClasses = cx('text-red-500 dark:text-red-500 italic');

  return (
    <Typography variant='span' className={errorMessageClasses}>
      {errorMessage}
    </Typography>
  );
};

export default ErrorMessage;
