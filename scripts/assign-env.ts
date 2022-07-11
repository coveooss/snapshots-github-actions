import { getOctokit, context } from "@actions/github";
import { setOutput } from "@actions/core";

const octokit = getOctokit(process.env.GITHUB_TOKEN);

function getBranchName() {
    const issueDataExtractorRegexp = /###\sBranch name\s+(?<orgname>.*)/gm;
    const match = issueDataExtractorRegexp.exec(context.payload.issue.body);
    return match.groups.orgname.toLowerCase();
}

async function getAvailableEnvironmentLabels() {
    const allLabels = (await octokit.rest.issues.listLabelsForRepo({ ...context.repo })).data;
    const filteredLabelsSet = new Set(allLabels.filter(label => label.name.startsWith('Dev')).map(label => label.name));
    const issuesWithEnv = (await octokit.rest.issues.listForRepo({ ...context.repo, labels: Array.from(filteredLabelsSet.keys()).join(','), state: 'open', filter: 'all' })).data;
    for (const issue of issuesWithEnv) {
        for (const issueLabel of issue.labels) {
            filteredLabelsSet.delete(typeof issueLabel === 'string' ? issueLabel : issueLabel.name);
        }
    }
    const availableLabels = Array.from(filteredLabelsSet.values());
    return availableLabels;
}

(async () => {
    const availableLabels = await getAvailableEnvironmentLabels();

    if (availableLabels.length === 0) {
        throw new Error('No environment available');
    }

    const assignedLabel = availableLabels[0];
    const branchName = getBranchName();

    setOutput('branch-name', branchName);
    setOutput('env-name', assignedLabel)
})()
