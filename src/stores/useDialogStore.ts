import { create } from 'zustand';

type DialogType = 'alert' | 'confirm';

interface DialogState {
  isVisible: boolean;
  type: DialogType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  resolve: ((value: boolean) => void) | null;
  
  // Actions
  alert: (title: string, message?: string, confirmText?: string) => Promise<boolean>;
  confirm: (title: string, message?: string, confirmText?: string, cancelText?: string) => Promise<boolean>;
  close: (result: boolean) => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  isVisible: false,
  type: 'alert',
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  resolve: null,

  alert: (title, message, confirmText = '확인') => {
    return new Promise((resolve) => {
      set({
        isVisible: true,
        type: 'alert',
        title,
        message,
        confirmText,
        resolve,
      });
    });
  },

  confirm: (title, message, confirmText = '확인', cancelText = '취소') => {
    return new Promise((resolve) => {
      set({
        isVisible: true,
        type: 'confirm',
        title,
        message,
        confirmText,
        cancelText,
        resolve,
      });
    });
  },

  close: (result: boolean) => {
    const { resolve } = get();
    if (resolve) {
      resolve(result);
    }
    set({
      isVisible: false,
      resolve: null,
      // Reset texts to defaults for next usage to avoid stale data flashing
      confirmText: '확인',
      cancelText: '취소',
    });
  },
}));
