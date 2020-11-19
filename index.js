const tmi = require("tmi.js");
require("dotenv").config();
const hue = require("hue-node");
const axios = require("axios").default;
var convert = require('color-convert');

const opts = {
  identity: {
    username: process.env.TWITCH_NAME,
    password: process.env.TWITCH_TOKEN,
  },
  channels: [process.env.CHANNEL_WATCH],
};

const client = new tmi.client(opts);
client.connect();

client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);


function onMessageHandler(target, context, msg, self) {
    console.log(target);
  var message = { target, context, msg, self };
  console.log(context.username + ": " + msg);

  if (context.username != process.env.TWITCH_NAME) {
    //client.say(target,`Hi ${context.username}`)
  }

  console.log(msg.substr(0,6));
  if (msg.substr(0,7).includes("!lights")) {

     color = msg.substr(8,msg.length);
     console.log(color);
     var huey = convert.keyword.hsl(color);
     console.log(huey);

    setLights(huey[0], 255, 255, target);
    client.say(target,`Lights changed to ${color}`);
  }
}

function onConnectedHandler(addr, port) {
  console.log("Connected to channel");
  target = "#withenex";

  setInterval(()=>{
    client.say(target,`To change the color of ${process.env.CHANNEL_WATCH}'s lights, just type !lights then the color you want them to change to. Go ahead, give it a try!`);
  },60000);
}

function setLights(h, s, l, target) {
  var group = 1;
  h *= Math.round(65535/360);
  console.log(h);
  var url = `http://${process.env.BRIDGE_IP}/api/${process.env.HUE_UNAME}/groups/${group}/action`;
  axios.put(url, { hue: h, sat: s, bri: l }).then((res) => {
    
  });
}
