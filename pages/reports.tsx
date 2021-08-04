import { Typography } from 'components';
import { MenuAlt3OutlineIcon } from 'public/icons/outline';
import { ChartBarSolidIcon, LocationMarkerSolidIcon } from 'public/icons/solid';

interface ReportCardProps {
  title?: string;
  value?: string;
  icon?: React.ReactNode;
  className?: string;
  removeDate?: true;
}

const ReportCard = ({ value, icon, title, className, removeDate }: ReportCardProps) => {
  return (
    <div
      className={`h-40 w-64 flex flex-col items-center justify-between py-6 shadow rounded cursor-pointer 
      hover:shadow-md transform-gpu transition-all group ${className}`}
    >
      {icon}
      {value && (
        <Typography variant='h2' bold className='text-black'>
          {value}
        </Typography>
      )}
      <div className='text-center'>
        {title && (
          <Typography variant='h6' className='text-black'>
            {title}
          </Typography>
        )}
        {!removeDate && (
          <Typography variant='span' muted className='text-sm text-black'>
            {new Date(Date.now()).toLocaleString()}
          </Typography>
        )}
      </div>
    </div>
  );
};

export const ReportsPage = () => {
  return (
    <>
      <div className='flex flex-row gap-5 flex-wrap justify-center items-center'>
        <ReportCard value='60' title='Visitas Agendadas' className='!bg-gray-50 hover:!bg-white !h-28 !py-2' />
        <ReportCard value='30' title='Visitas Concluidas' className='!bg-green-100 hover:!bg-green-50 !h-28 !py-2' />
        <ReportCard value='5' title='Visitas em Andamento' className='!bg-yellow-100 hover:!bg-yellow-50 !h-28 !py-2' />
        <ReportCard value='0' title='Visitas Atrasadas' className='!bg-red-100 hover:!bg-red-50 !h-28 !py-2' />
      </div>
      <div className='flex flex-row gap-5 flex-wrap items-center mt-10'>
        <ReportCard
          icon={<LocationMarkerSolidIcon className='w-12 h-12 text-gray-300 group-hover:text-black' />}
          title='Cumprimento de Visitas'
          className='bg-gray-50'
          removeDate
        />
        <ReportCard
          icon={<ChartBarSolidIcon className='w-12 h-12 text-gray-300 group-hover:text-black' />}
          title='Justificativa de Ausências Percentual'
          className='bg-gray-50'
          removeDate
        />
        <ReportCard
          icon={<MenuAlt3OutlineIcon className='w-12 h-12 text-gray-300 group-hover:text-black' />}
          title='Justificativa de Ausências Total'
          className='bg-gray-50'
          removeDate
        />
        <ReportCard
          icon={<ChartBarSolidIcon className='w-12 h-12 text-gray-300 group-hover:text-black' />}
          title='Média Visitas x Colaborador'
          className='bg-gray-50 '
          removeDate
        />
        <ReportCard
          icon={<ChartBarSolidIcon className='w-12 h-12 text-gray-300 group-hover:text-black' />}
          title="PDV's Cadastrados x PDV's Agendados"
          className='bg-gray-50'
          removeDate
        />
        <ReportCard
          icon={<ChartBarSolidIcon className='w-12 h-12 text-gray-300 group-hover:text-black' />}
          title="PDV's em Projeto x PDV's Agendados"
          className='bg-gray-50'
          removeDate
        />
        <ReportCard
          icon={<MenuAlt3OutlineIcon className='w-12 h-12 text-gray-300 group-hover:text-black' />}
          title='Índice de Sucesso em Visitas'
          className='bg-gray-50 '
          removeDate
        />
        <ReportCard
          icon={<ChartBarSolidIcon className='w-12 h-12 text-gray-300 group-hover:text-black' />}
          title='Tempo Médio da Visita'
          className='bg-gray-50'
          removeDate
        />
      </div>
    </>
  );
};

export default ReportsPage;
