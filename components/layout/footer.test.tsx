import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './footer';

describe('Footer', () => {
  it('renders with default links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: 'Menu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Nutrition' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  it('renders copyright information with current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} SOOEATS`))).toBeInTheDocument();
  });

  it('uses semantic footer element', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('renders brand name', () => {
    render(<Footer />);
    expect(screen.getByText('SOOEATS')).toBeInTheDocument();
  });

  it('renders Instagram link', () => {
    render(<Footer />);
    expect(screen.getByText('@soo__eats_')).toBeInTheDocument();
  });

  it('applies themed styling classes', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-brown-900');
    expect(footer).toHaveClass('text-brown-300');
  });
});
