#!/bin/bash -ex

yarn typecheck
yarn lint

rm -rf dist
npm run tsc -- -p .
