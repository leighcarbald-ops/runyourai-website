/**
 * Standalone Cloudflare scheduled retention monitor, never deployed by this PR.
 * Aggregate-only, read-only, fail-closed; no destructive SQL.
 */
import { previewCascadeSafeConversations, previewCascadeSafeAudits } from './cascade-preview.mjs';

export default {
  async fetch() {
    return new Response('Not publicly accessible', { status: 404 });
  },
  async scheduled(_event, env, ctx) {
    if (env.RETENTION_DELETE_ENABLED !== 'false') {
      throw new Error('Safety interlock: retention monitor requires RETENTION_DELETE_ENABLED=false');
    }
    if (!env.SUPPORT_DB?.prepare || !env.VISIBILITY_DB?.prepare) {
      throw new Error('Both isolated D1 bindings are required');
    }
    if (!ctx?.waitUntil) throw new TypeError('Scheduled execution context required');
    ctx.waitUntil((async () => {
      const [support, visibility] = await Promise.all([
        previewCascadeSafeConversations(env.SUPPORT_DB),
        previewCascadeSafeAudits(env.VISIBILITY_DB),
      ]);
      console.log(JSON.stringify({
        event: 'retention_cascade_preview',
        mode: 'DRY_RUN_ONLY',
        support: {
          conversationCandidates: support.candidates,
          cascade: support.cascade,
        },
        visibility: {
          auditCandidates: visibility.candidates,
          cascade: visibility.cascade,
        },
      }));
    })());
  },
};
