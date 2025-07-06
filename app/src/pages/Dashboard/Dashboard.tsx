import { PlanHistorySection } from '../../components/PlanHistorySection';
import './Dashboard.css';

export const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card card-large">Progress Meter</div>

        <div className="dashboard-card card-tall">
          <PlanHistorySection />
        </div>

        <div className="dashboard-card card-small">StreakTracker</div>
        <div className="dashboard-card card-wide">MuscleHeatmap</div>
      </div>
    </div>
  );
};
