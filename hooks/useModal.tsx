import { useRecoilState } from 'recoil';
import { modalOpenAtom } from 'recoil/atoms';

export const useModal = (id: string) => {
  const [modalOpenState, setModalOpenState] = useRecoilState(modalOpenAtom);

  return {
    openModal: () => {
      if (modalOpenState.includes(id)) {
        return;
      }
      setModalOpenState([...modalOpenState, id]);
    },
    closeModal: () => {
      if (!modalOpenState.includes(id)) {
        return;
      }
      setModalOpenState([...modalOpenState.filter((x) => x !== id)]);
    },
  };
};
