import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/AppShell/AppShell';
import { LoadingFallback } from './components/LoadingFallback/LoadingFallback';
import FlightsPage from './pages/FlightsPage/FlightsPage';
// import { NotFound } from './components/NotFound';
import Home from './pages/HomePage/HomePage';

// const Home = React.lazy(() => import('./pages/HomePage/HomePage'));

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<FlightsPage />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  );
};

export default App;