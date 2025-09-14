import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { mutation } from './_generated/server';

export const createFeedback = mutation({
  args: {
    content: v.string(),
    subject: v.optional(v.string()),
    route: v.optional(v.string()),
    workoutId: v.optional(v.id('workouts')),
    exercise: v.optional(
      v.union(
        v.object({ kind: v.literal('global'), id: v.id('globalExercises') }),
        v.object({ kind: v.literal('user'), id: v.id('userExercises') }),
      ),
    ),
    userAgent: v.optional(v.string()),
    appVersion: v.optional(v.string()),
  },
  returns: v.id('feedback'),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const trimmedContent = args.content.trim();
    if (trimmedContent.length === 0) {
      throw new Error('Feedback content is required');
    }

    const feedbackId = await ctx.db.insert('feedback', {
      userId: userId as Id<'users'>,
      content: trimmedContent,
      subject: args.subject?.trim() || undefined,
      route: args.route?.trim() || undefined,
      workoutId: args.workoutId,
      exercise: args.exercise,
      userAgent: args.userAgent?.slice(0, 512),
      appVersion: args.appVersion?.slice(0, 128),
    });

    return feedbackId;
  },
});
