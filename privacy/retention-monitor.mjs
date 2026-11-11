/**
 * Standalone Cloudflare scheduled retention monitor.
 * NOT deployed or connected to production. No DELETE/UPDATE statements.
 * A cron trigger must be configured explicitly in a future reviewed deployment.
 */
import { previewSupportRetention, previewVisibilityRetention } from './retention-preview.mjs';

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
    ctx.waitUntil((async () => {
      const [support, visibility] = await Promise.all([
        previewSupportRetention(env.SUPPORT_DB),
        previewVisibilityRetention(env.VISIBILITY_DB),
      ]);
      // Aggregate counts only. Never log personal data or record identifiers.
      console.log(JSON.stringify({
        event: 'retention_preview',
        mode: 'DRY_RUN_ONLY',
        support: {
          conversationCandidates: support.conversationCandidates,
          resolvedTicketCandidates: support.resolvedTicketCandidates,
          knowledgeGapCandidates: support.knowledgeGapCandidates,
        },
        visibility: { auditCandidates: visibility.auditCandidates },
      }));
    })());
  },
};
