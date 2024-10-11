const core = require('@actions/core');
const github = require('@actions/github');
const semver = require('semver');

function getAppDiff(newTag, oldTag) {
// get semVer diff between new and old tag
    if (!semver.valid(semver.coerce(newTag)) && !semver.valid(semver.coerce(oldTag))) {
        core.setFailed('Invalid tag format detected');
        return;
    }
    const diff = semver.diff(semver.coerce(newTag), semver.coerce(oldTag));
    return diff;
}

function createNewChartVersion(chartVersion, diff) {
    // if diff is null, exit
    if (!diff) {
        core.setFailed('No new version detected');
        return;
    }
// if diff is major, exit
    if (diff === 'major') {
        core.setFailed('Major version detected');
        return;
    }
    // else create chart version
    // if diff is minor, increment minor version of chart
    if (diff === 'minor') {
        return chartVersion = semver.inc(chartVersion, 'minor');
    } else if (diff === 'patch') {
        return chartVersion = semver.inc(chartVersion, 'patch');
    } else {
        core.setFailed('Unknown version detected');
        return;
    }
}

async function run() {
    try {
        const newTag = core.getInput('new_tag');
        const oldTag = core.getInput('old_tag');
        const chartVersion = core.getInput('chart_version');
        core.debug(`New tag: ${newTag}`);
        core.debug(`Old tag: ${oldTag}`);
        core.debug(`Chart version: ${chartVersion}`);
        const diff = getAppDiff(newTag, oldTag);
        core.setOutput('diff', diff);
        core.debug(`Diff: ${diff}`);
        const newChartVersion = createNewChartVersion(chartVersion, diff);
        core.setOutput('new_chart_version', newChartVersion);

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
