import { accountSnippetSchema } from "fake-snippets-api/lib/db/schema"
import { withRouteSpec } from "fake-snippets-api/lib/middleware/with-winter-spec"
import { z } from "zod"

export default withRouteSpec({
  methods: ["POST"],
  auth: "session",
  jsonBody: z.object({
    snippet_id: z.string(),
  }),
  jsonResponse: z.object({
    ok: z.boolean(),
    is_starred: z.boolean(),
  }),
})(async (req, ctx) => {
  const { snippet_id } = req.jsonBody

  // Check if snippet exists
  const snippet = ctx.db.getSnippetById(snippet_id)
  if (!snippet) {
    return ctx.error(404, {
      error_code: "snippet_not_found",
      message: "Snippet not found",
    })
  }

  // check if not already starred
  if (!ctx.db.hasStarred(ctx.auth.account_id, snippet_id)) {
    return ctx.error(400, {
      error_code: "not_starred",
      message: "You have not starred this snippet",
    })
  }

  // Remove star
  ctx.db.removeStar(ctx.auth.account_id, snippet_id)

  return ctx.json({
    ok: true,
    is_starred: false,
  })
})
