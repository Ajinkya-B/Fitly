import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Dashboard } from './pages/Dashboard';
import { About } from './pages/About';
import { PlanDetail } from './pages/PlanDetail';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plan/:planId" element={<PlanDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
