// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MessageCard, {
  MessageCardProps,
} from '../../src/components/message-card';

describe('MessageCard Component', () => {
  const defaultProps: MessageCardProps = {
    index: 0,
    message: 'Test message',
    status: 'success',
    showFeedback: true,
  };

  it('renders the message correctly', () => {
    const { container } = render(<MessageCard {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('displays the avatar when provided as a string', () => {
    const avatar = 'https://example.com/avatar.png';
    render(<MessageCard {...defaultProps} avatar={avatar} />);
    expect(screen.getByAltText('avatar')).toHaveAttribute('src', avatar);
  });

  it('displays the avatar when provided as a ReactNode', () => {
    const avatar = <div data-testid="custom-avatar">Custom Avatar</div>;
    render(<MessageCard {...defaultProps} avatar={avatar} />);
    expect(screen.getByTestId('custom-avatar')).toBeInTheDocument();
  });

  it('shows the failed message when status is failed', () => {
    render(<MessageCard {...defaultProps} status="failed" />);
    expect(
      screen.getByText(/Sorry, something went wrong/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Github/i })).toBeInTheDocument();
  });

  it('shows loading spinner when status is pending', () => {
    render(<MessageCard {...defaultProps} status="pending" />);
    expect(screen.getByTestId('spinner-icon')).toBeInTheDocument();
  });

  it('calls onMessageCopy when copy button is clicked', async () => {
    const onMessageCopy = jest.fn();
    render(<MessageCard {...defaultProps} onMessageCopy={onMessageCopy} />);
    const copyButton = screen.getByTestId('copytext-button');
    fireEvent.click(copyButton);
    expect(onMessageCopy).toHaveBeenCalledWith('Test message');
  });

  it('calls onFeedback when feedback button is clicked', async () => {
    const onFeedback = jest.fn();
    render(<MessageCard {...defaultProps} onFeedback={onFeedback} />);
    const feedbackButton = screen.getByTestId('feedback-button');
    await act(async () => {
      fireEvent.click(feedbackButton);
    });
    expect(onFeedback).toHaveBeenCalledWith(0);
  });

  it('renders attempt navigation when attempts > 1', async () => {
    const onAttemptChange = jest.fn();
    render(
      <MessageCard
        {...defaultProps}
        attempts={3}
        currentAttempt={2}
        onAttemptChange={onAttemptChange}
      />
    );
    const prevButton = screen.getByTestId('previous-button');
    const nextButton = screen.getByTestId('next-button');
    await act(async () => {
      fireEvent.click(prevButton);
    });
    expect(onAttemptChange).toHaveBeenCalledWith(1);
    await act(async () => {
      fireEvent.click(nextButton);
    });
    expect(onAttemptChange).toHaveBeenCalledWith(3);
  });

  it('renders attempt feedback when showFeedback is true and attempts > 1', async () => {
    const onAttemptFeedback = jest.fn();
    render(
      <MessageCard
        {...defaultProps}
        attempts={2}
        onAttemptFeedback={onAttemptFeedback}
      />
    );
    expect(
      screen.getByText(/Was this response better or worse?/i)
    ).toBeInTheDocument();
    const betterButton = screen.getByTestId('better-button');
    await act(async () => {
      fireEvent.click(betterButton);
    });
    expect(onAttemptFeedback).toHaveBeenCalledWith('like');
  });

  it('renders custom message when provided', () => {
    const customMessage = (
      <div data-testid="custom-message">Custom Message</div>
    );
    render(<MessageCard {...defaultProps} customMessage={customMessage} />);
    expect(screen.getByTestId('custom-message')).toBeInTheDocument();
  });

  it('renders screenshot when customMessage is a data URL', () => {
    const dataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==';
    render(<MessageCard {...defaultProps} customMessage={dataUrl} />);
    const img = screen.getByRole('img', { name: /screenshot/i });
    expect(img).toHaveAttribute('src', dataUrl);
  });
});
