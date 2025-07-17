import {
  Dumbbell,
  HeartPulse,
  BedDouble,
  Armchair,
  ShieldCheck,
  ActivitySquare,
  StretchHorizontal,
} from 'lucide-react';
import { JSX } from 'react';

const iconMap: Record<string, JSX.Element> = {
  Push: <Dumbbell size={18} />,
  Pull: <StretchHorizontal size={18} />,
  Legs: <ShieldCheck size={18} />,
  Back: <ActivitySquare size={18} />,
  Abs: <Armchair size={18} />,
  Cardio: <HeartPulse size={18} />,
  Rest: <BedDouble size={18} />,
};

const workoutSchedule = [
  'Push',
  'Pull',
  'Legs',
  'Rest',
  'Back',
  'Abs',
  'Cardio',
];

const getStatus = (index: number): string => {
  if (index === 0) return 'Today';
  if (index < 0) return 'Completed';
  return 'Upcoming';
};

export const WeeklyCalendar = () => {
  const today = new Date();

  return (
    <div className="grid grid-cols-7 gap-2 w-full pb-4">
      {workoutSchedule.map((type, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);

        const isToday = index === 0;
        const status = getStatus(index);

        return (
          <div
            key={index}
            className={`flex flex-col items-center justify-between gap-1 rounded-xl p-3 shadow-sm transition border bg-muted text-center
              ${isToday ? 'border-primary ring-2 ring-primary/50' : 'border-border'}`}
          >
            {/* Top: Date and status */}
            <div className="text-xs text-muted-foreground">
              {isToday
                ? 'Today'
                : date.toLocaleDateString(undefined, { weekday: 'short' })}
            </div>
            <div className="text-sm font-semibold">
              {date.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </div>

            {/* Middle: Icon and workout type */}
            <div className="mt-1 flex items-center justify-center gap-1 text-sm text-primary">
              {iconMap[type]} <span>{type}</span>
            </div>

            {/* Bottom: Status badge */}
            <div
              className={`mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                type === 'Rest'
                  ? 'bg-gray-200 text-gray-600'
                  : isToday
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-green-100 text-green-700'
              }`}
            >
              {status}
            </div>

            {/* Optional: Progress bar */}
            {/* <div className="mt-1 h-1 w-full bg-gray-200 rounded-full">
              <div className="h-full w-1/2 bg-primary rounded-full" />
            </div> */}
          </div>
        );
      })}
    </div>
  );
};
