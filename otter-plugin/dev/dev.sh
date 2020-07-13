# dev.sh
#
# During dev, we will need to make changes to this package,
# but also simultaneously to the packages it relies on.
#
# So we start 2 dev processes:
#
# - otter-editor
# - this bundle
#
# For otter-wp, we just copy in the file and change the import
# to use the local otter-editor dep.
#

rm -rf dist
rm -rf deps


cd ../..
npm run build--npm
npm run dev--plugin &


cd otter-plugin/dev
mkdir deps
cp ../otter-wp/otter-wp.jsx ./deps/
sed -i '' -e 's/otter-editor/.\/otter-editor\/index.js/' deps/otter-wp.jsx


sleep 10
npm run dev &


trap 'kill $(jobs -p); exit' SIGINT
while true; do sleep 86400; done

