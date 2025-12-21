import { toast, ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 15000,
  className: "notification-toast",
};

export function authSuccess(message: string) {
  toast.success(message, baseOptions);
}

export function authError(message: string) {
  toast.error(message, baseOptions);
}

export function authInfo(message: string) {
  toast.info(message, baseOptions);
}
