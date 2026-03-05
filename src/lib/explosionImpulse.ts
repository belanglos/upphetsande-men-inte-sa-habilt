import Matter from 'matter-js';

const EXPLOSION_MAGNITUDE = 0.05;

export interface ExplosionOptions {
  magnitude?: number;
}

export function applyExplosionImpulse(
  bodies: Matter.Body[],
  epicenter: { x: number; y: number },
  options: ExplosionOptions = {},
): void {
  const magnitude = options.magnitude ?? EXPLOSION_MAGNITUDE;

  for (const body of bodies) {
    if (body.isStatic) continue;

    const dx = body.position.x - epicenter.x;
    const dy = body.position.y - epicenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) continue;

    const normalizedX = dx / distance;
    const normalizedY = dy / distance;

    const forceMagnitude = magnitude / Math.max(distance * 0.01, 0.1);

    Matter.Body.applyForce(body, body.position, {
      x: normalizedX * forceMagnitude,
      y: normalizedY * forceMagnitude,
    });
  }
}

export { EXPLOSION_MAGNITUDE };
