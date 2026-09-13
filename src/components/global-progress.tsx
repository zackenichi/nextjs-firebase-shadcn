'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import { Progress } from '@/components/ui/progress';

const ProgressContext = createContext<{ start: () => void; done: () => void } | null>(null);

export function GlobalProgressBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-100" aria-label="Loading">
      <Progress value={null} className="gap-0 rounded-none **:data-[slot=progress-track]:h-0.5 **:data-[slot=progress-track]:rounded-none" />
    </div>
  );
}

export function GlobalProgressProvider({ children }: { children: ReactNode }) {
  const [operations, setOperations] = useState(0);
  const start = useCallback(() => setOperations((count) => count + 1), []);
  const done = useCallback(() => setOperations((count) => Math.max(0, count - 1)), []);
  const value = useMemo(() => ({ start, done }), [start, done]);

  return <ProgressContext.Provider value={value}>{operations > 0 && <GlobalProgressBar />}{children}</ProgressContext.Provider>;
}

export function useGlobalProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useGlobalProgress must be used inside GlobalProgressProvider.');
  return context;
}
