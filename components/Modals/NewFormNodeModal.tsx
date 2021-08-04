import axios from 'axios';
import { Button } from 'components/Button';
import { Typography } from 'components/Typography';
import { useModal } from 'hooks/useModal';
import { XOutlineIcon } from 'public/icons/outline';
import { MouseEventHandler, ChangeEventHandler, KeyboardEventHandler, useState } from 'react';
import { toast } from 'react-toastify';

interface TagProps {
  value: string;
  defaultValue: boolean;
  handleRemoveTag(value: string): any;
  handleTagDefaultChange(value: string): any;
}

const Tag = ({ value, defaultValue, handleRemoveTag, handleTagDefaultChange }: TagProps) => {
  return (
    <div
      className={`inline-flex items-center text-sm rounded mt-2 mr-1 overflow-hidden cursor-pointer ${
        defaultValue ? 'bg-yellow-400' : 'bg-yellow-100 '
      }`}
      onClick={(e) => {
        handleTagDefaultChange(value);
      }}
    >
      <span className={`ml-2 mr-1 leading-relaxed truncate max-w-xs px-1 ${defaultValue && 'text-white'} select-none`}>
        {value}
      </span>
      <button
        className={`w-6 h-8 inline-block align-middle ${
          defaultValue
            ? 'hover:text-white text-gray-500 bg-yellow-500 hover:bg-yellow-600'
            : 'hover:text-gray-900 text-gray-500 bg-yellow-200 hover:bg-yellow-300'
        } focus:outline-none`}
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveTag(value);
        }}
      >
        <XOutlineIcon className='h-4 w-4 mx-auto my-auto' />
      </button>
    </div>
  );
};

export enum FormNodeTypes {
  TEXT_NODE = 'TEXT_NODE',
  INPUT_NODE = 'INPUT_NODE',
  SELECTION_NODE = 'SELECTION_NODE',
  ATTACHMENT_NODE = 'ATTACHMENT_NODE',
}

export interface NewFormNodeModalProps {
  formID: string;
  nodeAmount?: number;
  revalidateFormFields: any;
}

