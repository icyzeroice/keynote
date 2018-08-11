import Log from '../../lib/log'
import Setting from './setting'

export default class Keynote {
  
  constructor(visible) {
    this.dom = {
      visible: visible,
      container: '',
      slides: '',
      contents: ''
    }

    // slide height & slide width
    this.sh = 0
    this.sw = 0

    // current slide order
    this.index = 0
  }

  init() {
    this._bindWinEvent()
  }

  _bindWinEvent() {
    window.addEventListener('load', () => this._winLoad())
    window.addEventListener('resize', () => this._winResize())
  }

  _winLoad() {
    this._getDom()
    this._getWinSize()
    this._setSize()
  }

  _winResize() {
    // TODO: debounce handler
    this._getWinSize()
    this._setSize()
  }

  _getDom() {

    // get DOM
    this.dom.visible = document.querySelector(this.dom.visible)
    this.dom.container = this.dom.visible.querySelector(Setting.CONTAINER_CLASS)
    this.dom.slides = this.dom.visible.querySelectorAll(Setting.SLIDE_CLASS)
    this.dom.contents = this.dom.visible.querySelectorAll(Setting.CONTENT_CLASS)
  }

  _getWinSize() {
    // get Slide Size(Height & Width)
    this.sh = this.dom.visible.offsetHeight
    this.sw = this.dom.visible.offsetWidth
  }

  _setSize() {
    const visible = this.dom.visible

    this.dom.visible.style.position = 'relative'
    
    // set slide size the same to `window`
    for (let slide of this.dom.slides) {
      slide.style.width = this.sw + 'px'
      slide.style.height = this.sh + 'px'
    }
    
    // scale content
    for (let content of this.dom.contents) {
      content.style.transform = `scale(${this._getContentScale()})`
    }
    
    Log.record('slide size', this.sw, this.sh)
  }

  _getContentScale() {
    let scale = 1
    const ratio = this.sw / this.sh

    // let content height equals to slide height
    //   +--+----+--+
    //   |  |    |  |
    //   +--+----+--+
    if (ratio > Setting.CONTENT_WIDTH / Setting.CONTENT_HEIGHT) {
      scale = this.sh / Setting.CONTENT_HEIGHT
    }

    // let content width equals to slide width
    //   +----+
    //   +----+
    //   |    |
    //   +----+
    //   +----+
    else {
      scale = this.sw / Setting.CONTENT_WIDTH
    }

    Log.record('content scale', scale)
    return scale
  }

  _setPosition() {
    // remember current slide after resizing 
  }

  changeBackColor(prevColor, nextColor) {
    // 1. clear slide color
    // 2. change color at this.visible aspect
  }

  pushSlide() {
    // move this.container aspect
  }

  overview() {

  }
}
