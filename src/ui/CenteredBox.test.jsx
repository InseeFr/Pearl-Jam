import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CenteredBox } from './CenteredBox';

describe('CenteredBox Component', () => {
  it('should render its children correctly', () => {
    render(
      <CenteredBox>
        <div data-testid="child">Test Child</div>
      </CenteredBox>
    );
    const childDiv = screen.getByTestId('child');
    expect(childDiv).toBeInTheDocument();
    expect(childDiv).toHaveTextContent('Test Child');
  });

  it('should apply default grid styles', () => {
    render(
      <CenteredBox>
        <div>Test Content</div>
      </CenteredBox>
    );
    const box = screen.getByText('Test Content').parentElement;
    expect(box).toHaveStyle('display: grid');
    expect(box).toHaveStyle('gridTemplateColumns: 1fr');
    expect(box).toHaveStyle('gridTemplateRows: 1fr');
    expect(box).toHaveStyle('justifyItems: center');
    expect(box).toHaveStyle('alignItems: center');
  });
  
  it('should correctly merge default and custom grid styles', () => {
    const customStyles = {
      display: 'flex',
      alignItems: 'flex-start',
      gridTemplateColumns: 'repeat(3, 1fr)'
    };
    render(
      <CenteredBox sx={customStyles}>
        <div>Test Content</div>
      </CenteredBox>
    );
    const box = screen.getByText('Test Content').parentElement;
    expect(box).toHaveStyle(`
      display: flex;
      alignItems: flex-start;
      gridTemplateColumns: repeat(3, 1fr);
    `);
  });
  

  it('should pass additional props to the Box component', () => {
    render(
      <CenteredBox data-testid="custom-id">
        <div>Test Content</div>
      </CenteredBox>
    );
    const box = screen.getByTestId('custom-id');
    expect(box).toBeInTheDocument();
  });
});
