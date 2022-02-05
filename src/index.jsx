import './reset.css';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import CookieConsent from 'react-cookie-consent';
import ReactGA from 'react-ga';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { Web3Provider } from './context/Web3Context';

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
    <CookieConsent
      buttonText="Accept"
      style={{ backgroundColor: '#000' }}
      buttonStyle={{
        backgroundColor: '#ff1493',
        color: '#fff',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
      onAccept={() => {
        ReactGA.initialize('G-S3TT2WKBV5');
      }}
    >
      This website uses cookies to enhance the user experience.
    </CookieConsent>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
