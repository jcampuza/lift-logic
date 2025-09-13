'use client';

import { forwardRef, useState, useCallback, useEffect } from 'react';
import { cn } from 'lib/utils';

interface NumericInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value' | 'type' | 'step'
  > {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  allowEmpty?: boolean;
  min?: number;
  max?: number;
  allowDecimals?: boolean;
}

const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  (
    {
      value,
      onChange,
      allowEmpty = true,
      min,
      max,
      allowDecimals = false,
      className,
      onBlur,
      onFocus,
      placeholder,
      ...props
    },
    ref,
  ) => {
    // Internal string state for managing display
    const [displayValue, setDisplayValue] = useState<string>(() => {
      if (value === undefined || value === null) return '';
      return String(value);
    });

    const [isFocused, setIsFocused] = useState(false);

    // Update display value when prop value changes (but not during focus)
    useEffect(() => {
      if (!isFocused) {
        if (value === undefined || value === null) {
          setDisplayValue('');
        } else {
          setDisplayValue(String(value));
        }
      }
    }, [value, isFocused]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setDisplayValue(inputValue);

        // Handle empty input
        if (inputValue === '' || inputValue === '-') {
          if (allowEmpty) {
            onChange(undefined);
          }
          return;
        }

        // Parse the number
        let numericValue = allowDecimals
          ? parseFloat(inputValue)
          : parseInt(inputValue, 10);

        // Validate the number
        if (isNaN(numericValue)) return;

        // Apply constraints
        if (min !== undefined && numericValue < min) {
          numericValue = min;
        }
        if (max !== undefined && numericValue > max) {
          numericValue = max;
        }

        onChange(numericValue);
      },
      [onChange, allowEmpty, allowDecimals, min, max],
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);

        // Clean up display value on blur
        if (value === undefined || value === null) {
          setDisplayValue('');
        } else {
          setDisplayValue(String(value));
        }

        onBlur?.(e);
      },
      [onBlur, value],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow: backspace, delete, tab, escape, enter, home, end, left, right, up, down
        const allowedKeys = [
          'Backspace',
          'Delete',
          'Tab',
          'Escape',
          'Enter',
          'Home',
          'End',
          'ArrowLeft',
          'ArrowRight',
          'ArrowUp',
          'ArrowDown',
        ];
        if (allowedKeys.includes(e.key)) {
          return;
        }

        // Allow Ctrl/Cmd+A, Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X
        if (
          (e.ctrlKey === true || e.metaKey === true) &&
          ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())
        ) {
          return;
        }

        // Allow minus sign at beginning for negative numbers
        if (
          e.key === '-' &&
          e.currentTarget.selectionStart === 0 &&
          !displayValue.includes('-')
        ) {
          return;
        }

        // Allow decimal point if decimals are allowed and there isn't one already
        if (allowDecimals && e.key === '.' && !displayValue.includes('.')) {
          return;
        }

        // Ensure that it's a number
        if (!/[0-9]/.test(e.key)) {
          e.preventDefault();
        }
      },
      [displayValue, allowDecimals],
    );

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || (allowEmpty ? '' : '0')}
        className={cn(
          'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);

NumericInput.displayName = 'NumericInput';

export { NumericInput };
