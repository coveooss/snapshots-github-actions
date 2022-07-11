import { setOutput } from "@actions/core";
import { context } from "@actions/github";
import assert from "assert";

assert.equal(context.actor, context.payload.issue.user.login); // Is the editor the author of the OP
assert.equal(context.payload.comment.user.login, "thetruebaguette[bot]"); // Is the OG comment writen by the bot
const before = context.payload.changes.body.from.split("[ ]");
// Is it just a check of the lil box?
const after = context.payload.comment.body.split("[x]");
assert.equal(before[0], after[0]);
assert.equal(before[1], after[1]);
// Whats the branch?
const branchname = /https\:\/\/github\.com\/.*\/.*\/tree\/(?<branchname>.*)\s/.exec(context.payload.comment.body).groups.branchname
setOutput('branchname',branchname);

