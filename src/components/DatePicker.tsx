import { useMemo, useState } from 'react';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function parseValue(value?: string) {
  const match = value?.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  return {
    month: Number(match[1]) - 1,
    day: Number(match[2]),
    year: Number(match[3]),
  };
}

type DatePickerProps = {
  value: string;
  onChange: (next: string) => void;
  onClose: () => void;
};

type SelectedDate = {
  month: number;
  day: number;
  year: number;
};

export default function DatePicker({ value, onChange, onClose }: DatePickerProps) {
  const initial: SelectedDate =
    parseValue(value) || {
      month: new Date().getMonth(),
      day: new Date().getDate(),
      year: new Date().getFullYear() - 25,
    };

  const [viewMonth, setViewMonth] = useState(initial.month);
  const [viewYear, setViewYear] = useState(initial.year);
  const [selected, setSelected] = useState<SelectedDate>(initial);

  const days = useMemo(() => {
    const first = new Date(viewYear, viewMonth, 1);
    const startPad = first.getDay();
    const total = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: Array<number | null> = [];
    for (let i = 0; i < startPad; i += 1) cells.push(null);
    for (let d = 1; d <= total; d += 1) cells.push(d);
    return cells;
  }, [viewMonth, viewYear]);

  const apply = () => {
    onChange(`${pad(selected.month + 1)}/${pad(selected.day)}/${selected.year}`);
    onClose();
  };

  return (
    <div
      className="date-picker-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Select date"
    >
      <div className="date-picker">
        <h3 className="date-picker__page-title">Complete Your Profile</h3>
        <div className="date-picker__header">
          <button
            type="button"
            className="date-picker__nav"
            onClick={() => {
              if (viewMonth === 0) {
                setViewMonth(11);
                setViewYear((y) => y - 1);
              } else setViewMonth((m) => m - 1);
            }}
            aria-label="Previous month"
          >
            ‹
          </button>
          <span className="date-picker__title">
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            className="date-picker__nav"
            onClick={() => {
              if (viewMonth === 11) {
                setViewMonth(0);
                setViewYear((y) => y + 1);
              } else setViewMonth((m) => m + 1);
            }}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
        <div className="date-picker__weekdays">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>
        <div className="date-picker__grid">
          {days.map((day, i) =>
            day ? (
              <button
                key={`${viewMonth}-${day}-${i}`}
                type="button"
                className={`date-picker__day ${
                  selected.day === day &&
                  selected.month === viewMonth &&
                  selected.year === viewYear
                    ? 'date-picker__day--active'
                    : ''
                }`}
                onClick={() => setSelected({ month: viewMonth, day, year: viewYear })}
              >
                {day}
              </button>
            ) : (
              <span key={`empty-${i}`} className="date-picker__empty" />
            )
          )}
        </div>
        <button type="button" className="btn btn--primary btn--block" onClick={apply}>
          Done
        </button>
      </div>
    </div>
  );
}

