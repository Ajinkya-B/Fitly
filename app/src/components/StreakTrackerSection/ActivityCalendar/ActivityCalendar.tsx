import './ActivityCalendar.css';

interface ActivityCalendarProps {
  calendarDays: {
    date: string;
    completed: boolean;
    isToday: boolean;
  }[];
}

export const ActivityCalendar = ({ calendarDays }: ActivityCalendarProps) => {
  return (
    <div className="calendar-container">
      <div className="calendar-header">July 2025</div>
      <div className="weekday-labels">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="weekday-label">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {calendarDays.map((day, idx) => (
          <div
            key={idx}
            className={`calendar-day
                ${day.completed ? 'active' : ''}
                ${day.isToday ? 'today' : ''}
              `}
          />
        ))}
      </div>
    </div>
  );
};
