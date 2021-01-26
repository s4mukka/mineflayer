import mineflayer from 'mineflayer'
import { Vec3 } from 'vec3'

enum Id {
    itemNetherWart = 372,
    plantedNetherWart = 115,
    soulSand = 88,
    diamondPickaxe = 278,
    diamondAxe = 279,
    air = 0
}

function NetherWartBot (username, password) {
  const bot = mineflayer.createBot({
    host: 'legacy.craftlandia.com.br',
    username: username,
    version: '1.8'
  })

  bot.on('login', () => {
    console.log(`[${bot.username}] Conectado!`)
    bot.chatAddPattern(/^» Olá, essa parece ser a sua primeira vez no servidor\./, 'register', 'Craftlandia register')
    bot.chatAddPattern(/^»Bem vindo de volta\. Por favor digite \/login sua-senha\.$/, 'logar', 'Craftlandia logar')
    bot.chatAddPattern(/^» Agora você está logado\. NUNCA use a mesma senha do CraftLandia em outros servidores\. JAMAIS passe sua senha para outras pessoas\. Admins NUNCA irao pedir sua senha! «$/, 'loged', 'Craftlandia loged')
    bot.chatAddPattern(/^(?:Teleportado\.|Teleported\.|Teleportado\(a\)!)$/, 'teleported', 'Craftlandia teleported')
    bot.chatAddPattern(/^\(Mensagem de ([\d\w_-]+)\): (.+)$/, 'whisper', 'Craftlandia whisper')
  })

  bot.on<any>('register', () => {
    bot.chat(`/register ${password} ${password}`)
    console.log(`[${bot.username}] Registrado!`)
  })

  bot.on<any>('logar', () => {
    bot.chat(`/login ${password}`)
    console.log(`[${bot.username}] Fazendo login...`)
  })

  bot.on<any>('loged', () => {
    console.log(`[${bot.username}] Logado com sucesso!`)
    netherwart()
  })

  bot.on('kicked', () => {
    console.log(`[${username}] Deslogado!`)
  })

  bot.on('whisper', (username, message) => {
    if (username === 'Morking') {
      switch (message.toLowerCase()) {
        case 'herbalismo':
          console.log(`[${bot.username}] Iniciando herbalismo`)
          bot.chat(`/tell ${username} Iniciando macro de Herbalismo`)
          //   herbalismo()
          break
        default:
          bot.chat(message)
          break
      }
    }
  })

  function teleport (home): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log(`[${bot.username}] Indo para /home ${home} ...`)
      bot.chat(`/home ${home}`)

      bot.once<any>('teleported', () => {
        console.log(`[${bot.username}] Teleportado!`)
        resolve()
      })
    })
  }

  function setHome (home): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log(`[${bot.username}] Setando home para ${home} ...`)
      bot.chat(`/sethome ${home}`)
    })
  }

  async function netherwart (): Promise<void> {
    console.log(`[${bot.username}] Iniciando a macro de Fungo`)
    await teleport('fungo')
    setInterval(netherwartControl, 1000)
  }

  async function netherwartControl (): Promise<void> {
    try {
      const onBlock = bot.blockAt(new Vec3(bot.entity.position.x, bot.entity.position.y + 1, bot.entity.position.z))
      const blockFloor = bot.blockAt(bot.entity.position)

      if (!onBlock) {
        return
      }

      if (!blockFloor) {
        return
      }

      if (bot.inventory.emptySlotCount() <= 3) {
        console.log(`[${bot.username} Inventário cheio!]`)
      } else if (blockFloor.type === Id.soulSand && onBlock.type === Id.plantedNetherWart && onBlock.metadata === 3) {
        // @ts-ignore
        const item = bot.inventory.findInventoryItem(Id.diamondAxe)

        if (item) {
          bot.setQuickBarSlot(8)
          if (bot.entity.heldItem.type === Id.diamondAxe) {
            await bot.dig(onBlock, true)
          }
        }
      } else if (blockFloor.type === Id.soulSand && onBlock.type === Id.air) {
        // @ts-ignore
        const item = bot.inventory.findInventoryItem(Id.itemNetherWart)

        if (item) {
          bot.setQuickBarSlot(1)
          if (bot.entity.heldItem.type === Id.itemNetherWart) {
            await bot.placeBlock(blockFloor, new Vec3(0, 1, 0))
          }
        }
      } else if (blockFloor.type === Id.soulSand && onBlock.type === Id.plantedNetherWart && (onBlock.metadata === 1 || onBlock.metadata === 2)) {
        return
      }
    } catch (err) {
      console.log(`[${bot.username}]`, err)
    }
  }
}

export { NetherWartBot }
