import './App.css';
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import CookieConsent from 'react-cookie-consent';
import ReactGA from 'react-ga';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import PageHome from './PageHome';
import PageInfo from './PageInfo';
import PageGallery from './PageGallery';
import PageTerms from './PageTerms';
import PageProvenance from './PageProvenance';

function App() {
  useEffect(() => {
    if (document.cookie.split(';').find((c) => c === 'CookieConsent=true')) {
      ReactGA.initialize('G-E8Y8PVGMG3');
    }
  }, []);
  return (
    <>
      <Router>
        <div className="App">
          <div className="App-inner">
            <AppHeader className="App-header" />
            <main className="App-main">
              <Routes>
                <Route
                  exact
                  path="/"
                  element={<PageHome />}
                />
                <Route
                  exact
                  path="/info"
                  element={<PageInfo />}
                />
                <Route
                  exact
                  path="/gallery"
                  element={<PageGallery />}
                />
                <Route
                  exact
                  path="/provenance"
                  element={<PageProvenance />}
                />
                <Route
                  exact
                  path="/terms"
                  element={<PageTerms />}
                />
              </Routes>
            </main>
          </div>
          <AppFooter className="App-footer" />
        </div>
      </Router>
      <CookieConsent
        buttonText="Accept"
        style={{ backgroundColor: '#000' }}
        buttonStyle={{
          backgroundColor: '#555',
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
    </>
  );
}

export default App;
