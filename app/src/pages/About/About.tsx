import './About.css';

export const About = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">Welcome to Fitly</h1>
      <p className="about-subtitle">Your AI-powered workout planner.</p>
      <a href="/dashboard" className="about-button">
        Enter App →
      </a>
    </div>
  );
};
