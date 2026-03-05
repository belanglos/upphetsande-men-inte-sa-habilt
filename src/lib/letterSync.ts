import Matter from 'matter-js';

export interface LetterPosition {
  x: number;
  y: number;
  angle: number;
}

export function syncLetterPositions(bodies: Matter.Body[]): LetterPosition[] {
  return bodies.map((body) => ({
    x: body.position.x,
    y: body.position.y,
    angle: body.angle,
  }));
}

export function applyPositionsToDOM(
  elements: HTMLElement[],
  positions: LetterPosition[],
): void {
  for (let i = 0; i < elements.length && i < positions.length; i++) {
    const pos = positions[i];
    elements[i].style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${pos.angle}rad)`;
    elements[i].style.position = 'absolute';
    elements[i].style.left = '0';
    elements[i].style.top = '0';
  }
}
