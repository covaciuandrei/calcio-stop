import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
interface CounterState {
  // State
  count: number;
  step: number;
  history: number[];
  maxHistory: number;

  // Actions
  increment: () => void;
  decrement: () => void;
  incrementBy: (value: number) => void;
  decrementBy: (value: number) => void;
  reset: () => void;
  setStep: (step: number) => void;
  setCount: (count: number) => void;
  clearHistory: () => void;
  undo: () => void;
}

// Selectors
export const counterSelectors = {
  isPositive: (state: CounterState) => state.count > 0,
  isNegative: (state: CounterState) => state.count < 0,
  isZero: (state: CounterState) => state.count === 0,
  canUndo: (state: CounterState) => state.history.length > 0,
  getLastValue: (state: CounterState) => state.history[state.history.length - 1] || 0,
};

// Store with persistence
export const useCounterStore = create<CounterState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        count: 0,
        step: 1,
        history: [],
        maxHistory: 10,

        // Actions
        increment: () => {
          const { count, step, history, maxHistory } = get();
          const newHistory = [...history, count].slice(-maxHistory);

          set({
            count: count + step,
            history: newHistory,
          });
        },

        decrement: () => {
          const { count, step, history, maxHistory } = get();
          const newHistory = [...history, count].slice(-maxHistory);

          set({
            count: count - step,
            history: newHistory,
          });
        },

        incrementBy: (value: number) => {
          const { count, history, maxHistory } = get();
          const newHistory = [...history, count].slice(-maxHistory);

          set({
            count: count + value,
            history: newHistory,
          });
        },

        decrementBy: (value: number) => {
          const { count, history, maxHistory } = get();
          const newHistory = [...history, count].slice(-maxHistory);

          set({
            count: count - value,
            history: newHistory,
          });
        },

        reset: () => {
          const { count, history, maxHistory } = get();
          const newHistory = [...history, count].slice(-maxHistory);

          set({
            count: 0,
            history: newHistory,
          });
        },

        setStep: (step: number) => {
          set({ step: Math.max(1, step) }); // Ensure step is at least 1
        },

        setCount: (count: number) => {
          const { history, maxHistory } = get();
          const currentCount = get().count;
          const newHistory = [...history, currentCount].slice(-maxHistory);

          set({
            count,
            history: newHistory,
          });
        },

        clearHistory: () => {
          set({ history: [] });
        },

        undo: () => {
          const { history } = get();
          if (history.length > 0) {
            const previousValue = history[history.length - 1];
            const newHistory = history.slice(0, -1);

            set({
              count: previousValue,
              history: newHistory,
            });
          }
        },
      }),
      {
        name: 'counter-store', // localStorage key
        // Only persist count and step, not history
        partialize: (state) => ({
          count: state.count,
          step: state.step,
        }),
      }
    ),
    {
      name: 'counter-store', // DevTools name
    }
  )
);

// Typed selectors for easier usage
export const useCounter = () => useCounterStore();
export const useCounterValue = () => useCounterStore((state) => state.count);
export const useCounterActions = () =>
  useCounterStore((state) => ({
    increment: state.increment,
    decrement: state.decrement,
    incrementBy: state.incrementBy,
    decrementBy: state.decrementBy,
    reset: state.reset,
    undo: state.undo,
  }));
export const useCounterConfig = () =>
  useCounterStore((state) => ({
    step: state.step,
    setStep: state.setStep,
    history: state.history,
    clearHistory: state.clearHistory,
  }));
