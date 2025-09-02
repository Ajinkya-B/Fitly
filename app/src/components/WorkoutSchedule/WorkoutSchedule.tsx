import { JSX, useEffect, useRef, useState } from 'react';
import { useAppContext } from '@/hooks/useAppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';

import {
  Dumbbell,
  HeartPulse,
  BedDouble,
  Armchair,
  ShieldCheck,
  ActivitySquare,
  StretchHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const iconMap: Record<string, JSX.Element> = {
  Push: <Dumbbell size={18} />,
  Pull: <StretchHorizontal size={18} />,
  Legs: <ShieldCheck size={18} />,
  Back: <ActivitySquare size={18} />,
  Abs: <Armchair size={18} />,
  Cardio: <HeartPulse size={18} />,
  Rest: <BedDouble size={18} />,
};

const getStatus = (date: Date, today: Date): string => {
  const todayStr = today.toDateString();
  const dateStr = date.toDateString();
  if (dateStr === todayStr) return 'Today';
  if (date < today) return 'Completed';
  return 'Upcoming';
};

// Helper: get Monday of a given week
const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 1 = Monday...
  const diff = d.getDate() - (day === 0 ? 6 : day - 1); // adjust to Monday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const WeeklyCalendar = () => {
  const today = new Date();
  const { weeklySchedule, fetchDayExercises, getWeeklyFocusLabels } =
    useAppContext();
  const [weeklyFocusLabels, setWeeklyFocusLabels] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const weekStart = getWeekStart(today);
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      return date;
    });
    const todayStr = today.toDateString();
    const todayIdx = days.findIndex((d) => d.toDateString() === todayStr);
    return todayIdx !== -1 ? todayIdx : 0;
  });
  const [weekOffset, setWeekOffset] = useState(0);

  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setWeeklyFocusLabels(getWeeklyFocusLabels());
  }, [getWeeklyFocusLabels, weeklySchedule]);

  // Compute the visible week range
  const weekStart = getWeekStart(today);
  const displayStart = new Date(weekStart);
  displayStart.setDate(displayStart.getDate() + weekOffset * 7);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(displayStart);
    date.setDate(displayStart.getDate() + i);
    return date;
  });

  return (
    <div className="w-full">
      {/* Header with arrows */}
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setWeekOffset((prev) => prev - 1)}
          className="p-1 rounded-full hover:bg-muted"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-sm font-medium">
          {displayStart.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}{' '}
          -{' '}
          {days[6].toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </div>
        <button
          onClick={() => setWeekOffset((prev) => prev + 1)}
          className="p-1 rounded-full hover:bg-muted"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Desktop: 7-column grid */}
      <div className="hidden md:grid grid-cols-7 gap-2 pb-4">
        {days.map((date, index) => {
          const type = weeklyFocusLabels[index % weeklyFocusLabels.length]; // cycle if shorter
          const isSelected = index === selectedIndex;
          const status = getStatus(date, today);

          return (
            <div
              key={index}
              className={`flex flex-col items-center justify-between gap-1 rounded-xl p-3 shadow-sm transition border bg-muted text-center
                ${isSelected ? 'border-primary ring-2 ring-primary/50' : 'border-border'}
                ${status === 'Completed' ? 'opacity-65' : ''}`}
              onClick={() => {
                setSelectedIndex(index);
                fetchDayExercises(date);
              }}
            >
              {/* Top: weekday */}
              <div className="text-xs text-muted-foreground">
                {status === 'Today'
                  ? 'Today'
                  : date.toLocaleDateString(undefined, { weekday: 'short' })}
              </div>
              <div className="text-sm font-semibold">
                {date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>

              {/* Middle: Icon + type */}
              <div className="mt-1 flex items-center justify-center gap-1 text-sm text-primary">
                {iconMap[type]} <span>{type}</span>
              </div>

              {/* Bottom: Status badge */}
              <div
                className={`mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  type === 'Rest'
                    ? 'bg-gray-200 text-gray-600'
                    : status === 'Today'
                      ? 'bg-blue-100 text-blue-600'
                      : status === 'Upcoming'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                }`}
              >
                {status}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="flex md:hidden overflow-x-auto gap-3 pb-3 snap-x snap-mandatory p-1">
        {days.map((date, index) => {
          const type = weeklyFocusLabels[index % weeklyFocusLabels.length];
          const isSelected = index === selectedIndex;
          const status = getStatus(date, today);

          const holdTimer = useRef<NodeJS.Timeout | null>(null);
          const [menuOpen, setMenuOpen] = useState(false);

          return (
            <div
              key={index}
              className={`flex-shrink-0 w-[120px] snap-center flex flex-col items-center justify-between gap-1 rounded-xl p-3 shadow-sm transition border bg-muted text-center
                ${isSelected ? 'border-primary ring-2 ring-primary/50' : 'border-border'}
                ${status === 'Completed' ? 'opacity-65' : ''}`}
              onClick={() => {
                setSelectedIndex(index);
                fetchDayExercises(date);
              }}
            >
              <div className="text-xs text-muted-foreground">
                {status === 'Today'
                  ? 'Today'
                  : date.toLocaleDateString(undefined, { weekday: 'short' })}
              </div>
              <div className="text-sm font-semibold">
                {date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>

              <div
                className="mt-1 flex items-center justify-center gap-1 text-sm text-primary relative"
                onMouseDown={() => {
                  holdTimer.current = setTimeout(() => setMenuOpen(true), 600); // long press only
                }}
                onMouseUp={() => {
                  if (holdTimer.current) clearTimeout(holdTimer.current);
                }}
                onMouseLeave={() => {
                  if (holdTimer.current) clearTimeout(holdTimer.current);
                }}
                onTouchStart={() => {
                  holdTimer.current = setTimeout(() => setMenuOpen(true), 600);
                }}
                onTouchEnd={() => {
                  if (holdTimer.current) clearTimeout(holdTimer.current);
                }}
              >
                {/* Icon + type label */}
                <button
                  className="flex items-center gap-1 focus:outline-none"
                  onClick={(e) => {
                    e.preventDefault(); // prevent accidental click open
                  }}
                >
                  {iconMap[type]} <span>{type}</span>
                </button>

                {/* Controlled dropdown */}
                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    {/* Hidden trigger: not clickable directly, just satisfies Radix */}
                    <span />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => console.log('Cancel', type)}
                    >
                      Cancel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setMenuOpen(false); // close dropdown
                        setMoveDialogOpen(true); // open calendar modal
                      }}
                    >
                      Move Exercise
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className={`mt-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  type === 'Rest'
                    ? 'bg-gray-200 text-gray-600'
                    : status === 'Today'
                      ? 'bg-blue-100 text-blue-600'
                      : status === 'Upcoming'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                }`}
              >
                {status}
              </div>
            </div>
          );
        })}
      </div>
      <Dialog open={moveDialogOpen} onOpenChange={setMoveDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl shadow-lg p-6">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-semibold">
              Move Workout
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Choose a new date from the calendar below to reschedule your
              workout.
            </p>
          </DialogHeader>

          <div className="my-4 mx-auto">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-xl border shadow-sm p-3"
            />
          </div>

          {selectedDate && (
            <div className="text-center text-sm text-muted-foreground mb-2">
              Selected date:{' '}
              <span className="font-medium text-foreground">
                {selectedDate.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          <DialogFooter className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setMoveDialogOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              disabled={!selectedDate}
              onClick={() => {
                if (selectedDate) {
                  console.log('Moved workout to:', selectedDate);
                  // TODO: hook into your move logic here
                  setMoveDialogOpen(false);
                }
              }}
              className="rounded-xl"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
