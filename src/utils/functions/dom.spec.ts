import { describe, it, expect, vi } from 'vitest';
import { addListener } from './dom';

describe('addListener', () => {
  it('should add an event listener to the target', () => {
    const target = document.createElement('div');
    const listener = vi.fn();

    const cleanup = addListener(target, 'click', listener);

    target.dispatchEvent(new Event('click'));

    expect(listener).toHaveBeenCalledTimes(1);

    cleanup();

    target.dispatchEvent(new Event('click'));

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should work with window as target', () => {
    const listener = vi.fn();

    const cleanup = addListener(window, 'resize', listener);

    window.dispatchEvent(new Event('resize'));

    expect(listener).toHaveBeenCalledTimes(1);

    cleanup();

    window.dispatchEvent(new Event('resize'));

    expect(listener).toHaveBeenCalledTimes(1); // L'écouteur ne doit pas être appelé à nouveau
  });
});
