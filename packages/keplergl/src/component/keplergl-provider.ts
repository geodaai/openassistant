import {
  legacy_createStore as createStore,
  applyMiddleware,
  Middleware,
  combineReducers,
} from 'redux';
import { taskMiddleware } from 'react-palm/tasks';
import { createLogger } from 'redux-logger';
import { keplerGlReducer, KeplerGlState } from '@kepler.gl/reducers';

export type KeplerState = {
  keplerGl: KeplerGlState;
};

// keplerGL uses 'map' as the default map id
export const MAP_ID = 'map';

// @ts-expect-error - TODO: fix this type error
const loggerMiddleware: Middleware = createLogger({
  collapsed: true,
  duration: true,
});

const keplerReducer = keplerGlReducer.initialState({
  uiState: {
    activeSidePanel: null,
    readonly: true,
    currentModal: null,
  },
  visState: {},
  mapState: {},
  mapStyle: {},
  providerState: {},
});

const initialState = {
  keplerGl: {
    [MAP_ID]: keplerReducer,
  },
};

const reducers = combineReducers({
  keplerGl: keplerReducer,
});

// const reducers = combineReducers({
//   [MAP_ID]: demoReducer,
// });

export const store = createStore(
  reducers,
  initialState,
  applyMiddleware(taskMiddleware, loggerMiddleware)
);
