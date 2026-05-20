import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar, NavLink } from './navbar';

// Mock useCart
vi.mock('@/lib/cart-context', () => ({
  useCart: () => ({
    totalItems: 0,
    setIsCartOpen: vi.fn(),
    isAuthenticated: true,
    openAuthDialog: vi.fn(),
  }),
}));

describe('Navbar Component', () => {
  const mockLinks: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
  ];

  describe('Desktop Navigation', () => {
    it('renders logo with correct text', () => {
      render(<Navbar links={mockLinks} />);
      const logo = screen.getByLabelText('SOOEATS Home');
      expect(logo).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
      render(<Navbar links={mockLinks} />);
      mockLinks.forEach((link) => {
        const linkElements = screen.getAllByText(link.label);
        expect(linkElements.length).toBeGreaterThan(0);
      });
    });

    it('renders default links when no links prop provided', () => {
      render(<Navbar />);
      expect(screen.getAllByText('Menu').length).toBeGreaterThan(0);
    });

    it('logo has correct href', () => {
      render(<Navbar links={mockLinks} />);
      const logo = screen.getByLabelText('SOOEATS Home');
      expect(logo).toHaveAttribute('href', '/');
    });

    it('navigation links have correct hrefs', () => {
      render(<Navbar links={mockLinks} />);
      mockLinks.forEach((link) => {
        const linkElements = screen.getAllByRole('link', { name: link.label });
        linkElements.forEach((element) => {
          expect(element).toHaveAttribute('href', link.href);
        });
      });
    });
  });

  describe('Mobile Menu', () => {
    it('mobile menu button is present', () => {
      render(<Navbar links={mockLinks} />);
      const menuButton = screen.getByLabelText('Open menu');
      expect(menuButton).toBeInTheDocument();
    });

    it('mobile menu is initially closed', () => {
      render(<Navbar links={mockLinks} />);
      const menuButton = screen.getByLabelText('Open menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens mobile menu when hamburger button is clicked', () => {
      render(<Navbar links={mockLinks} />);
      const menuButton = screen.getByLabelText('Open menu');
      fireEvent.click(menuButton);

      const closeButton = screen.getByLabelText('Close menu');
      expect(closeButton).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes mobile menu when X button is clicked', () => {
      render(<Navbar links={mockLinks} />);

      const openButton = screen.getByLabelText('Open menu');
      fireEvent.click(openButton);

      const closeButton = screen.getByLabelText('Close menu');
      fireEvent.click(closeButton);

      const menuButton = screen.getByLabelText('Open menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Keyboard Accessibility', () => {
    it('logo has focus styles', () => {
      render(<Navbar links={mockLinks} />);
      const logo = screen.getByLabelText('SOOEATS Home');
      expect(logo).toHaveClass('focus:outline-none');
      expect(logo).toHaveClass('focus:ring-2');
      expect(logo).toHaveClass('focus:ring-orange-500');
    });

    it('mobile menu button has focus styles', () => {
      render(<Navbar links={mockLinks} />);
      const menuButton = screen.getByLabelText('Open menu');
      expect(menuButton).toHaveClass('focus:outline-none');
      expect(menuButton).toHaveClass('focus:ring-2');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty links array', () => {
      render(<Navbar links={[]} />);
      expect(screen.getByLabelText('SOOEATS Home')).toBeInTheDocument();
    });

    it('handles single link', () => {
      const singleLink: NavLink[] = [{ label: 'Home', href: '/' }];
      render(<Navbar links={singleLink} />);
      expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    });
  });
});
