import { Button, LoadingAnimation, Typography } from 'components';
import Layout, { LayoutContent } from 'components/Layout/Layout';
import { useApi } from 'hooks';
import { useRouter } from 'next/router';

import cx from 'classnames';
import DynamicFormNode from 'components/DynamicForm/DynamicFormNode';
import Link from 'next/link';
import { SumOutlineIcon, XOutlineIcon } from 'public/icons/outline';
import { useModal } from 'hooks/useModal';
import NewFormNodeModal, { FormNodeTypes } from 'components/Modals/NewFormNodeModal';
import { LegacyRef, useState } from 'react';
import { FolderOpenSolidIcon, PencilSolidIcon } from 'public/icons/solid';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useEffect } from 'react';

interface Node {
  id?: string;
  type: FormNodeTypes;
  priority: number;
  text?: string;
  title?: string;
  subtitle?: string;
  selectOptions?: { id: string; text: string; default: boolean }[];
}
interface FormNodeProps {
  node: Node;
  removeNode?(nodeId: string): any;
  nodeIndex?: number;
}

const getNodeContent = (node: Node) => {
  const fileInputRef = useRef<HTMLInputElement>();

  switch (node.type) {
    case FormNodeTypes.TEXT_NODE:
      return (
        <>
          <Typography variant='span' bold className='select-none'>
            {node.title}
          </Typography>
          <Typography variant='span' muted className='select-none'>
            {node.subtitle}
          </Typography>
          <Typography variant='p' className={`select-none ${(node.title || node.subtitle) && 'mt-2'}`}>
            {node.text}
          </Typography>
        </>
      );
    case FormNodeTypes.INPUT_NODE:
      return (
        <div className='w-full items-center flex flex-row'>
          <div className='flex flex-col w-full'>
            <Typography variant='span' bold className='select-none'>
              {node.title}
            </Typography>
            <Typography variant='span' muted className='select-none'>
              {node.subtitle}
            </Typography>
            <Typography variant='p' className={`select-none ${(node.title || node.subtitle) && 'mt-2'}`}>
              {node.text}
            </Typography>
            <input
              type='text'
              readOnly
              className={`appearance-none focus:outline-none py-2 px-3 rounded border-2 w-full ${
                (node.title || node.subtitle) && 'mt-3'
              }`}
            />
          </div>
        </div>
      );
    case FormNodeTypes.SELECTION_NODE:
      return (
        <div className='w-full items-center flex flex-row'>
          <div className='flex flex-col w-full'>
            <Typography variant='span' bold className='select-none'>
              {node.title}
            </Typography>
            <Typography variant='span' muted className='select-none'>
              {node.subtitle}
            </Typography>
            <Typography variant='p' className={`select-none ${(node.title || node.subtitle) && 'mt-2'}`}>
              {node.text}
            </Typography>
            {node.selectOptions ? (
              <select
                className={`focus:outline-none py-2 px-3 rounded border-2 w-full ${
                  (node.title || node.subtitle || node.text) && 'mt-3'
                }`}
                value={node.selectOptions.find((s) => s.default).id}
                onChange={() => {}} // Purposely left empty so that the default value is fixed on the input ( simulate a readonly field )
              >
                {node.selectOptions &&
                  node.selectOptions.map((psv) => {
                    return (
                      <option value={psv.id} key={psv.id}>
                        {psv.text}
                      </option>
                    );
                  })}
              </select>
            ) : (
              <input
                type='text'
                readOnly
                placeholder={'Seleção - Nenhum Valor Definido'}
                className={`appearance-none focus:outline-none py-2 px-3 rounded border-2 w-full ${
                  (node.title || node.subtitle) && 'mt-3'
                }`}
              />
            )}
          </div>
        </div>
      );
    case FormNodeTypes.ATTACHMENT_NODE:
      return (
        <div className='w-full items-center flex flex-row justify-around'>
          <div className='flex flex-col w-full'>
            <Typography variant='span' bold className='select-none'>
              {node.title}
            </Typography>
            <Typography variant='span' muted className='select-none'>
              {node.subtitle}
            </Typography>
            <Typography variant='p' className={`select-none ${(node.title || node.subtitle) && 'mt-2'}`}>
              {node.text}
            </Typography>
          </div>
          <div>
            <label
              className={`w-52 flex flex-col items-center px-2 py-4 bg-yellow-100 rounded-md shadow-md tracking-wide uppercase border border-yellow cursor-pointer
             hover:bg-yellow-300 group ease-linear transition-all duration-150`}
            >
              <FolderOpenSolidIcon className='h-6 w-6 text-yellow-300 group-hover:text-white' />
              <Typography variant='span' className='text-yellow-300 group-hover:text-white leading-normal'>
                {fileInputRef.current && fileInputRef.current.files.length > 0
                  ? fileInputRef.current.files[0].name
                  : 'Selecionar Arquivo'}
              </Typography>
              <input type='file' className='hidden' ref={fileInputRef} />
            </label>
          </div>
        </div>
      );
  }
};

