import { toast } from 'react-toastify';

export const useClipboard = (
  alert: boolean = false,
  message: string = '✔️ Copiado com sucesso !'
): { copy(value: string): void } => {
  return {
    copy: (value: string) => {
      navigator.clipboard.writeText(value);
      alert && toast.success(message);
    },
  };
};

export default useClipboard;
