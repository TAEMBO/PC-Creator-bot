const {token} = require("./tokens.json")
const {ShardingManager} = require("discord.js")
const sharder = new ShardingManager("./index.js", {token: token, totalShards: 1})
sharder.on("shardCreate", async (shard)=>{console.log(`Bot Started: Shard ${shard.id + 1} Created! `)})
sharder.spawn();