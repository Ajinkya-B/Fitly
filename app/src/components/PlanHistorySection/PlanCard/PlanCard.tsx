import { useNavigate } from 'react-router-dom';
import './PlanCard.css';

interface PlanCardProps {
  id: number;
  name: string;
  days: number;
  date: string;
  progress: number;
}

export const PlanCard = ({ id, name, days, date, progress }: PlanCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/plan/${id}`);
  };

  return (
    <div className="plan-card cursor-pointer" key={id} onClick={handleClick}>
      <h3>{name}</h3>
      <p>{days} Days</p>
      <p className="plan-date">Created: {date}</p>
      <div className="plan-progress-bar">
        <div
          className="plan-progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="plan-progress-label">{progress}%</span>
    </div>
  );
};
