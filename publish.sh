set -e

bash prepub-npm-build.sh
npm publish
cd otter-plugin/otter-wp
npm publish

