import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAppContext } from './hooks/useAppContext';

function Home() {
  const { user } = useAppContext();
  return (
    <div>
      Home Page
      <div>Welcome to Fitly, {user ? user : 'Guest'}!</div>
    </div>
  );
}

function About() {
  return <div>About Page</div>;
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
