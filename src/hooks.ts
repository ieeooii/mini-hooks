export type SetState<T> = (value: T | ((prev: T) => T)) => void;
export interface Ref<T> {
  current: T;
}
type Component = () => unknown;

let hooks: unknown[][] = [];
let cursor = 0;
let currentComponent: Component | undefined;

export function render(Component: Component): unknown {
  currentComponent = Component;
  cursor = 0;
  return Component();
}

export function useState<T>(initial: T | (() => T)): [T, SetState<T>] {
  const slot = cursor++;
  if (!(slot in hooks)) {
    const initialValue = typeof initial === "function" ? (initial as () => T)() : initial;
    hooks[slot] = [initialValue];
  }

  if (!hooks[slot][1]) {
    const setState: SetState<T> = (value) => {
      const prev = hooks[slot][0] as T;
      const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
      if (Object.is(prev, next)) return;
      hooks[slot][0] = next;
      if (currentComponent) render(currentComponent);
    };
    hooks[slot][1] = setState;
  }

  return [hooks[slot][0] as T, hooks[slot][1] as SetState<T>];
}

export function useRef<T>(initial: T): Ref<T> {
  const slot = cursor++;
  if (!(slot in hooks)) {
    hooks[slot] = [{ current: initial }];
  }
  return hooks[slot][0] as Ref<T>;
}

export function useEffect(effect: () => void, deps?: unknown[]): void {
  effect();
}

export function resetHooks(): void {
  hooks = [];
  cursor = 0;
  currentComponent = undefined;
}
