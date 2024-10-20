import type { ComponentType, ReactElement } from "react";
import { useCallback, useMemo, createContext, useRef, useState } from "react";

export type AsyncModalPropsBase = Record<string, unknown>;

export interface AsyncModalProps<R, P extends AsyncModalPropsBase | undefined = undefined> {
  readonly onClose: (result?: R) => void;
  dismissible: boolean;
  data?: P;
}

interface ShowModalParams<R, P extends AsyncModalPropsBase | undefined = undefined> {
  modal: ComponentType<AsyncModalProps<R, P>>;
  dismissible?: boolean;
  data?: P;
}

export interface ModalContextType {
  showModal: <R, P extends AsyncModalPropsBase | undefined = undefined>(
    params: ShowModalParams<R, P>
  ) => Promise<R | undefined>;
}

interface PromiseRef {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}

interface AsyncModalProviderProps {
  readonly children: ReactElement;
}

export const ModalContext = createContext<ModalContextType | null>(null);

export function AsyncModalProvider<R, P extends AsyncModalPropsBase | undefined = undefined>({
  children
}: AsyncModalProviderProps): ReactElement {
  const [renderModal, setRenderModal] = useState<ShowModalParams<R, P> | null>(null);
  const promiseRef = useRef<PromiseRef | null>(null);

  const showModal = useCallback(async (params: ShowModalParams<R, P>) => {
    setRenderModal(params);

    return new Promise((resolve, reject) => {
      promiseRef.current = { resolve, reject };
    });
  }, []);

  const handleClose = (result?: R): void => {
    if (promiseRef.current !== null) {
      promiseRef.current.resolve(result);
    }

    promiseRef.current = null;

    setRenderModal(null);
  };

  const memValue = useMemo(() => {
    return { showModal };
  }, [showModal]);

  return (
    <ModalContext.Provider value={memValue as ModalContextType}>
      {children}

      {renderModal !== null ? (
        <renderModal.modal
          onClose={handleClose}
          dismissible={renderModal.dismissible ?? true}
          data={renderModal.data}
        />
      ) : null}
    </ModalContext.Provider>
  );
}
