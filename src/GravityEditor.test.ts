import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/svelte';
import { tick } from 'svelte';
import GravityEditor from './GravityEditor.svelte';

describe('GravityEditor Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders an input field with placeholder', () => {
    render(GravityEditor);
    const input = screen.getByPlaceholderText('Start typing...');
    expect(input).toBeInTheDocument();
  });

  it('renders one letter span per character typed', async () => {
    render(GravityEditor);
    const input = screen.getByPlaceholderText('Start typing...');

    await fireEvent.input(input, { target: { value: 'abc' } });

    const letterSpans = document.querySelectorAll('.letter');
    expect(letterSpans).toHaveLength(3);
    expect(letterSpans[0].textContent).toBe('a');
    expect(letterSpans[1].textContent).toBe('b');
    expect(letterSpans[2].textContent).toBe('c');
  });

  it('renders spaces as non-breaking spaces', async () => {
    render(GravityEditor);
    const input = screen.getByPlaceholderText('Start typing...');

    await fireEvent.input(input, { target: { value: 'a b' } });

    const letterSpans = document.querySelectorAll('.letter');
    expect(letterSpans).toHaveLength(3);
    expect(letterSpans[1].textContent).toBe('\u00A0');
  });

  it('shows letter container when gravity activates after idle timeout', async () => {
    render(GravityEditor);
    const input = screen.getByPlaceholderText('Start typing...');

    await fireEvent.input(input, { target: { value: 'hi' } });

    const container = document.querySelector('.letter-container');
    expect(container).not.toHaveClass('active');

    // Activate gravity after idle timeout
    await act(() => {
      vi.advanceTimersByTime(1500);
    });
    await tick();

    expect(container).toHaveClass('active');
  });

  it('hides input when gravity is active', async () => {
    render(GravityEditor);
    const input = screen.getByPlaceholderText('Start typing...');

    await fireEvent.input(input, { target: { value: 'test' } });

    expect(input).not.toHaveClass('hidden');

    await act(() => {
      vi.advanceTimersByTime(1500);
    });
    await tick();

    expect(input).toHaveClass('hidden');
  });

  it('deactivates gravity and resets on click', async () => {
    render(GravityEditor);
    const input = screen.getByPlaceholderText('Start typing...');
    const editor = document.querySelector('.gravity-editor')!;

    await fireEvent.input(input, { target: { value: 'hi' } });

    await act(() => {
      vi.advanceTimersByTime(1500);
    });
    await tick();
    expect(document.querySelector('.letter-container')).toHaveClass('active');

    await fireEvent.click(editor);
    await tick();

    expect(document.querySelector('.letter-container')).not.toHaveClass(
      'active',
    );
    expect(input).not.toHaveClass('hidden');
  });
});
