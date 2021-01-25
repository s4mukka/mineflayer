import mineflayer from 'mineflayer'
import { Vec3 } from 'vec3'

function HerbalismBot (username, password) {
  const bot = mineflayer.createBot({
    host: 'legacy.craftlandia.com.br',
    username: username,
    version: '1.8'
  })

  bot.on('login', () => {
    console.log(`Conectado com ${bot.username}!`)
    bot.chatAddPattern(/^» Olá, essa parece ser a sua primeira vez no servidor\./, 'register', 'Craftlandia register')
    bot.chatAddPattern(/^»Bem vindo de volta. Por favor digite \/login sua-senha\.$/, 'logar', 'Craftlandia logar')
    bot.chatAddPattern(/^(?:Teleportado\.|Teleported\.|Teleportado\(a\)!)$/, 'teleported', 'Craftlandia teleported')
    bot.chatAddPattern(/^\(Mensagem de ([\d\w_-]+)\): (.+)$/, 'whisper', 'Craftlandia whisper')
  })

  bot.on<any>('register', () => {
    console.log(`Registrado com ${bot.username}`)
    bot.chat(`/register ${password} ${password}`)
  })

  bot.on<any>('logar', () => {
    console.log(`Logado com ${bot.username}!`)
    bot.chat(`/login ${password}`)
  })

  bot.on('whisper', (username, message) => {
    if (username === 'Morking') {
      switch (message.toLowerCase()) {
        case 'herbalismo':
          console.log('Iniciando herbalismo')
          bot.chat(`/tell ${username} Iniciando macro de Herbalismo`)
          herbalismo()
          break
        default:
          bot.chat(message)
          break
      }
    }
  })

  function teleport (home): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log(`Indo para /home ${home} ...`)
      bot.chat(`/home ${home}`)

      bot.once<any>('teleported', () => {
        console.log('Teleportado!')
        resolve()
      })
    })
  }

  function herbalismControl (): void {
    try {
      const onBlock = bot.blockAt(bot.entity.position)
      const blockFloor = bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y - 1, bot.entity.position.z))

      if (onBlock.type === 83) {
        bot.dig(onBlock, true, herbalismControl)
      } else {
        bot.placeBlock(blockFloor, new Vec3(0, 1, 0), herbalismControl)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function herbalismo (): Promise<void> {
    await teleport('cana')
    bot.look(0, -90, true, herbalismControl)
  }
}

export { HerbalismBot }
