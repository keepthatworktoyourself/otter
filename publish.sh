set -e

bash build-for-npm.sh
npm publish
cd otter-plugin/otter-wp
npm publish

