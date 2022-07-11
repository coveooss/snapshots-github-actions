import { getOctokit, context } from "@actions/github";
import assert from "assert";

(async () => {
  const octokit = getOctokit(process.env.GITHUB_TOKEN);
  const labels = (await octokit.rest.issues.listLabelsOnIssue({ ...context.repo, issue_number: context.issue.number })).data;
  assert(labels.some(label => label.name === 'org-request'))
  // if not allowed will throw.
  await octokit.rest.repos.checkCollaborator({
    owner: context.repo.owner,
    repo: context.repo.repo,
    username: context.actor,
  });
})();
