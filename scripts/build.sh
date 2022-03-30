[[ -z $DIST ]] && DIST=dist

set -e
export DIST

npm run clean
mkdir -p "$DIST/css"

# Use the main build task to generate css file(s)
npm run build
cp dist/index*.css $DIST/css/all.css
cp -R src/css/*.css $DIST/css/
rm dist/index*

# For library use, just transpile into dist using babel
bash scripts/babel.sh

# In localdev mode, copy package.json into dist
[[ $LOCALDEV ]] && cp package.json $DIST/../ || echo
