import * as core from '@actions/core';
import semver from 'semver';

export function getAppDiff(newTag, oldTag) {
// get semVer diff between new and old tag
    const coercedNewTag = semver.coerce(newTag);
    const coercedOldTag = semver.coerce(oldTag);
    if (!semver.valid(coercedNewTag) || !semver.valid(coercedOldTag)) {
        core.setFailed('Invalid tag format detected');
        return;
    }
    const diff = semver.diff(coercedNewTag, coercedOldTag);
    return diff;
}

export function createNewChartVersion(chartVersion, diff) {
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
        chartVersion = semver.inc(chartVersion, 'minor');

    } else if (diff === 'patch') {
        chartVersion = semver.inc(chartVersion, 'patch');
    } else {
        core.setFailed('Unknown version detected');
        return;
    }
    return chartVersion;
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
        if (diff) {
            core.setOutput('diff', diff);
            core.debug(`Diff: ${diff}`);
        }
const newChartVersion = createNewChartVersion(chartVersion, diff);
if (newChartVersion) {
    core.setOutput('new_chart_version', newChartVersion);
} else {
    core.setFailed('Failed to create new chart version');
}
    } catch (error) {
        core.setFailed(error.message);
        core.debug(`Error: ${error.message}`);
    }
}

run();
