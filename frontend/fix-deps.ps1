# NoteSphere Emergency Fix Script
# Run this from the 'frontend' directory AFTER stopping the dev server.

# 1. Kill any stray node processes (optional but recommended)
# taskkill /F /IM node.exe

# 2. Delete corrupted folders
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item -Force package-lock.json

# 3. Clean npm cache
npm cache clean --force

# 4. Fresh Install with correct versions
npm install three@0.160.0 @react-three/fiber@8.13.0 @react-three/drei@9.88.0 buffer --legacy-peer-deps --force

# 5. Start dev
npm run dev
