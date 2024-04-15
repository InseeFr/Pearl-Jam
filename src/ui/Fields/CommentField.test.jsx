import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CommentField } from './CommentField';
import jest from 'jest-mock';

describe('CommentField Component', () => {
  it('should render the CommentField component', () => {
    render(<CommentField value="" onChange={() => {}} />);
    const commentField = screen.getByRole('textbox');
    expect(commentField).toBeInTheDocument();
  });
  
  it('should update the value when input changes', () => {
    const handleChange = jest.fn();
    render(<CommentField value="" onChange={handleChange} />);
    const commentField = screen.getByRole('textbox');
    fireEvent.change(commentField, { target: { value: 'Test comment' } });
    expect(handleChange).toHaveBeenCalledWith('Test comment');
  });

  it('should not allow more than 999 characters', () => {
    const handleChange = jest.fn();
    render(<CommentField value="" onChange={handleChange} />);
    const commentField = screen.getByTestId('comment-textarea');
    fireEvent.change(commentField, { target: { value: 'a'.repeat(1000) } });
    expect(handleChange).not.toHaveBeenCalled();
  });
  
  it('should display the character count', () => {
    render(<CommentField value="Test comment" onChange={() => {}} />);
    const characterCount = screen.getByText('12/999');
    expect(characterCount).toBeInTheDocument();
  });
});