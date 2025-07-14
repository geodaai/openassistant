#!/bin/bash

# Setup DCO (Developer Certificate of Origin) for GeoDaLib contributors

echo "🔐 Setting up DCO (Developer Certificate of Origin) for GeoDaLib..."

# Check if git is configured
if ! git config --global user.name > /dev/null 2>&1; then
    echo "❌ Git user.name is not configured"
    echo "Please run: git config --global user.name 'Your Name'"
    exit 1
fi

if ! git config --global user.email > /dev/null 2>&1; then
    echo "❌ Git user.email is not configured"
    echo "Please run: git config --global user.email 'your.email@example.com'"
    exit 1
fi

echo "✅ Git configuration found:"
echo "   Name: $(git config --global user.name)"
echo "   Email: $(git config --global user.email)"

# Ask user if they want to enable automatic sign-off
read -p "Do you want to enable automatic sign-off for all commits? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git config --global format.signoff true
    echo "✅ Automatic sign-off enabled"
    echo "   All future commits will automatically include the Signed-off-by line"
else
    echo "ℹ️  Automatic sign-off not enabled"
    echo "   You can manually sign commits using: git commit -s -m 'Your message'"
fi

# Create a git hook for interactive sign-off
read -p "Do you want to create a git hook for interactive sign-off? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    HOOK_DIR=".git/hooks"
    HOOK_FILE="$HOOK_DIR/prepare-commit-msg"
    
    # Create hooks directory if it doesn't exist
    mkdir -p "$HOOK_DIR"
    
    cat > "$HOOK_FILE" << 'EOF'
#!/bin/sh
exec < /dev/tty
node -e "
  const rl = require('readline').createInterface({input: process.stdin, output: process.stdout});
  rl.question('Sign-off commit? (y/N): ', answer => {
    if (answer.toLowerCase() === 'y') {
      const fs = require('fs');
      const msgFile = process.argv[1];
      const msg = fs.readFileSync(msgFile, 'utf8');
      const signOff = 'Signed-off-by: ' + require('child_process').execSync('git config user.name').toString().trim() + ' <' + require('child_process').execSync('git config user.email').toString().trim() + '>';
      fs.writeFileSync(msgFile, msg + '\n\n' + signOff);
    }
    rl.close();
  });
" $1
EOF
    
    chmod +x "$HOOK_FILE"
    echo "✅ Git hook created at $HOOK_FILE"
    echo "   You will be prompted to sign-off each commit"
else
    echo "ℹ️  Git hook not created"
fi

echo ""
echo "🎉 DCO setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Make your changes"
echo "   2. Commit with sign-off: git commit -s -m 'Your message'"
echo "   3. Push and create a pull request"
echo ""
echo "📚 For more information:"
echo "   - Contributing Guide: contributing/CONTRIBUTING.md"
echo "   - DCO Documentation: DCO.md"
echo "   - DCO Homepage: https://developercertificate.org/" 