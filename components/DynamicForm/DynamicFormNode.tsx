import { Typography } from 'components/Typography';
import cx from 'classnames';

export enum FormNodeTypes {
  TEXT_NODE = 'TEXT_NODE',
  INPUT_NODE = 'INPUT_NODE',
  SELECTION_NODE = 'SELECTION_NODE',
  ATTACHMENT_NODE = 'ATTACHMENT_NODE',
}

export interface DynamicFormNodeProps {
  node: {
    type: FormNodeTypes;
    priority: number;
    title?: string;
    subtitle?: string;
    text?: string;
    selectOptions?: { text?: string; default?: boolean }[];
  };
}

export const DynamicFormNode = ({ node }: DynamicFormNodeProps) => {
  const inputClasses = cx('appearance-none focus:outline-none', 'w-full', 'py-2 px-3', 'rounded', 'border-2');

  let Content: () => JSX.Element;

  switch (node.type) {
    case FormNodeTypes.TEXT_NODE:
      Content = () => (
        <>
          {node.title && (
            <Typography variant='h6' bold className='mb-1'>
              {node.title}
            </Typography>
          )}
          {node.subtitle && (
            <Typography variant='span' muted bold className='mb-1'>
              {node.subtitle}
            </Typography>
          )}
          {node.text && <Typography variant='p'>{node.text}</Typography>}
        </>
      );
      break;
    case FormNodeTypes.INPUT_NODE:
      Content = () => (
        <>
          {node.title && (
            <Typography variant='h6' bold className='mb-1'>
              {node.title}
            </Typography>
          )}
          {node.subtitle && (
            <Typography variant='span' muted bold className='mb-3'>
              {node.subtitle}
            </Typography>
          )}
          <input placeholder={node.text && node.text} className={inputClasses} />
        </>
      );
      break;
    case FormNodeTypes.SELECTION_NODE:
      Content = () => (
        <>
          {node.title && (
            <Typography variant='h6' bold className='mb-1'>
              {node.title}
            </Typography>
          )}
          {node.subtitle && (
            <Typography variant='span' muted bold className='mb-3'>
              {node.subtitle}
            </Typography>
          )}

          <div className='relative inline-block w-full text-gray-700'>
            <select
              className='w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg appearance-none focus:outline-none'
              placeholder={node.text}
            >
              {node.selectOptions && node.selectOptions.map((option) => <option selected={option.default}>{option.text}</option>)}
            </select>
            <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none'>
              <svg className='w-4 h-4 fill-current' viewBox='0 0 20 20'>
                <path
                  d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                  clipRule='evenodd'
                  fillRule='evenodd'
                ></path>
              </svg>
            </div>
          </div>
        </>
      );
      break;
    case FormNodeTypes.ATTACHMENT_NODE:
      <Typography variant='p' muted>
        Anexos ainda são uma funcionalidade em desenvolvimento.
      </Typography>;
      break;
  }

  return (
    <div className='grid grid-cols-12 w-full items-center'>
      <div className='col-span-1'>
        <Typography variant='span' bold>
          {node.priority}.
        </Typography>
      </div>
      <div className='col-span-11'>{Content && <Content />}</div>
    </div>
  );
};

export default DynamicFormNode;
