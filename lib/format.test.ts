import { describe, it, expect } from 'vitest';
import { formatExerciseName } from './format';

describe('formatExerciseName', () => {
  it('trims and returns empty string as-is', () => {
    expect(formatExerciseName('   ')).toBe('');
  });

  it('capitalizes simple words', () => {
    expect(formatExerciseName('incline dumbbell bench press')).toBe(
      'Incline Dumbbell Bench Press',
    );
  });

  it('capitalizes after hyphens', () => {
    expect(formatExerciseName('lying-hamstring curl')).toBe(
      'Lying-Hamstring Curl',
    );
  });

  it('capitalizes inside parentheses', () => {
    expect(formatExerciseName('seated (smith machine) incline press')).toBe(
      'Seated (Smith Machine) Incline Press',
    );
  });

  it('capitalizes after slashes', () => {
    expect(formatExerciseName('rear delt / cable fly')).toBe(
      'Rear Delt / Cable Fly',
    );
  });

  it('preserves existing casing beyond first character in a word', () => {
    expect(formatExerciseName('pr set / 1rm test')).toBe('Pr Set / 1rm Test');
    expect(formatExerciseName('DB row')).toBe('DB Row');
  });

  it('capitalizes after underscores, commas, plus and colon', () => {
    expect(formatExerciseName('cable row, wide grip')).toBe(
      'Cable Row, Wide Grip',
    );
    expect(formatExerciseName('squat + pause')).toBe('Squat + Pause');
    expect(formatExerciseName('rdl: tempo 3-1-1')).toBe('Rdl: Tempo 3-1-1');
    expect(formatExerciseName('toe_to_bar')).toBe('Toe_To_Bar');
  });
});
