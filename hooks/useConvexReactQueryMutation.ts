import { useConvexMutation } from '@convex-dev/react-query';
import type { FunctionReference } from 'convex/server';
import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

export const useConvexReactQueryMutation = <
  Mutation extends FunctionReference<'mutation', 'public'>,
>(
  mutation: Mutation,
  queryOptions?: UseMutationOptions<
    Mutation['_returnType'],
    Error,
    Mutation['_args'],
    unknown
  >,
) => {
  const mutationFn = useConvexMutation(mutation);
  return useMutation({
    mutationFn: mutationFn,
    ...queryOptions,
  });
};
