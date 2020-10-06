const firebase = require("firebase")

var firebaseConfig = {
    apiKey: "AIzaSyAqSfQiJVSR93SS49wjhy7OD8RZG-pwPLU",
    authDomain: "kyotocode.firebaseapp.com",
    databaseURL: "https://kyotocode.firebaseio.com",
    projectId: "kyotocode",
    storageBucket: "kyotocode.appspot.com",
    messagingSenderId: "423213735411",
    appId: "1:423213735411:web:25a6761537c065da9f0686"
  };
firebase.initializeApp(firebaseConfig)

var database = firebase.database()

/**

* @class ShardingClient
*/
class ShardingClient {
	/**
	* no shards
	* @param {*} client - objeto client do discord.js
	*/
	constructor(manager) {
		//checka se o author instalou o discord.js
		try {
			this.discord = require("discord.js")
		} catch (e) {
			throw new Error("discord.js não encontrado!")
		}
		database.ref(`Bots/${this.client.user.id}`).once("value").then(async function(snap) {
			if (!snap.val()) throw new Error("Bot não encontrado na bot-list!")
		})
		if (!manager) throw new Error("Está faltando a configuração de 'manager'!")
		if (!(manager instanceof this.discord.ShardingManager)) throw new TypeError("'manager' não é um manager de shard de discord.js!")
			
		this.manager = manager
		this.v11 = this.discord.version <= "12.0.0"
		this.v12 = this.discord.version >= "12.0.0"
		
		//checka se todas as shards estão online
		this.manager.on("shardCrete", shard => {
			let currShard = this.manager.shards.get(shard.id)
			if (shard.id + 1 == this.shard.totalShards) {
				currShard.once("ready", () => {
					setTimeout(() => {
						console.log("Kyoto Code™ - Módulo online e ativo")
						
						setInterval(async () => {
							await this.post()
						}, 60000)
					}, 200)
				})
			}
			currShard.on("message", async message => {
				if (!message || typeof message !== "string") return
				
				if (!message.startsWith("ssc")) return
				let args = message.split("|=-ssc-=|")
				if (args[0] == "sscpc") {
				} else if (args[0] == "sscp") {
					//Postar mensagem
					let post = await this.post()
					if (post) console.error(new Error(post))
				}
			})
		})
		async post() {
			let guild_count = 0
			let user_count = 0
			
			//v12 code
			if (this.v12) {
				guild_count = await getGuildCountV12(this.manager)
				user_count = await getUserCountV12(this.manager)
			} else if (this.v11) {
				guild_count = await getGuildCountV11(this.manager)
				user_count = await getUserCountV11(this.manager)
			}
			
			let id = (await this.manager.broadcastEval("this.user.id"))[0]
			let info = (await this.manager.broadcastEval("this.user"))[0]
			database.ref(`Bots/${id}`).update({
				guild: guild_count,
				user: user_count
			})
		}
		//v12 sharding get
		async function getGuildCountV12(manager) {
			return (await manager.fetchClientValues("guilds.cache.size")).reduce((prev, content) => prev + content, 0)
		}
		async function getUserCountV12(manager) {
			const memberNum = await manager.broadcastEval("this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0)")
			return memberNum.reduce((prev, memberCount) => prev + memberCount, 0)
		}
		//fim
		async function getGuildCountV11(manager) {
			return (await manager.fetchClientValues("guilds.size")).reduce((prev, current) => prev + current, 0)
		}
		async function getUserCountV11(manager) {
			return (await manager.fetchClientValues("users.size")).reduce((prev, current) => prev + current, 0)
		}
		//fim
	}
}
module.exports = ShardingClient
