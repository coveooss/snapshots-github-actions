import { context } from "@actions/github";
import { setOutput } from "@actions/core";

const issueDataExtractorRegexp = /###\sBranch\/Org name\s+(?<orgname>.*)/gm;

const match = issueDataExtractorRegexp.exec(context.payload.issue.body);
setOutput('orgname',match.groups.orgname.toLowerCase());