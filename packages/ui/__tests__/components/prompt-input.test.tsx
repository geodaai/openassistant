// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, act } from '@testing-library/react';
import React from 'react';
import PromptInput from '../../src/components/prompt-input';

test('renders correctly', async () => {
  let container;
  await act(async () => {
    const result = render(<PromptInput />);
    container = result.container;
  });
  expect(container).toMatchSnapshot();
});

test('renders correctly with placeholder', () => {
  const { container } = render(<PromptInput placeholder="Say something" />);

  // Check if the placeholder is rendered
  const input = container.querySelector('textarea');
  expect(input).toHaveAttribute('placeholder', 'Say something');
});

test('renders correctly with value', () => {
  const { container } = render(<PromptInput value="Hello, world!" />);

  // Check if the value is rendered
  const input = container.querySelector('textarea');
  expect(input).toHaveValue('Hello, world!');
});

test('render with end content', () => {
  const { container } = render(<PromptInput endContent={<div>End</div>} />);
  const endContent = container.querySelector('div');
  expect(endContent).toBeInTheDocument();

  // the content of end content should be "End"
  expect(endContent).toHaveTextContent('End');
});

test('render with classNames', () => {
  const { container } = render(<PromptInput classNames={{ input: 'bg-red-500' }} />);
  const input = container.querySelector('textarea');
  expect(input).toHaveClass('bg-red-500');
});

test('render with classNames label will be hidden', () => {
  const { container } = render(<PromptInput classNames={{ label: 'bg-red-500' }} />);
  const label = container.querySelector('textarea');
  expect(label).not.toHaveClass('bg-red-500');
});
