import './App.css';
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import PageHome from './PageHome';
import PageInfo from './PageInfo';
import PageGallery from './PageGallery';
import PageTerms from './PageTerms';
import PageProvenance from './PageProvenance';

function App() {
  return (
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
  );
}

export default App;
