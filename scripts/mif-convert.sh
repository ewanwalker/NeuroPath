#!/bin/bash
set -e
input="$1"
output="$2"

if [[ -z "$input" || -z "$output" ]]; then
    echo "Usage: $0 <input> <output>" >&2
    exit 1
fi

if [[ ! -e "$output" ]]; then
    mrconvert -force "$input" "$output"
    echo "Converted: $output"
else
    echo "Already exists: $output"
fi