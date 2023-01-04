set -ex

# ruby scripts/version-inc.rb
bash scripts/build.sh
echo $?
npm publish
