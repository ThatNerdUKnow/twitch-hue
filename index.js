const tmi = require("tmi.js");
const chalk = require("chalk");
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

  if(self)
  {
    return;
  }
  msg = msg.toLowerCase();
  var args = msg.split(" ");
  var command = args[0];
  args = args.splice(1);
  console.log(chalk.bgBlue(context.username + ":") + " " + chalk.blue(msg));

  if (
    !usersList.includes(context.username) &&
    context.username != process.env.TWITCH_NAME
  ) {
    usersList.push(context.username);

    

    client.say(
      target,
      `Hey, ${context.username}, To change the color of ${process.env.CHANNEL_WATCH}'s lights, just type !lights then the color you want them to change to. Go ahead, give it a try! You know you want to LUL`
    );

    // Remove the user from the list after thirty minutes
    setTimeout((name) => {
      var temp = [];
      usersList.forEach((username) => {
        if (username != name) {
          temp.push(username);
        }
      },
      usersList = temp,
      console.log(chalk.bgRed(`removed ${context.username} from users list, the next time they talk, ${process.env.TWITCH_NAME} will tell them about the !lights command`)),
      console.log("Users List:",usersList)
      );
    }, 1800000,context.username); // Previously 1800000
  }

  if (command === "!lights" && args.length >= 1) {
    //color = msg.substr(8, msg.length);
    try{
    color = args.join(" ");
    var huey = convert.keyword.hsl(color);
    setLights(huey[0], huey[1],100, target);
    client.say(target, `Lights changed to ${color}`);
    }
    catch(err)
    {
      console.log(err);
      client.say(target,`There was a problem and I couldn't set the lights to ${color} NotLikeThis`);
    }
  }

  if(command === "!list")
  {
    console.log(usersList);
  }
}

function onConnectedHandler(addr, port) {
  console.log("Connected to channel");
  target = "#withenex";
  client.say(target,`Hey Everybody, this is ${process.env.TWITCH_NAME} reporting for duty CoolCat`)
}

function setLights(h, s, l, target) {
  console.log(h,s,l);
  var group = 1;
  h *= Math.round(65535 / 360);
  s = Math.round(s/100 * 254);
  l = Math.round(l/100 * 254);
  console.log(h,s,l);
  var url = `http://${process.env.BRIDGE_IP}/api/${process.env.HUE_UNAME}/groups/${group}/action`;
  axios.put(url, { hue: h, sat: s, bri: l }).then((res) => {
    console.log(res.data);
  });
}
