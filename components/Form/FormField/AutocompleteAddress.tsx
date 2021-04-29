import cx from 'classnames';
import { FormFieldProps } from 'components';
import { Typography } from 'components/Typography';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useController } from 'react-hook-form';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

export interface AutocompleteAddressProps extends FormFieldProps {}

export const AutocompleteAddress = ({
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
  placeholder,
  ...inputProps
}: AutocompleteAddressProps) => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue: setInternalValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  });

  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setInternalValue(e.target.value);
  };

  const handleSelect = ({ description, place_id }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setInternalValue(description, false);
    setValue(name, place_id);
    clearSuggestions();
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li
          key={place_id}
          onClick={handleSelect(suggestion)}
          className='select-none py-2 px-4 hover:bg-yellow-300 cursor-pointer'
        >
          <Typography variant='span' bold>
            {main_text}
          </Typography>{' '}
          <Typography variant='span' muted>
            {secondary_text}
          </Typography>
        </li>
      );
    });

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

  return (
    <div ref={ref}>
      <input className={inputClasses} value={value} onChange={handleInput} disabled={!ready} placeholder={placeholder} />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === 'OK' && <ul className='bg-white dark:bg-gray-800 shadow rounded py-2 absolute z-10 '>{renderSuggestions()}</ul>}
    </div>
  );
};

export default AutocompleteAddress;
