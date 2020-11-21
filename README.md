# twitch-hue
Twitch chatbot that lets my viewers change the color of my lights

## Installation 
clone this repository, then
```
cd twitch-hue
npm install
```

## Setup
create a .env file with the following keys
- BRIDGE_IP = The ip address for your phillips hue bridge
- HUE_UNAME = Username for your hue application (See phillips hue documentation on how to get one)
- TWITCH_TOKEN = Oauth token for authentication for your bot
- TWITCH_NAME = Username of your twitch bot
- CHANNEL_WATCH = Your channel name

## Startup
```
npm run start
```
Or
```
node index.js
```
