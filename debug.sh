#!/bin/bash

ts-node index.ts
while [[ $? -eq 123 ]]; do
    echo 'Reloading shell...'
    ts-node index.ts
done