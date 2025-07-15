import { CheckCircle2, Loader, Clock } from 'lucide-react';

export const StatusPill = ({ status }: { status: string }) => {
  let icon = null;

  switch (status) {
    case 'Complete':
      icon = <CheckCircle2 className="text-green-600" size={18} />;
      break;
    case 'In Progress':
      icon = <Loader className="text-yellow-600" size={18} />;
      break;
    case 'Not Started':
    default:
      icon = <Clock className="text-gray-500" size={18} />;
      break;
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1 font-semibold text-gray-800">
      {icon}
      {status}
    </span>
  );
};
