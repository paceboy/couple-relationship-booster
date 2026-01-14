import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';
import './App.css';

function App() {
  const hasRoom = !!localStorage.getItem('roomId');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="*" element={<Navigate to={hasRoom ? '/main' : '/'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
