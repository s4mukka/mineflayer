let i = 0

function app (bots, start) {
  if (i < bots.length) {
    if (i === 0) {
      setTimeout(() => {
        start(bots[i].name, bots[i].pass)
        i++
        app(bots, start)
      }, 100)
    } else {
      setTimeout(() => {
        start(bots[i].name, bots[i].pass)
        i++
        app(bots, start)
      }, 10000)
    }
  }
}

export { app }
