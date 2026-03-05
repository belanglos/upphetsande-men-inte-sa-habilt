import { describe, it, expect } from 'vitest';
import Matter from 'matter-js';
import { syncLetterPositions, applyPositionsToDOM } from './letterSync';

describe('letterSync', () => {
  describe('syncLetterPositions', () => {
    it('extracts x, y, and angle from Matter.js bodies', () => {
      const body = Matter.Bodies.rectangle(150, 200, 20, 20);
      Matter.Body.setAngle(body, 0.5);

      const positions = syncLetterPositions([body]);

      expect(positions).toHaveLength(1);
      expect(positions[0].x).toBeCloseTo(150);
      expect(positions[0].y).toBeCloseTo(200);
      expect(positions[0].angle).toBeCloseTo(0.5);
    });

    it('syncs multiple bodies in order', () => {
      const body1 = Matter.Bodies.rectangle(10, 20, 20, 20);
      const body2 = Matter.Bodies.rectangle(30, 40, 20, 20);
      const body3 = Matter.Bodies.rectangle(50, 60, 20, 20);

      const positions = syncLetterPositions([body1, body2, body3]);

      expect(positions).toHaveLength(3);
      expect(positions[0].x).toBeCloseTo(10);
      expect(positions[1].x).toBeCloseTo(30);
      expect(positions[2].x).toBeCloseTo(50);
    });

    it('returns empty array for empty input', () => {
      const positions = syncLetterPositions([]);
      expect(positions).toEqual([]);
    });
  });

  describe('applyPositionsToDOM', () => {
    it('sets transform, position, left, and top on DOM elements', () => {
      const el = document.createElement('span');
      const positions = [{ x: 100, y: 200, angle: 0.3 }];

      applyPositionsToDOM([el], positions);

      expect(el.style.transform).toBe(
        'translate(100px, 200px) rotate(0.3rad)',
      );
      expect(el.style.position).toBe('absolute');
      expect(el.style.left).toBe('0px');
      expect(el.style.top).toBe('0px');
    });

    it('handles multiple elements and positions', () => {
      const el1 = document.createElement('span');
      const el2 = document.createElement('span');
      const positions = [
        { x: 10, y: 20, angle: 0 },
        { x: 30, y: 40, angle: 1.5 },
      ];

      applyPositionsToDOM([el1, el2], positions);

      expect(el1.style.transform).toBe('translate(10px, 20px) rotate(0rad)');
      expect(el2.style.transform).toBe('translate(30px, 40px) rotate(1.5rad)');
    });

    it('handles mismatched array lengths safely', () => {
      const el1 = document.createElement('span');
      const el2 = document.createElement('span');
      const positions = [{ x: 10, y: 20, angle: 0 }];

      // Should not throw — only applies to min(elements, positions)
      expect(() => applyPositionsToDOM([el1, el2], positions)).not.toThrow();
      expect(el1.style.transform).toBe('translate(10px, 20px) rotate(0rad)');
      expect(el2.style.transform).toBe('');
    });
  });
});
