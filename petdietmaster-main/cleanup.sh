#!/bin/bash

# Remove build artifacts
rm -rf .next
rm -rf out
rm -rf build
rm -rf dist

# Remove dependencies
rm -rf node_modules

# Remove cache directories
rm -rf .cache
rm -rf .temp
rm -rf .tmp
rm -rf temp
rm -rf tmp

# Remove IDE files
rm -rf .idea
rm -rf .vscode
find . -type f -name "*.swp" -delete
find . -type f -name "*.swo" -delete

# Remove OS generated files
find . -type f -name ".DS_Store" -delete
find . -type f -name "Thumbs.db" -delete

# Remove log files
find . -type f -name "*.log" -delete
find . -type f -name "*.log.*" -delete

echo "Cleanup complete! Project is ready for GitHub push." 