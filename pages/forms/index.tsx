import { Button, LoadingAnimation, Tooltip } from 'components';
import { Layout } from 'components/Layout/Layout';
import { Typography } from 'components';
import { useApi } from 'hooks';
import { useRouter } from 'next/router';

import cx from 'classnames';
import DynamicFormNode from 'components/DynamicForm/DynamicFormNode';

import { useRecoilState } from 'recoil';
import { modalOpenAtom, selectedFormAtom } from 'recoil/atoms';
import axios from 'axios';
import Link from 'next/link';
import { SumOutlineIcon } from 'public/icons/outline';
import { useState } from 'react';
import { useModal } from 'hooks/useModal';
import { toast } from 'react-toastify';

//#region formlist
export interface FormListProps {
  forms: any[];
  className?: string;
  projectID?: string;
}

const FormList = ({ forms, className, projectID }: FormListProps) => {
  const [selectedForm, setSelectedForm] = useRecoilState(selectedFormAtom);

  const FormListItem = ({ form, selected }: { form: { id: string; title: string }; selected: string }) => {
    const isSelected = selected == form.id;

    const itemClasses = cx(
      'p-2 w-full rounded my-5 cursor-pointer shadow-lg active:shadow-none select-none',
      { 'bg-yellow-300 hover:bg-yellow-500': !isSelected },
      { 'bg-yellow-500 hover:bg-yellow-300': isSelected }
    );
    return (
      <Link href={`/forms/${Buffer.from(form.id).toString('base64')}?projectID=${projectID}`}>
        <li className={itemClasses} key={form.id}>
          <Typography variant='p'>{form.title}</Typography>
        </li>
      </Link>
    );
  };

  return (
    <ul className='w-full text-center overflow-y-scroll first:mt-0'>
      {forms.map((form) => {
        return <FormListItem form={form} selected={selectedForm} key={form.id} />;
      })}
    </ul>
  );
};

//#endregion

//#region formspage
export interface FormsPageProps {}

export const FormsPage = ({}: FormsPageProps) => {
  const { openModal, closeModal } = useModal('newFormModal');

  const [newFormTitle, setNewFormTitle] = useState<string | undefined>(undefined);

  const { query } = useRouter();
  let projectID = query['projectID'] ? Buffer.from(query['projectID'] as string, 'base64').toString() : undefined;

  // const [selectedForm] = useRecoilState(selectedFormAtom);

  const { data: projectData, error: projectError, isLoading: projectLoading } = useApi(`projects/${projectID}?r=company&r=forms`);

  const saveNewForm = async (title?: string) => {
    if (!title || title === '') return;
    axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/forms`, { title: title, project: projectID }).catch((err) => {
      console.error(err);
      toast.error('Não conseguimos criar o formulário agora. Tente novamente dentro de alguns instantes.');
    });
  };

  if (!projectData || projectLoading) {
    return <LoadingAnimation />;
  }

  return (
    <Layout>
      <Layout.Header
        breadcrumb={{
          main: { title: 'Formulários' },
          list: [
            {
              title: `${projectData.company.name}`,
              href: `/customers/${Buffer.from(projectData.company.id).toString('base64')}`,
            },
            { title: `${projectData.name}`, href: `/projects/${query['projectID']}` },
          ],
        }}
      />
      <Layout.Content>
        <FormList forms={projectData.forms} projectID={query['projectID'] as string} />
      </Layout.Content>
      <Layout.Modal id='newFormModal' className='py-5 px-3'>
        <div className='flex flex-col'>
          <Typography variant='h3' bold>
            Novo Formulário
          </Typography>
          <input
            type='text'
            value={newFormTitle}
            onChange={(e) => setNewFormTitle(e.target.value)}
            placeholder='Título do Formulário'
            className='appearance-none focus:outline-none py-2 my-5 px-3 rounded border-2 w-full'
          />
        </div>
        <div className='flex flex-row justify-end gap-3'>
          <Button label='Cancelar' onClick={closeModal} className='py-2' />
          <Button primary label='Salvar' onClick={() => saveNewForm(newFormTitle)} className='py-2' />
        </div>
      </Layout.Modal>

      <Layout.FABRow
        buttons={[
          {
            button: (
              <Button primary onClick={openModal} rounded>
                <SumOutlineIcon className='h-6 w-6' />
              </Button>
            ),
            tooltipContent: 'Adicionar Formulário',
          },
        ]}
      />
    </Layout>
  );
};

//#endregion

export default FormsPage;
