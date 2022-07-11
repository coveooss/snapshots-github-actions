import { context, getOctokit } from "@actions/github";
const octokit = getOctokit(process.env.GITHUB_TOKEN);

(async () => {
  await octokit.rest.issues.updateComment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    comment_id: context.payload.comment.id,
    body: context.payload.comment.body.replace("[x]", "[ ]"),
  });
})();
