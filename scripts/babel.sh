[[ -z $DIST ]] && DIST=dist
[[ -z $WATCH ]] || WATCH="-w"
mkdir -p $DIST

npx browserslist@latest --update-db
npx babel src/index.js $WATCH -d $DIST --config-file ./scripts/.babelrc
npx babel src/core $WATCH -d $DIST/core --config-file ./scripts/.babelrc
