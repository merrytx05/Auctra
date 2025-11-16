import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AuctionCard from '../components/AuctionCard';

describe('AuctionCard Component', () => {
  const mockAuction = {
    id: 1,
    title: 'Test Auction',
    description: 'Test description',
    starting_price: 100,
    current_price: 100,
    status: 'active',
    bid_count: 5,
    seller_username: 'testuser',
    end_time: new Date(Date.now() + 3600000).toISOString(),
  };

  it('renders auction card with title', () => {
    render(
      <BrowserRouter>
        <AuctionCard auction={mockAuction} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Test Auction')).toBeInTheDocument();
  });

  it('displays current price', () => {
    render(
      <BrowserRouter>
        <AuctionCard auction={mockAuction} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('$100.00')).toBeInTheDocument();
  });

  it('shows LIVE badge for active auctions', () => {
    render(
      <BrowserRouter>
        <AuctionCard auction={mockAuction} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/LIVE/i)).toBeInTheDocument();
  });

  it('shows CLOSED badge for closed auctions', () => {
    const closedAuction = { ...mockAuction, status: 'closed' };
    
    render(
      <BrowserRouter>
        <AuctionCard auction={closedAuction} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/CLOSED/i)).toBeInTheDocument();
  });
});
