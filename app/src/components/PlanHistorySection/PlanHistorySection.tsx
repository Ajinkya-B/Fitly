import { PlanCard } from '.';
import './PlanHistorySection.css';

export const PlanHistorySection = () => {
  const userPlans = [
    { name: 'Push Pull Legs', date: 'Jul 2', days: 3, progress: 70 },
    { name: 'Full Body Beginner', date: 'Jun 18', days: 5, progress: 40 },
    { name: 'Upper Lower', date: 'Jun 5', days: 4, progress: 90 },
  ];
  return (
    <div className="plans-section">
      <h2>Your Plans</h2>
      <div className="plans-scroll">
        {userPlans.map((plan, idx) => (
          <PlanCard
            id={idx}
            name={plan.name}
            days={plan.days}
            date={plan.date}
            progress={plan.progress}
          />
        ))}
      </div>
      <button className="generate-btn">Generate New Plan</button>
    </div>
  );
};
