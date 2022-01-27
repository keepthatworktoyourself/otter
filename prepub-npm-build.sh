set -ex

# Run the main build task solely to generate dist/index.*.css
npm run build
mkdir dist/css
cp -R dist/index*.css dist/css/all.css
cp -R src/css/*.css dist/css/
rm dist/index*

# For library use, just transpile into dist/ using babel
npm run babel
