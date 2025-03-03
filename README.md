# action-chart-semver

Action to update helm chart version based on the change in tag version from dependabot update

## Inputs
- **old_tag**: The previous tag version
- **new_tag**: The new tag version
- **chart_version**: The current chart version

## Outputs
- **diff**: The difference between the old and new tag version
- **new_chart_version**: The new chart version

## Secrets

## Usage
Used in our helm chart repo to update version tags. 
See [here](https://github.com/discoverygarden/helm-charts/blob/main/.github/workflows/chart-version.yml#L48)

