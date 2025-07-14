// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app';
import './index.css';
const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