const FormNode = ({ node, removeNode, nodeIndex }: FormNodeProps) => {
  return (
    <div
      className='flex flex-row gap-3 group items-center px-3 py-2 dark:bg-gray-700 border-2 border-transparent hover:rounded hover:bg-yellow-50 
     hover:border-yellow-500 w-full m-0 box-border'
    >
      <Typography variant='span' bold className='mb-auto'>
        {nodeIndex + 1}. {/* Fix this */}
      </Typography>

      <div className='mr-auto w-full'>{getNodeContent(node)}</div>
      <div className='justify-self-end'>
        <button
          className='hidden group-hover:block text-black dark:text-white hover:text-red-500 dark:hover:text-red-500 active:outline-none focus:outline-none'
          onClick={() => removeNode(node.id)}
        >
          <XOutlineIcon className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
};

export interface SingleFormPageProps {}

export const SingleFormPage = ({}: SingleFormPageProps) => {
  const { query } = useRouter();
  const { openModal, closeModal } = useModal('newFormNodeModal');
  const { getAccessTokenSilently } = useAuth0();

  // Internal State

  // API
  let projectID = query['projectID'] ? Buffer.from(query['projectID'] as string, 'base64').toString() : undefined;
  let formID = query['id'] ? Buffer.from(query['id'] as string, 'base64').toString() : undefined;

  const {
    data: formData,
    isLoading: fomrIsLoading,
    error: formError,
    revalidate: revalidateFormFields,
  } = useApi(`forms/${formID}`);
  const { data: projectData, isLoading: projectIsLoading, error: projectError } = useApi(`projects/${projectID}?r=company`);

  // Render
  if (!formData || fomrIsLoading || !projectData || projectIsLoading) {
    return <LoadingAnimation />;
  }

  // handle Remove Node
  const removeNode = async (nodeId: string) => {
    const accessToken = await getAccessTokenSilently({
      audience: process.env.NEXT_PUBLIC_API_AUTH0_AUDIENCE,
    });
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_SERVER_DOMAIN}:3000/forms/${formData.id}/node/${nodeId}`, {
        headers: { Authentication: `Bearer ${accessToken}` },
      });

      toast.success('Campo Removido com Sucesso');
      await revalidateFormFields();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao Remover o Campo. Tente Novamente.');
    }
  };

  return (
    <Layout>
      <Layout.Header
        breadcrumb={{
          main: { title: formData.title },
          list: [
            { title: 'Clientes', href: '/customers' },
            { title: projectData.company.name, href: `/customers/${Buffer.from(projectData.company.id).toString('base64')}` },
            { title: projectData.name, href: `/projects/${query['projectID']}` },
            { title: 'Formulários', href: `/forms?projectID=${query['projectID']}` },
          ],
        }}
      />
      <Layout.Content>
        {formData.nodes.length > 0 ? (
          <div className='flex flex-col items-center w-full bg-white dark:bg-gray-700 p-0 rounded shadow overflow-scroll max-h-[550px]'>
            {formData.nodes
              .sort((a, b) => a.priority - b.priority)
              .map((node, i) => {
                return (
                  <div className='my-2 w-full' key={node.id}>
                    <FormNode key={node.id} node={node} removeNode={removeNode} nodeIndex={i} />
                  </div>
                );
              })}
          </div>
        ) : (
          <div className='flex flex-col mt-48 items-center justify-center'>
            <Typography variant='h3' bold muted>
              Nenhum Campo Encontrado. Comece Adicionando Campos
            </Typography>
          </div>
        )}
      </Layout.Content>
      <Layout.FABRow
        buttons={[
          {
            button: (
              <Button primary onClick={openModal} rounded key='new-field'>
                <SumOutlineIcon className='h-6 w-6' />
              </Button>
            ),
            tooltipContent: 'Adicionar Campo',
          },
        ]}
      />
      <Layout.Modal id='newFormNodeModal' className='py-5 px-3'>
        <NewFormNodeModal nodeAmount={formData.nodes.length} formID={formID} revalidateFormFields={revalidateFormFields} />
      </Layout.Modal>
    </Layout>
  );
};

export default SingleFormPage;
