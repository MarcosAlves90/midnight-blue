import { toast as rtToast, ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 15000,
  className: "notification-toast",
};

export const toast = {
  success: (msg: string) => rtToast.success(msg, baseOptions),
  error: (msg: string) => rtToast.error(msg, baseOptions),
  info: (msg: string) => rtToast.info(msg, baseOptions),
};

export function authSuccess(message: string) {
  rtToast.success(message, baseOptions);
}

export function authError(message: string) {
  rtToast.error(message, baseOptions);
}

export function authInfo(message: string) {
  rtToast.info(message, baseOptions);
}
