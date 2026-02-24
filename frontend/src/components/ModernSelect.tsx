import { useEffect, useMemo, useRef, useState } from 'react';

export interface ModernSelectOption {
  value: string;
  label: string;
}

interface ModernSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: ModernSelectOption[];
  placeholder?: string;
  className?: string;
}

export default function ModernSelect({
  value,
  onChange,
  options,
  placeholder = 'Select',
  className = '',
}: ModernSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectedLabel = useMemo(() => {
    const selected = options.find((opt) => opt.value === value);
    return selected?.label ?? placeholder;
  }, [options, placeholder, value]);

  return (
    <div className={`modern-select-root ${className}`.trim()} ref={wrapperRef}>
      <button
        type="button"
        className="modern-select-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className={value ? 'modern-select-value' : 'modern-select-placeholder'}>
          {selectedLabel}
        </span>
        <span className={`modern-select-chevron ${open ? 'open' : ''}`} />
      </button>
      {open && (
        <div className="modern-select-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`modern-select-item ${option.value === value ? 'active' : ''}`}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
