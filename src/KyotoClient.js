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
* @class Kyoto Code™
*/
class KyotoCode {
	/**
	* no shards
	* @param {*} client - objeto client do discord.js
	*/
	constructor(client) {
		//Checka se o author instalou o discord.js
		try {
			this.discord = require("discord.js")
		} catch (e) {
			throw new Error("discord.js não encontrado!")
		}
		if (!client) throw new Error("Defina o client!")
		this.client = client
		this.v11 = this.discord.version <= "12.0.0"
		this.v12 = this.discord.version >= "12.0.0"
		database.ref(`Bots/${this.client.user.id}`).once("value").then(async function(snap) {
			if (!snap.val()) new Error("Bot não encontrado na bot list!")
		})
		
		if (this.client.shards) {
			this.sharding = true
			
			throw new Error(
				"ShardingManager detectada. Use o ShardingClient!"
			)
		} else this.sharding = false
	}
		
		async post() {
			if (this.sharding)
				return new Error(
				"Use o cliente de fragmentação statcord se desejar usar fragmentos"
			)

				//contadores
				let guild_count = 0
				let user_count = 0
				//v12 code
				if (this.v12) {
					guild_count = this.client.guilds.cache.size
					user_count = this.client.users.cache.size
				} else if (this.v11) {
					//v11 code
					guild_count = this.client.guilds.size
					user_count = this.client.users.size
				}
				database.ref(`Bots/${this.client.user.id}`).update({
					guild: guild_count.toString(),
					user: user_count.toString(),
				})
		}
		async run() {
			if (this.sharding) {
				throw new Error(
					"Use o cliente de fragmentação statcord se desejar usar fragmentos"
				)
			}
			console.log("Kyoto Code™ - Módulo online e ativo.")
			let post = await this.post()
			
			//atualiza no banco a cada hora!
			setInterval(async () => {
				await this.post()
			}, 60000)
			
			return Promise.resolve(post)
		}
		async botInfo() {
			database.ref(`Bots/${this.client.user.id}`).once("value").then(async function (snap) {
				console.log(`Owner Tag: ${snap.val().ownerTag}
Owner ID: ${snap.val().ownerID}
Bot Tag: ${this.client.user.tag}
Bot ID: ${this.client.user.id}
Votos: ${snap.val().votos}`)
			})
		}
}
		//Pegando shard na v12
		async function getGuildCountV12(client) {
			return (await client.shard.fetchClientValues("guilds.cache.size")).reduce((prev, current) => prev + current, 0)
		}
		async function getUserCountV12(client) {
			return (await client.shard.fetchClientValues("users.cache.size")).reduce((prev, current) => prev + current, 0)
		}
		
		//Pegando shard na v11
		async function getGuildCountV11(client) {
			return (await client.shard.fetchClientValues("guilds.size")).reduce((prev, current) => prev + current, 0)
		}
		async function getUserCountV11(client) {
			return (await client.shard.fetchClientValues("users.size")).reduce((prev, current) => prev + current, 0)
		}
//fim
module.exports = KyotoCode