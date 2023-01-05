#!/bin/bash -ex

yarn typecheck
yarn lint
# yarn test

rm -rf dist
npm run tsc -- -p .
rm -fr dist/__tests__
