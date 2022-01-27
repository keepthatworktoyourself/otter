DEST=$1

npx babel -w --presets=@babel/preset-env,@babel/preset-react src/index.js -d $DEST &
npx babel -w --presets=@babel/preset-env,@babel/preset-react src/core -d "$DEST/core"
