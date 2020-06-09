lerna publish
lerna publish --no-git-tag-version --no-push --skip-npm
lerna publish --no-git-tag-version --no-push --skip-npm --force-publish
lerna publish from-git --no-git-tag-version --no-push --force-publish
lerna publish from-git --force-publish
npm v2

### build and publish
npm install
npm run pkg -- -y