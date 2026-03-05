import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Matter from 'matter-js';
import { applyExplosionImpulse } from './explosionImpulse';

describe('explosionImpulse', () => {
  let applyForceSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    applyForceSpy = vi.spyOn(Matter.Body, 'applyForce');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('applies outward force away from the epicenter', () => {
    const body = Matter.Bodies.rectangle(200, 100, 20, 20);
    const epicenter = { x: 100, y: 100 };

    applyExplosionImpulse([body], epicenter);

    expect(applyForceSpy).toHaveBeenCalledTimes(1);
    const [, , force] = applyForceSpy.mock.calls[0];

    // Body is to the right of epicenter, so force.x should be positive
    expect(force.x).toBeGreaterThan(0);
    // Body is at the same y as epicenter, so force.y should be ~0
    expect(Math.abs(force.y)).toBeLessThan(0.001);
  });

  it('calculates correct direction for body above epicenter', () => {
    const body = Matter.Bodies.rectangle(100, 50, 20, 20);
    const epicenter = { x: 100, y: 200 };

    applyExplosionImpulse([body], epicenter);

    const [, , force] = applyForceSpy.mock.calls[0];

    // Body is above epicenter, so force.y should be negative (upward)
    expect(force.y).toBeLessThan(0);
    // Body is at same x, so force.x should be ~0
    expect(Math.abs(force.x)).toBeLessThan(0.001);
  });

  it('applies force to multiple bodies', () => {
    const body1 = Matter.Bodies.rectangle(200, 100, 20, 20);
    const body2 = Matter.Bodies.rectangle(50, 100, 20, 20);
    const epicenter = { x: 100, y: 100 };

    applyExplosionImpulse([body1, body2], epicenter);

    expect(applyForceSpy).toHaveBeenCalledTimes(2);

    // body1 is right of epicenter -> positive x
    expect(applyForceSpy.mock.calls[0][2].x).toBeGreaterThan(0);
    // body2 is left of epicenter -> negative x
    expect(applyForceSpy.mock.calls[1][2].x).toBeLessThan(0);
  });

  it('skips static bodies', () => {
    const body = Matter.Bodies.rectangle(200, 100, 20, 20, { isStatic: true });
    const epicenter = { x: 100, y: 100 };

    applyExplosionImpulse([body], epicenter);

    expect(applyForceSpy).not.toHaveBeenCalled();
  });

  it('respects custom magnitude option', () => {
    const body = Matter.Bodies.rectangle(200, 100, 20, 20);
    const epicenter = { x: 100, y: 100 };

    applyExplosionImpulse([body], epicenter, { magnitude: 0.1 });

    const [, , force1] = applyForceSpy.mock.calls[0];

    applyForceSpy.mockClear();

    applyExplosionImpulse([body], epicenter, { magnitude: 0.2 });

    const [, , force2] = applyForceSpy.mock.calls[0];

    // Double magnitude should produce double force
    expect(Math.abs(force2.x)).toBeGreaterThan(Math.abs(force1.x));
  });
});
