import {
  CheckCircle2,
  Loader,
  Clock,
  SquareArrowOutUpRight,
} from 'lucide-react';

interface StatusPillProps {
  status: 'Not Started' | 'In Progress' | 'Complete';
  onStart?: () => void;
}

export const StatusPill = ({ status, onStart }: StatusPillProps) => {
  if (status === 'Not Started' && onStart) {
    return (
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-blue-50 px-3 py-1 font-semibold shadow-sm
             text-gray-800 group
             hover:bg-blue-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        <SquareArrowOutUpRight
          size={18}
          className="text-blue-600 group-hover:text-white"
        />
        Start
      </button>
    );
  }

  let icon = null;
  let colorClass = 'text-gray-500';

  switch (status) {
    case 'Complete':
      icon = <CheckCircle2 className="text-green-600" size={18} />;
      colorClass = 'text-gray-800';
      break;
    case 'In Progress':
      icon = <Loader className="text-yellow-600" size={18} />;
      colorClass = 'text-gray-800';
      break;
    case 'Not Started':
    default:
      icon = <Clock className="text-gray-500" size={18} />;
      colorClass = 'text-gray-800';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1 font-semibold ${colorClass}`}
    >
      {icon}
      {status}
    </span>
  );
};
