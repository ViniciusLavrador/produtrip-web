import { BreadcrumbItemProps, Breadcrumbs } from 'components/Breadcrumbs';
import { Button } from 'components/Button';
import { Tooltip } from 'components/Tooltip';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useEffect, ReactNode, cloneElement } from 'react';
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
                className={`border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-800 outline-none focus:outline-none ${className}`}
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
  buttons: {
    button: ReactNode;
    open?: boolean;
    tooltipContent?: string;
  }[];
}

const animatedButtonVariants: Variants = {
  open: { scale: 1 },
  close: { scale: 0 },
};

export const LayoutFAB = ({ buttons }: LayoutFABProps) => {
  const ClonedButton = ({ button, ...props }) => cloneElement(button, { ...props });

  return (
    <div className='fixed bottom-10 right-10 flex flex-row gap-5 z-50'>
      {buttons.map((button, index) => {
        if (button.open === undefined) {
          return (
            <Tooltip content={button.tooltipContent} placement='top' key={index}>
              <ClonedButton button={button.button} />
            </Tooltip>
          );
        }

        return (
          <motion.div variants={animatedButtonVariants} animate={button.open ? 'open' : 'close'} key={index}>
            <ClonedButton button={button.button} />
          </motion.div>
        );
      })}
    </div>
  );
};

// Layout Header
export interface LayoutHeaderProps {
  breadcrumb?: {
    list?: Omit<BreadcrumbItemProps, 'subtitle'>[];
    main: Omit<BreadcrumbItemProps, 'href'>;
  };
  leftComponent?: ReactNode;
  children?: ReactNode;
}

export const LayoutHeader = ({ breadcrumb, children, leftComponent }: LayoutHeaderProps) => {
  return (
    <div className='w-full mb-5 flex flex-row justify-between'>
      <div className=' flex flex-row gap-5 items-center justify-center'>
        {leftComponent}
        <div>
          {breadcrumb && (
            <Breadcrumbs>
              {breadcrumb.list &&
                breadcrumb.list.map((item, index) => (
                  <Breadcrumbs.ListItem key={index.toString()} title={item.title} href={item.href} />
                ))}
              <Breadcrumbs.MainItem title={breadcrumb.main.title} subtitle={breadcrumb.main.subtitle} />
            </Breadcrumbs>
          )}
        </div>
      </div>
      <div>{children}</div>
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
