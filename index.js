const tmi = require("tmi.js");
require("dotenv").config();
const hue = require("hue-node");
const axios = require("axios").default;
var convert = require("color-convert");

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

var usersList = [];

function onMessageHandler(target, context, msg, self) {
  var message = { target, context, msg, self };

  console.log(context.username + ": " + msg);

  if (context.username != process.env.TWITCH_NAME) {
    //client.say(target,`Hi ${context.username}`)
  }

  if (
    !usersList.includes(context.username) &&
    context.username != process.env.TWITCH_NAME
  ) {
    usersList.push(context.username);
    
    var index = usersList.length - 1;

    console.log(usersList);

    client.say(target,`Hey, ${context.username}, To change the color of ${process.env.CHANNEL_WATCH}'s lights, just type !lights then the color you want them to change to. Go ahead, give it a try!`);

    // Remove the user from the list after an hour
    setTimeout(()=>{
      usersList.forEach((username,i)=>{
        if (username == context.username) {
          usersList = usersList.splice(i, i);
        }
        //console.log(usersList);
        
      })
    },36000000)
    

   
  }

  console.log(msg.substr(0, 6));
  if (msg.substr(0, 7).includes("!lights")) {
    color = msg.substr(8, msg.length);

    var huey = convert.keyword.hsl(color);
    

    setLights(huey[0], 255, 255, target);
    client.say(target, `Lights changed to ${color}`);
  }
}

function onConnectedHandler(addr, port) {
  console.log("Connected to channel");
  target = "#withenex";


  
  /*setInterval(()=>{
    client.say(target,`To change the color of ${process.env.CHANNEL_WATCH}'s lights, just type !lights then the color you want them to change to. Go ahead, give it a try!`);
  },60000);*/
}

function setLights(h, s, l, target) {
  var group = 1;
  h *= Math.round(65535 / 360);
  console.log(h);
  var url = `http://${process.env.BRIDGE_IP}/api/${process.env.HUE_UNAME}/groups/${group}/action`;
  axios.put(url, { hue: h, sat: s, bri: l }).then((res) => {});
}
