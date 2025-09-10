'use client';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { muscleGroupOptions } from '@/lib/muscleGroups';

interface PrimaryMuscleGroupSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function PrimaryMuscleGroupSelector({
  value,
  onChange,
  className,
}: PrimaryMuscleGroupSelectorProps) {
  return (
    <div className={className}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select primary muscle" />
        </SelectTrigger>
        <SelectContent>
          {muscleGroupOptions.map((muscle) => (
            <SelectItem key={muscle} value={muscle}>
              {muscle}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

interface SecondaryMuscleGroupSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  primaryMuscle?: string;
}

export function SecondaryMuscleGroupSelector({
  value,
  onChange,
  className,
  primaryMuscle,
}: SecondaryMuscleGroupSelectorProps) {
  const availableOptions = muscleGroupOptions.filter(
    (muscle) => muscle !== primaryMuscle,
  );

  const handleToggle = (muscle: string, checked: boolean) => {
    if (checked) {
      onChange([...value, muscle]);
    } else {
      onChange(value.filter((m) => m !== muscle));
    }
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
        {availableOptions.map((muscle) => (
          <div key={muscle} className="flex items-center space-x-2">
            <Checkbox
              id={`secondary-${muscle}`}
              checked={value.includes(muscle)}
              onCheckedChange={(checked) =>
                handleToggle(muscle, checked === true)
              }
            />
            <label
              htmlFor={`secondary-${muscle}`}
              className="text-sm cursor-pointer"
            >
              {muscle}
            </label>
          </div>
        ))}
      </div>
      {value.length > 0 && (
        <div className="mt-2 text-xs opacity-70">
          Selected: {value.join(', ')}
        </div>
      )}
    </div>
  );
}
