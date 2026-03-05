const IDLE_TIMEOUT = 1500;

export type GravityTimerCallback = () => void;

export interface GravityTimer {
  reset: () => void;
  stop: () => void;
}

export function createGravityTimer(onIdle: GravityTimerCallback): GravityTimer {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  function start() {
    stop();
    timerId = setTimeout(() => {
      onIdle();
    }, IDLE_TIMEOUT);
  }

  function stop() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  function reset() {
    start();
  }

  start();

  return { reset, stop };
}

export { IDLE_TIMEOUT };
