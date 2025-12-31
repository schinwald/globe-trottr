#!/bin/bash

# Clean up the shared types directory
rm -rf ../shared/types
echo "Cleaned up shared types directory"

# Generate protobuf types
buf generate
echo "Generated protobuf types"

# Copy all model types to the shared types directory
rsync -av --prune-empty-dirs --include='*/' --include='*.d.ts' --exclude='*' \
  src/utils/redis/models/ ../shared/types/models/ > /dev/null
echo "Copied model types to shared types directory"
