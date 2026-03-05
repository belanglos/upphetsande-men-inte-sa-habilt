import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createGravityTimer, IDLE_TIMEOUT } from './gravityTimer';

describe('gravityTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fires the callback after the idle timeout (1500ms)', () => {
    const callback = vi.fn();
    createGravityTimer(callback);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(IDLE_TIMEOUT);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('does not fire the callback before 1500ms', () => {
    const callback = vi.fn();
    createGravityTimer(callback);

    vi.advanceTimersByTime(IDLE_TIMEOUT - 1);

    expect(callback).not.toHaveBeenCalled();
  });

  it('resets the timer on keypress (reset call)', () => {
    const callback = vi.fn();
    const timer = createGravityTimer(callback);

    // Advance partway through
    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();

    // Reset simulates keypress
    timer.reset();

    // Original timeout would have fired by now
    vi.advanceTimersByTime(600);
    expect(callback).not.toHaveBeenCalled();

    // Full timeout from reset point
    vi.advanceTimersByTime(900);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('can be stopped completely', () => {
    const callback = vi.fn();
    const timer = createGravityTimer(callback);

    timer.stop();

    vi.advanceTimersByTime(IDLE_TIMEOUT * 3);

    expect(callback).not.toHaveBeenCalled();
  });

  it('uses the correct idle timeout constant of 1500ms', () => {
    expect(IDLE_TIMEOUT).toBe(1500);
  });
});
