import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { api } from '../convex/_generated/api';
import type { Id } from '../convex/_generated/dataModel';

export type ExerciseSearchResult =
  | {
      kind: 'global';
      _id: Id<'globalExercises'>;
      name: string;
      primaryMuscle: string;
    }
  | {
      kind: 'user';
      _id: Id<'userExercises'>;
      name: string;
      primaryMuscle: string;
    };

export function useExerciseSearch() {
  const [query, setQuery] = useState('');
  const { data: rawExercises } = useQuery(
    convexQuery(api.exercises.getAllExercises, {}),
  );
  const allExercises = useMemo(() => rawExercises ?? [], [rawExercises]);

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    if (allExercises.length === 0) return null;

    return new Fuse(allExercises, {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'primaryMuscle', weight: 0.3 },
      ],
      threshold: 0.4, // 0 = perfect match, 1 = match anything
      includeScore: true,
      minMatchCharLength: 1,
    });
  }, [allExercises]);

  // Filter exercises based on query
  const filteredExercises = useMemo(() => {
    if (!fuse) return [];

    if (query.trim() === '') {
      // Return first 20 exercises when no query
      return allExercises.slice(0, 20);
    }

    // Use Fuse.js for fuzzy search
    const fuseResults = fuse.search(query.trim());
    return fuseResults.map((result) => result.item);
  }, [fuse, query, allExercises]);

  return {
    query,
    setQuery,
    exercises: filteredExercises,
    isLoading: rawExercises === undefined,
  };
}
