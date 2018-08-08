class DebugLog {

  constructor() {
    this.isDebug = true
    this.startTime = {}
  }

  record(label, ...args) {
    // turned off the debug mode
    if (!this.isDebug) return

    // turn on the debug mode
    let currentTime = new Date().getTime()
    let minus = 0
  
    if (this.startTime[label]) {
      minus = currentTime - this.startTime[label]
    }
    else {
      this.startTime[label] = currentTime
    }

    console.log(`%c[${label}: ${minus}ms]`, 'color: #00df00', ...args)
  }
}

export default new DebugLog()