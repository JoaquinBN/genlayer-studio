#!/bin/bash

# GenLayer Studio ngrok startup script
echo "Starting ngrok tunnels for GenLayer Studio..."

# Check if ngrok config exists
if [ ! -f "ngrok.yml" ]; then
    echo "Error: ngrok.yml not found. Please make sure it exists in the current directory."
    exit 1
fi

# Check if authtoken is set
if grep -q "YOUR_NGROK_AUTHTOKEN_HERE" ngrok.yml; then
    echo "Warning: Please update YOUR_NGROK_AUTHTOKEN_HERE in ngrok.yml with your actual ngrok authtoken"
    echo "You can get your authtoken from: https://dashboard.ngrok.com/get-started/your-authtoken"
    echo ""
    echo "To set it up:"
    echo "1. Sign up/login at https://ngrok.com"
    echo "2. Copy your authtoken"
    echo "3. Replace YOUR_NGROK_AUTHTOKEN_HERE in ngrok.yml"
    echo ""
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Start ngrok with the config file
echo "Starting ngrok with multiple tunnels (free plan - random URLs)..."
ngrok start --config=ngrok.yml --all

echo "ngrok tunnels started!"
echo ""
echo "⚠️  Free plan notice: URLs are randomly generated and change on each restart"
echo ""
echo "Access the ngrok web interface at: http://localhost:4040 to see your URLs"
echo "Your tunnels will have random URLs like:"
echo "  Frontend: https://abcd1234.ngrok-free.app (port 8080)"
echo "  Backend:  https://efgh5678.ngrok-free.app (port 4000)"
echo ""
echo "💡 Tip: Check http://localhost:4040 for the exact URLs"