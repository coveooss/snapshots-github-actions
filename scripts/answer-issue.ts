import { context, getOctokit } from "@actions/github";
// import { createAppAuth } from "@octokit/auth-app";
// import { Octokit } from "octokit";
const octokit = getOctokit(process.env.GITHUB_TOKEN);

(async () => {
  // This convulated authentication is only used to provide a machine user to comment on the issue.
  // const authSecrets = {
  //   appId: process.env.GHAPP_APP_ID,
  //   privateKey: process.env.GHAPP_PRIVATE_KEY,
  //   clientId: process.env.GHAPP_CLIENT_ID,
  //   clientSecret: process.env.GHAPP_CLIENT_SECRET,
  //   installationId: process.env.GHAPP_INSTALLATION_ID,
  // };

  // const octokit = new Octokit({
  //   authStrategy: createAppAuth,
  //   auth: authSecrets,
  // });


  // TODO: Modify comment with the orgId of the environment that is reserved for this PR.
  await assignLabel();
  await commentOnIssue();
})();

async function commentOnIssue() {
  const commentBody = `
Your development branch is now available on
https://github.com/${context.repo.owner}/${context.repo.repo}/tree/dev/${process.env.BRANCH_NAME}

Your assigned Coveo Organization is : ${process.env.ORG_ID}

----

- [ ] 👈Check that box to refresh your development branch with the content of the linked organization, and click on the button below to open a PR

 [![PRStart](https://raw.githubusercontent.com/${context.repo.owner}/${context.repo.repo}/main/.github/assets/PRButton.gif)](https://github.com/${context.repo.owner}/${context.repo.repo}/pull/new/dev/${process.env.BRANCH_NAME})

`;

  await octokit.rest.issues.createComment({
    issue_number: context.payload.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: commentBody
  });
}

function assignLabel() {
  return octokit.rest.issues.addLabels({ ...context.repo, issue_number: context.issue.number, labels: [process.env.LABEL_NAME] });
}

