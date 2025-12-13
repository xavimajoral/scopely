import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DicebearAvatar } from './index';

describe('DicebearAvatar', () => {
  it('renders an image with the correct attributes', () => {
    render(<DicebearAvatar seed="test-seed" size={64} alt="Test Avatar" />);
    
    const img = screen.getByAltText('Test Avatar');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('width', '64');
    expect(img).toHaveAttribute('height', '64');
    expect(img).toHaveAttribute('src');
  });

  it('uses default size when not provided', () => {
    render(<DicebearAvatar seed="test-seed" />);
    
    const img = screen.getByAltText('Avatar');
    expect(img).toHaveAttribute('width', '64');
    expect(img).toHaveAttribute('height', '64');
  });

  it('uses default alt text when not provided', () => {
    render(<DicebearAvatar seed="test-seed" />);
    
    const img = screen.getByAltText('Avatar');
    expect(img).toBeInTheDocument();
  });

  it('generates consistent avatar for the same seed', () => {
    const { rerender } = render(<DicebearAvatar seed="test-seed" />);
    const firstSrc = screen.getByAltText('Avatar').getAttribute('src');
    
    rerender(<DicebearAvatar seed="test-seed" />);
    const secondSrc = screen.getByAltText('Avatar').getAttribute('src');
    
    expect(firstSrc).toBe(secondSrc);
  });
});

