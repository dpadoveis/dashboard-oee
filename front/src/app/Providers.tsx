import type { ReactNode } from "react";
import { FilterProvider } from "../features/filters/FilterContext";
import { ToastProvider } from "../shared/contexts/ToastContext";
import { Toast } from "../components/common/Toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <FilterProvider>{children}</FilterProvider>
      <Toast />
    </ToastProvider>
  );
}
