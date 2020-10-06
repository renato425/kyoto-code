# Kyoto Code™ API
* Discord: [https://discord.gg/TRkYNxT](https://discord.gg/TRkYNxT)
# Como utilizar
Para utilizar o módulo é preciso ter um bot inscrito em nosso servidor Discord. Após isso o package será liberado para uso.
# Exemplos
Criando client *Sem shard*: 
```js
const Discord = require("discord.js")
const client = new Discord.Client()
const KyotoCode = require("kyoto-code")

client.on("ready", async () => {
  console.log("agora o bot está online!")
  const API = new KyotoCode.Client(client)
  
  let initialpost = await API.run()
  if (initialpost) console.error(initialpost)
})
```
Criando client *Com shard*:
```js
const Discord = require("discord.js")
const client = new Discord.Client()
const KyotoCode = require("kyoto-code")

const manager = new Discord.ShardingManager("./bot.js", { TOKEN: "seu super secreto token" })
const API = new KyotoCode.ShardingClient(manager)
```
Pegando as informações do bot!
Como: tag do dono, id do dono, tag do bot, id do bot, e votos
```js
const res = await API.botInfo()
console.log(res)
```

# Usando nossos dados
Aqueles que usarem nosso dados sem a nossa permissão, terá alguns probleminhas como:
* Banimento do servidor oficial
* Perda de dados do banco
* Banimento de todos os servidores em referência á Kyoto Code™
