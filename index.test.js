import * as core from '@actions/core';
import semver from 'semver';
import { getAppDiff, createNewChartVersion } from './index';

jest.mock('@actions/core');

describe('getAppDiff', () => {
    it('should return the correct minor diff for valid semver tags', () => {
        const newTag = '1.2.0';
        const oldTag = '1.1.0';
        const diff = getAppDiff(newTag, oldTag);
        expect(diff).toBe('minor');
    });

    it('should return the correct patch diff for valid semver tags', () => {
        const newTag = '1.1.1';
        const oldTag = '1.1.0';
        const diff = getAppDiff(newTag, oldTag);
        expect(diff).toBe('patch');
    });

    it('should return the correct major diff for valid semver tags', () => {
        const newTag = '2.0.0';
        const oldTag = '1.1.0';
        const diff = getAppDiff(newTag, oldTag);
        expect(diff).toBe('major');
    });

    it('should return null for the same semver tags', () => {
        const newTag = '1.1.0';
        const oldTag = '1.1.0';
        const diff = getAppDiff(newTag, oldTag);
        expect(diff).toBe(null);
    });

    it('should return null for invalid semver tags', () => {
        const newTag = 'invalid';
        const oldTag = '1.1.0';
        getAppDiff(newTag, oldTag);
        expect(core.setFailed).toHaveBeenCalledWith('Invalid tag format detected');
    });
});

describe('createNewChartVersion', () => {
    it('should increment minor version for minor diff', () => {
        const chartVersion = '1.0.0';
        const diff = 'minor';
        const newChartVersion = createNewChartVersion(chartVersion, diff);
        expect(newChartVersion).toBe('1.1.0');
    });

    it('should increment patch version for patch diff', () => {
        const chartVersion = '1.0.0';
        const diff = 'patch';
        const newChartVersion = createNewChartVersion(chartVersion, diff);
        expect(newChartVersion).toBe('1.0.1');
    });

    it('should fail for major diff', () => {
        const chartVersion = '1.0.0';
        const diff = 'major';
        createNewChartVersion(chartVersion, diff);
        expect(core.setFailed).toHaveBeenCalledWith('Major version detected');
    });

    it('should fail for unknown diff', () => {
        const chartVersion = '1.0.0';
        const diff = 'unknown';
        createNewChartVersion(chartVersion, diff);
        expect(core.setFailed).toHaveBeenCalledWith('Unknown version detected');
    });

    it('should fail if no diff is provided', () => {
        const chartVersion = '1.0.0';
        createNewChartVersion(chartVersion, null);
        expect(core.setFailed).toHaveBeenCalledWith('No new version detected');
    });
});