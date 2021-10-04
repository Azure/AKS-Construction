#
# Bicep installation for PSRule
#
# Note:
# This content is set in .ps-rule/Bicep.Rule.ps1
# Install the latest Bicep CLI binary for alpine
Invoke-WebRequest -Uri 'https://github.com/Azure/bicep/releases/latest/download/bicep-linux-musl-x64' -OutFile $Env:GITHUB_WORKSPACE/bicep.bin
# Set executable
chmod +x $Env:GITHUB_WORKSPACE/bicep.bin
# Copy to PATH environment
Move-Item $Env:GITHUB_WORKSPACE/bicep.bin /usr/local/bin/bicep
