import { render, screen, fireEvent } from '@testing-library/react';
import { CommentField } from './CommentField';
import { describe, it, expect, vi } from 'vitest';
import D from 'i18n';

describe('CommentField Component', () => {
  it('should render the input field with the correct placeholder', () => {
    render(<CommentField value="" onChange={vi.fn()} />);

    screen.getByPlaceholderText(D.enterComment);
  });

  it('should display the correct character count', () => {
    const value = 'Test comment';
    render(<CommentField value={value} onChange={vi.fn()} />);

    screen.getByText(`${value.length}/999`);
  });

  it('should call onChange with the correct value when typing', () => {
    const handleChange = vi.fn();
    render(<CommentField value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText(D.enterComment);
    fireEvent.change(input, { target: { value: 'New comment' } });

    expect(handleChange).toHaveBeenCalledWith('New comment');
  });

  it('should not allow input beyond the maximum character limit', () => {
    const handleChange = vi.fn();
    const maxChar = 999;
    const longText = 'a'.repeat(maxChar + 1);

    render(<CommentField value="" onChange={handleChange} />);

    const input = screen.getByPlaceholderText(D.enterComment);
    fireEvent.change(input, { target: { value: longText } });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should apply additional props to the input field', () => {
    render(<CommentField value="" onChange={vi.fn()} data-testid="comment-input" />);

    screen.getByTestId('comment-input');
  });
});
