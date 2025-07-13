import { PlanHistorySection } from '../../components/PlanHistorySection';
import { ProgressMeterSection } from '../../components/ProgressMeterSection';
import { StreakTrackerSection } from '../../components/StreakTrackerSection';
import './Dashboard.css';

export const Dashboard = () => {
  return (
    <div className="dashboard mx-auto max-w-[1440px] px-4">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-grid">
        <div className="dashboard-card card-large">
          <ProgressMeterSection />
        </div>

        <div className="dashboard-card card-tall">
          <PlanHistorySection />
        </div>

        <div className="dashboard-card card-small">
          <StreakTrackerSection />
        </div>
        <div className="dashboard-card card-wide">MuscleHeatmap</div>
      </div>
    </div>
  );
};
