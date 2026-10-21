import * as RadixToast from "@radix-ui/react-toast";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { closeIcon, toneIcons, type Tone } from "../internal/ToneIcons";
import styles from "./Toast.module.css";

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  /** Defaults to `info`. `danger` and `warning` are announced immediately. */
  tone?: Tone;
  /** Milliseconds before it closes itself. Defaults to the provider's `duration`. */
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
  open: boolean;
}

interface ToastContextValue {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => number;
  /** Closes the toast with that id. */
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** How long a closed toast stays mounted so its exit animation can play. */
const EXIT_MS = 300;

export interface ToastProviderProps {
  children: ReactNode;
  /** Accessible name of each toast's close button, for example "Close". */
  closeLabel: string;
  /** Accessible name of the notifications region. Radix replaces `{hotkey}` with "F8". */
  viewportLabel?: string;
  /** Announced before each toast so screen-reader users know it is a notification. Defaults to Radix's English "Notification"; pass a translation. */
  toastLabel?: string;
  /** Default time on screen in milliseconds. */
  duration?: number;
}

/**
 * Mount once near the root of your app, then call `useToast().toast(...)`
 * from anywhere below it. `danger` and `warning` toasts are announced
 * assertively, the others politely. Hovering or focusing a toast pauses it;
 * F8 jumps to the notifications region.
 */
export function ToastProvider({ children, closeLabel, viewportLabel, toastLabel, duration = 5000 }: ToastProviderProps) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const close = useCallback((id: number) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, open: false } : item)));
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setItems((current) => current.filter((item) => item.id !== id));
    }, EXIT_MS);
    timers.current.add(timer);
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = nextId.current++;
    setItems((current) => [...current, { ...options, id, open: true }]);
    return id;
  }, []);

  const value = useMemo(() => ({ toast, dismiss: close }), [toast, close]);

  return (
    <ToastContext.Provider value={value}>
      <RadixToast.Provider swipeDirection="right" duration={duration} label={toastLabel}>
        {children}
        {items.map((item) => {
          const tone = item.tone ?? "info";
          return (
            <RadixToast.Root
              key={item.id}
              open={item.open}
              onOpenChange={(open) => !open && close(item.id)}
              duration={item.duration}
              type={tone === "danger" || tone === "warning" ? "foreground" : "background"}
              className={`${styles.toast} ${styles[tone]}`}
            >
              <span className={styles.icon} aria-hidden="true">
                {toneIcons[tone]}
              </span>
              <div className={styles.content}>
                <RadixToast.Title className={styles.title}>{item.title}</RadixToast.Title>
                {item.description && (
                  <RadixToast.Description className={styles.description}>{item.description}</RadixToast.Description>
                )}
              </div>
              <RadixToast.Close className={styles.close} aria-label={closeLabel}>
                <span className={styles.closeIcon} aria-hidden="true">
                  {closeIcon}
                </span>
              </RadixToast.Close>
            </RadixToast.Root>
          );
        })}
        <RadixToast.Viewport className={styles.viewport} label={viewportLabel} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

/** Returns `{ toast, dismiss }`. Must be used inside a `ToastProvider`. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>");
  return ctx;
}
