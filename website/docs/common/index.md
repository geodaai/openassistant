# @openassistant/common

Common utilities for the OpenAssistant library.

- hooks
- components

## Hooks

### useBrushLink

A React hook that synchronizes brush selection data between different components using localStorage.

#### Features:
- Persists brush selection data in localStorage
- Enables real-time synchronization between components
- Triggers callbacks when brush selections change

#### Usage:
The hook provides a mechanism to share brush selections across components. When a brush selection changes in one component, all other components using this hook will be notified of the change through the `onLink` callback.
