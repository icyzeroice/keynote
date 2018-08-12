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

    this.coordinate = []
    
    this.edge = {
      start_x: 0,  // --+--> offset
      start_y: 0,  // --+
      end_x: 1,
      end_y: 1,
      h: 1,
      w: 1
    }

    this.lock = false
  }

  init() {
    this._bindWinEvent()
  }

  _bindWinEvent() {
    window.addEventListener('load', () => this._winLoad())
    window.addEventListener('resize', () => this._winResize())
    // key operation
    window.addEventListener('keyup', (event) => this._keyHandler(event))
  }

  _winLoad() {
    this._getDom()
    this._getWinSize()
    this._setSize()
    this._setBackground()
    this._getCoordinate()
    this._setPosition()
    this._setContainer()
  }

  _winResize() {
    // TODO: debounce handler
    this._getWinSize()
    this._setSize()
    this._setPosition()
    this._setContainer()
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

    visible.style.position = 'relative'
    visible.style.overflow = 'hidden'
    
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

  _setBackground() {
    // TODO: support background-image
    for (let slide of this.dom.slides) {
      slide.style.backgroundColor = slide.dataset.background
      slide.style.color = slide.dataset.color
    }
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

  _getCoordinate() {
    let pointer_x = 0
    let pointer_y = 0

    for (let slide of this.dom.slides) {
      switch (slide.dataset.position) {
        case 'center': {
          break
        }
        case 'top': {
          pointer_y -= 1
          break
        }
        case 'bottom': {
          pointer_y += 1
          break
        }
        case 'left': {
          pointer_x -= 1
          break
        }
        case 'right': {
          pointer_x += 1
          break
        }
      }

      this.coordinate.push({
        x: pointer_x,
        y: pointer_y
      })
    }

    Log.record('coordinate', this.coordinate)
  }

  _setPosition() {
    let index = 0

    for (let slide of this.dom.slides) {
    
      slide.style.top = this.coordinate[index].y * this.sh + 'px'
      slide.style.left = this.coordinate[index].x * this.sw + 'px'
      
      index++
    }
  }

  _setContainer() {
   /**
    * TODO: set container according to this.index
    * generator Adapter
    * 
    *        |                             |
    *  start o----+----+----> y start o----+----+----> y
    *        | 1  | 2  |              | 2  | 1  |
    *        +----+----+              +----+----+
    *        |    | 3  |              | 3  |
    *      x V    +----o end          +----+    o end
    *                                      |
    *  offset: 0, 0                        V x  offset = -1, 0
    */

    for (let dot of this.coordinate) {
      this.edge.start_x = this.edge.start_x <= dot.x ? this.edge.start_x : dot.x
      this.edge.start_y = this.edge.start_y <= dot.y ? this.edge.start_y : dot.y
      this.edge.end_x = this.edge.end_x >= dot.x + 1 ? this.edge.end_x : dot.x + 1
      this.edge.end_y = this.edge.end_y >= dot.y + 1 ? this.edge.end_y : dot.y + 1
    }

    // set container size
    this.edge.w = this.edge.end_x - this.edge.start_x
    this.edge.h = this.edge.end_y - this.edge.start_y
    this.dom.container.style.width = this.edge.w * this.sw + 'px'
    this.dom.container.style.height = this.edge.h * this.sh + 'px'

    // set container position
    this.dom.container.style.top = this.edge.start_y * this.sh + 'px'
    this.dom.container.style.left = this.edge.start_x * this.sw + 'px'

    // adjust slide position
    for (let slide of this.dom.slides) {
      slide.style.left = parseInt(slide.style.left) - this.edge.start_x * this.sw + 'px'
      slide.style.top = parseInt(slide.style.top) - this.edge.start_y * this.sh + 'px'
    }
  }

  _keyHandler(event) {

    Log.record('keyup event', event)

    if (event.preventDefaulted) {
      return
    }

    if (this.lock) {
      return
    }

    switch (event.keyCode) {
      // Space
      case 32:
      // arrow right
      case 39:
      // arrow down
      case 40: {
        this.pushToNextSlide()
        break
      }
      // arrow left
      case 37:
      // arrow up
      case 38: {
        this.pushToPrevSlide()
        break
      }
    }
  }

  _changeBackColor(currIndex, nextIndex, time) {
    this.lock = true

    let win = this.dom.visible
    let curr = this.dom.slides[currIndex]
    let next = this.dom.slides[nextIndex]
    let currBgColor = curr.style.backgroundColor
    let nextBgColor = next.style.backgroundColor

    // color mask
    win.style.backgroundColor = currBgColor

    // 1. clear slide color
    curr.style.backgroundColor = ''
    next.style.backgroundColor = ''
    
    // 2. change color at this.visible aspect
    win.style.transition = 'all 1s linear'
    win.style.backgroundColor = nextBgColor

    // 3. reset color
    setTimeout(() => {
      curr.style.backgroundColor = currBgColor
      next.style.backgroundColor = nextBgColor
      win.style.transition = ''

      this.lock = false
    }, time)
  }

  pushToNextSlide() {
    let nextIndex = this.index + 1
    if (nextIndex >= this.dom.slides.length) {
      return
    }

    this._pushSlideAction(this.index, nextIndex)
    this._changeBackColor(this.index, nextIndex, 1000)
    this.index = nextIndex
  }

  pushToPrevSlide() {
    let nextIndex = this.index - 1
    if (nextIndex < 0) {
      return
    }

    this._pushSlideAction(this.index, nextIndex)
    this._changeBackColor(this.index, nextIndex, 1000)
    this.index = nextIndex
  }

  _pushSlideAction(currIndex, nextIndex) {

    // move at the x axis and the y axis
    let mvX = (this.coordinate[nextIndex].x - this.coordinate[currIndex].x) * this.sw
    let mvY = (this.coordinate[nextIndex].y - this.coordinate[currIndex].y) * this.sh

    this.dom.container.style.left = parseInt(this.dom.container.style.left) - mvX + 'px'
    this.dom.container.style.top = parseInt(this.dom.container.style.top) - mvY + 'px'
  }

  overview() {

    // TODO: overview
    let scale = 1 / Math.max(this.sh, this.sw)
  
    

    this.dom.container.style.transform = `scale(${scale})`
  }
}
