import { atom } from 'recoil';

export enum atomKeys {
  SELECTED_FORM_ATOM = 'selectedFormAtom',
  VISIT_IN_PROGRESS_ATOM = 'visitInProgressAtom',
  MODAL_OPEN_ATOM = 'modalOpenAtom',
}

export const selectedFormAtom = atom<string | undefined>({
  key: atomKeys.SELECTED_FORM_ATOM,
  default: undefined,
});

export const visitInProgressAtom = atom<{ [key: string]: any } | undefined>({
  key: atomKeys.VISIT_IN_PROGRESS_ATOM,
  default: undefined,
});

export const modalOpenAtom = atom<string[]>({
  key: atomKeys.MODAL_OPEN_ATOM,
  default: [],
});
