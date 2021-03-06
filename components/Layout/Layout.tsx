import { BreadcrumbItemProps, Breadcrumbs } from 'components/Breadcrumbs';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, ReactNode } from 'react';
import { useRecoilState } from 'recoil';
import { modalOpenAtom } from 'recoil/atoms';

// Layout Modal
export interface LayoutModalProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export const LayoutModal = ({ children, id, className }: LayoutModalProps) => {
  const [modalOpenState, setModalOpenState] = useRecoilState(modalOpenAtom);

  // Set Listener to Close Modal on ESC
  useEffect(() => {
    const close = (e) => {
      if (e.keyCode === 27) {
        setModalOpenState([...modalOpenState.filter((x) => x != id)]);
      }
    };

    window.addEventListener('keydown', close);

    return () => window.removeEventListener('keydown', close);
  }, []);

  return (
    <AnimatePresence>
      {modalOpenState.includes(id) && (
        <>
          <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
            <div className='relative my-6 mx-auto w-[48rem]'>
              <motion.div
                initial='closed'
                animate='open'
                exit='closed'
                variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
                className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none ${className}`}
              >
                {children}
              </motion.div>
            </div>
          </div>
          <div className='opacity-25 fixed inset-0 z-40 bg-black' />
        </>
      )}
    </AnimatePresence>
  );
};

// Layout FAB
export interface LayoutFABProps {
  children: React.ReactNode;
}

export const LayoutFAB = ({ children }: LayoutFABProps) => {
  return <div className='fixed bottom-10 right-10 flex flex-row gap-5'>{children}</div>;
};

// Layout Header
export interface LayoutHeaderProps {
  breadcrumb?: {
    list?: Omit<BreadcrumbItemProps, 'subtitle'>[];
    main: Omit<BreadcrumbItemProps, 'href'>;
  };
  children?: ReactNode;
}

export const LayoutHeader = ({ breadcrumb, children }: LayoutHeaderProps) => {
  return (
    <div className='w-full mb-5'>
      {breadcrumb && (
        <Breadcrumbs>
          {breadcrumb.list &&
            breadcrumb.list.map((item, index) => (
              <Breadcrumbs.ListItem key={index.toString()} title={item.title} href={item.href} />
            ))}
          <Breadcrumbs.MainItem title={breadcrumb.main.title} subtitle={breadcrumb.main.subtitle} />
        </Breadcrumbs>
      )}
      {children}
    </div>
  );
};

// Layout Content
export interface LayoutContentProps {
  children?: ReactNode;
}

export const LayoutContent = ({ children }: LayoutContentProps) => {
  return <div className='w-full'>{children}</div>;
};

// Layout Component
export interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return <div className='h-full w-full'>{children}</div>;
};

Layout.Header = LayoutHeader;
Layout.Content = LayoutContent;
Layout.FABRow = LayoutFAB;
Layout.Modal = LayoutModal;
export default Layout;