export const NewFormNodeModal = ({ nodeAmount, formID, revalidateFormFields }: NewFormNodeModalProps) => {
  const { closeModal } = useModal('newFormNodeModal');

  // Internal State
  const [newNodeType, setNewNodeType] = useState<FormNodeTypes>(FormNodeTypes.TEXT_NODE);
  const [newNodePriority, setNewNodePriority] = useState<number>(nodeAmount + 1 || 1);
  const [newNodeText, setNewNodeText] = useState<string>('');
  const [newNodeTitle, setNewNodeTitle] = useState<string>('');
  const [newNodeSubtitle, setNewNodeSubtitle] = useState<string>('');
  const [newNodePossibleSelectionValues, setNewNodePossibleSelectionValues] = useState<{ value: string; default?: boolean }[]>(
    []
  );

  const [tags, setTags] = useState<string>('');

  // Handle Node Type Change
  const handleNodeTypeChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    if (newNodeType === FormNodeTypes.SELECTION_NODE && (event.target.value as FormNodeTypes) !== FormNodeTypes.SELECTION_NODE) {
      setNewNodePossibleSelectionValues([]);
    }
    setNewNodeType(event.target.value as FormNodeTypes);
  };

  // Handle PriorityChange
  const handlePriorityChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    return; // Does Nothing So Far ( Must Fix Backend to Allow This Behaviour)
    if (e.target.valueAsNumber > nodeAmount + 1 || e.target.valueAsNumber < 1) {
      return;
    }
    setNewNodePriority(e.target.valueAsNumber);
  };

  // Handle Tag KeyDown
  const handleTagKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      handleNewTag();
    }
  };

  // Handle New Tag
  const handleNewTag = () => {
    if (tags && tags !== '') {
      let trimmedTags = tags.trim();
      let lowerTags = trimmedTags.toLowerCase().trim();
      if (!newNodePossibleSelectionValues || newNodePossibleSelectionValues.length === 0) {
        setTags('');
        return setNewNodePossibleSelectionValues([{ value: trimmedTags, default: true }]);
      }

      let oldPsv = newNodePossibleSelectionValues;
      if (!oldPsv.map((psv) => psv.value.toLowerCase()).includes(lowerTags)) {
        if (oldPsv.map((psv) => psv.default).includes(true)) {
          oldPsv.push({ value: trimmedTags, default: false });
        } else {
          oldPsv.push({ value: trimmedTags, default: true });
        }
      }

      setTags('');
      return setNewNodePossibleSelectionValues(oldPsv);
    }
  };

  // Handle Remove Tag
  const handleRemoveTag = (value: string) => {
    if (value && value !== '') {
      let newPsv = newNodePossibleSelectionValues.filter(({ value: psvValue, default: defaultValue }) => psvValue !== value);
      if (!newPsv.map((psv) => psv.default).includes(true) && newPsv.length > 0) {
        console.log(newPsv);
        newPsv[0].default = true;
      }
      return setNewNodePossibleSelectionValues(newPsv);
    }
  };

  // Handle Change Default Tag
  const handleTagDefaultChange = (value: string) => {
    if (value && value !== '') {
      let newPsv = [...newNodePossibleSelectionValues];
      newPsv[newPsv.findIndex((psv) => psv.default === true)].default = false;
      newPsv[newPsv.findIndex((psv) => psv.value === value)].default = true;

      setNewNodePossibleSelectionValues(newPsv);
    }
  };

  // Add New node
  const addNode = () => {
    const payload = {
      type: newNodeType,
      priority: newNodePriority,
      title: newNodeTitle,
      subtitle: newNodeSubtitle,
      text: newNodeText,
      possibleSelectionValues: newNodePossibleSelectionValues,
    };

    axios
      .put(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/forms/${formID}/node`, { ...payload })
      .catch((err) => {
        console.error(err);
        toast.error('Não conseguimos criar o campo agora. Tente novamente dentro de alguns instantes.');
      })
      .then((_) => {
        toast.success('Campo Criado com Sucesso !');
        revalidateFormFields();
        closeModal();
      });
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex flex-row w-full justify-between items-center'>
        <Typography variant='h3' bold className='mb-5'>
          Adicionar Campo
        </Typography>
        <input
          type='number'
          value={newNodePriority}
          onChange={handlePriorityChange}
          placeholder='Prioridade'
          className='appearance-none focus:outline-none py-2 px-3 rounded border-2 w-max'
        />
      </div>

      <select
        className='w-full h-10 pl-3 pr-6 text-base placeholder-gray-600 border rounded-lg focus:outline-none active:outline-none cursor-pointer'
        onChange={handleNodeTypeChange}
        value={newNodeType}
      >
        <option value={FormNodeTypes.TEXT_NODE}>Texto</option>
        <option value={FormNodeTypes.INPUT_NODE}>Entrada de Dados</option>
        <option value={FormNodeTypes.SELECTION_NODE}>Seleção</option>
        <option value={FormNodeTypes.ATTACHMENT_NODE}>Anexo</option>
      </select>
      {newNodeType === FormNodeTypes.TEXT_NODE && (
        <>
          <input
            type='text'
            value={newNodeTitle}
            onChange={(e) => setNewNodeTitle(e.target.value)}
            placeholder='Título do Campo'
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
          />
          <input
            type='text'
            value={newNodeSubtitle}
            onChange={(e) => setNewNodeSubtitle(e.target.value)}
            placeholder='Subtítulo do Campo'
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
          />
          <textarea
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
            rows={3}
            value={newNodeText}
            onChange={(e) => setNewNodeText(e.target.value)}
            placeholder='Texto'
          />
        </>
      )}
      {newNodeType === FormNodeTypes.INPUT_NODE && (
        <>
          <input
            type='text'
            value={newNodeTitle}
            onChange={(e) => setNewNodeTitle(e.target.value)}
            placeholder='Título do Campo'
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
          />
          <input
            type='text'
            value={newNodeSubtitle}
            onChange={(e) => setNewNodeSubtitle(e.target.value)}
            placeholder='Subtítulo do Campo'
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
          />
          <textarea
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
            rows={3}
            value={newNodeText}
            onChange={(e) => setNewNodeText(e.target.value)}
            placeholder='Texto'
          />
        </>
      )}
      {newNodeType === FormNodeTypes.SELECTION_NODE && (
        <>
          <input
            type='text'
            value={newNodeTitle}
            onChange={(e) => setNewNodeTitle(e.target.value)}
            placeholder='Título do Campo'
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
          />
          <input
            type='text'
            value={newNodeSubtitle}
            onChange={(e) => setNewNodeSubtitle(e.target.value)}
            placeholder='Subtítulo do Campo'
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
          />
          <textarea
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
            rows={3}
            value={newNodeText}
            onChange={(e) => setNewNodeText(e.target.value)}
            placeholder='Texto'
          />
          {/* Tags */}
          <div className='w-full'>
            <input
              type='text'
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder='Possíveis Respostas'
              className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full '
            />
            {newNodePossibleSelectionValues &&
              newNodePossibleSelectionValues.map(({ value, default: defaultValue }) => {
                return (
                  <Tag
                    key={value}
                    value={value}
                    defaultValue={defaultValue}
                    handleRemoveTag={handleRemoveTag}
                    handleTagDefaultChange={handleTagDefaultChange}
                  />
                );
              })}
          </div>
        </>
      )}
      {newNodeType === FormNodeTypes.ATTACHMENT_NODE && (
        <>
          <input
            type='text'
            value={newNodeTitle}
            onChange={(e) => setNewNodeTitle(e.target.value)}
            placeholder='Título do Campo'
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
          />
          <input
            type='text'
            value={newNodeSubtitle}
            onChange={(e) => setNewNodeSubtitle(e.target.value)}
            placeholder='Subtítulo do Campo'
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
          />
          <textarea
            className='appearance-none focus:outline-none py-2  px-3 rounded border-2 w-full'
            rows={3}
            value={newNodeText}
            onChange={(e) => setNewNodeText(e.target.value)}
            placeholder='Texto'
          />
        </>
      )}
      <div className='mt-5'>
        <div className='flex flex-row gap-5 justify-end items-center'>
          <Button onClick={closeModal}>Cancelar</Button>
          <Button primary onClick={addNode}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewFormNodeModal;
