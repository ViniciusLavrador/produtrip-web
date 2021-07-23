import { LoadingAnimation, Typography } from 'components';
import Layout from 'components/Layout/Layout';
import { useApi } from 'hooks';
import { useRouter } from 'next/router';

import cx from 'classnames';
import DynamicFormNode from 'components/DynamicForm/DynamicFormNode';
import Link from 'next/link';

export interface SingleFormPageProps {}

export const SingleFormPage = ({}: SingleFormPageProps) => {
  const { query } = useRouter();

  let projectID = query['projectID'] ? Buffer.from(query['projectID'] as string, 'base64').toString() : undefined;
  let formID = query['id'] ? Buffer.from(query['id'] as string, 'base64').toString() : undefined;

  const { data: formData, isLoading: fomrIsLoading, error: formError } = useApi(`forms/${formID}`);
  const { data: projectData, isLoading: projectIsLoading, error: projectError } = useApi(`projects/${projectID}?r=company`);

  if (!formData || fomrIsLoading || !projectData || projectIsLoading) {
    return <LoadingAnimation />;
  }

  console.log(formData);

  const rootClasses = cx('flex flex-col items-center w-full gap-3 divide-y');

  return (
    <Layout>
      <Layout.Header
        breadcrumb={{
          main: { title: formData.title },
          list: [
            { title: projectData.company.name, href: `/customers/${Buffer.from(projectData.company.id).toString('base64')}` },
            { title: projectData.name, href: `/projects/${query['projectID']}` },
            { title: 'Formulários', href: `/forms?projectID=${query['projectID']}` },
          ],
        }}
      />
      <Layout.Content>
        {formData.nodes.length > 0 ? (
          <div className={rootClasses}>
            {formData.nodes
              .sort((a, b) => a.priority - b.priority)
              .map((node) => {
                return (
                  <div className='my-2 w-full'>
                    <DynamicFormNode key={node.id} node={node} />
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
    </Layout>
  );
};

export default SingleFormPage;
