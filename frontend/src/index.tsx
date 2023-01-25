import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {WindowHistoryAdapter} from "use-query-params/adapters/window";
import {QueryParamProvider} from "use-query-params";
import './i18n';
import 'rc-tooltip/assets/bootstrap_white.css';
// @ts-ignore
import "hacktimer";

import "./pathfinding/data";

declare global {
    interface Window {
        timeRefreshWebWorkerId: number;
        trainsRefreshWebWorkerId: number;
    }
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <QueryParamProvider adapter={WindowHistoryAdapter}>
            <App />
      </QueryParamProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console_log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
