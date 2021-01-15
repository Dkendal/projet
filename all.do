#!/bin/bash

tsc --project tsconfig.release.json

cp lib/bin/projet.js lib/bin/projet

{
  echo "#!/usr/bin/env node"
  cat lib/bin/projet
} >lib/bin/projet.new

mv lib/bin/projet{.new,}

chmod u+x lib/bin/projet
