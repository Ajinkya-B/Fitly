import { ActivityCalendar } from './ActivityCalendar/ActivityCalendar';
import './StreakTrackerSection.css';

export const StreakTrackerSection = () => {
  const today = new Date();
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const date = new Date(2025, 6, i + 1);
    return {
      date: date.toISOString().split('T')[0],
      completed: Math.random() > 0.4,
      isToday:
        date.toDateString() === today.toDateString() &&
        date.getMonth() === today.getMonth(),
    };
  });

  // Demo data — replace with real data as needed
  const currentStreak = 12;
  const longestStreak = 25;
  const activeDays = 20;
  const goalStreak = 20;
  const daysAwayFromGoal = goalStreak - currentStreak;
  const consistencyRate = 75; // percent
  const motivationalTip = 'Keep up the momentum — consistency is key!';

  return (
    <div className="streak-section">
      <div className="streak-info">
        <h2 className="current-streak">
          🔥 {currentStreak}-Day Streak{' '}
          <span className="longest-streak">(Longest: {longestStreak}d)</span>
        </h2>

        <div className="activity-summary">
          <p>
            <strong>Active Days:</strong> {activeDays} in July
          </p>
          <p>
            <strong>Consistency:</strong> {consistencyRate}% this month
          </p>
          <p>
            <strong>Goal Progress:</strong> {daysAwayFromGoal} days away from{' '}
            {goalStreak}d goal
          </p>
        </div>

        <p className="motivational-tip">{motivationalTip}</p>

        <p className="last-activity">Last active: July 5</p>
      </div>

      <ActivityCalendar calendarDays={calendarDays} />
    </div>
  );
};
