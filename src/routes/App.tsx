import { BrowserRouter, Routes, Route } from 'react-router';
import { CalorieIntakePage } from '../pages/calorie-intake';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalorieIntakePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
