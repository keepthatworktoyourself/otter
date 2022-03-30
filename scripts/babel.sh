[[ -z $DIST ]] && DIST=dist
[[ -z $WATCH ]] || WATCH="-w"
mkdir -p $DIST

npx babel src/index.js $WATCH -d $DIST --presets=@babel/preset-env,@babel/preset-react &
npx babel src/core $WATCH -d $DIST/core --presets=@babel/preset-env,@babel/preset-react
