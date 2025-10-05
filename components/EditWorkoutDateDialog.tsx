'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { useConvexReactQueryMutation } from '@/hooks/useConvexReactQueryMutation';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';

type EditWorkoutDateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutId: Id<'workouts'>;
  currentDate: number;
};

export default function EditWorkoutDateDialog({
  open,
  onOpenChange,
  workoutId,
  currentDate,
}: EditWorkoutDateDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(currentDate),
  );

  const updateWorkoutDate = useConvexReactQueryMutation(
    api.workouts.updateWorkoutDate,
    {
      onSuccess: () => {
        toast.success('Workout date updated successfully');
        onOpenChange(false);
      },
      onError: (error) => {
        console.error('Failed to update workout date:', error);
        toast.error('Failed to update workout date');
      },
    },
  );

  const handleSave = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    updateWorkoutDate.mutate({
      id: workoutId,
      date: selectedDate.getTime(),
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset to current date when closing
      setSelectedDate(new Date(currentDate));
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Workout Date</DialogTitle>
          <DialogDescription>
            Choose a new date for this workout.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Date</label>
            <DatePicker
              date={selectedDate}
              onDateChange={setSelectedDate}
              placeholder="Select date"
              className="w-full"
              disabled={(date) => date > new Date()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={updateWorkoutDate.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateWorkoutDate.isPending || !selectedDate}
          >
            {updateWorkoutDate.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
