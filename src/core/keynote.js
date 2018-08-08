import Log from '../../lib/log'
import Setting from './setting'

export default class Keynote {
  /**
   * Creates an instance of Keynote.
   * @param {String|Element} container
   * @param {} 
   * @memberof Keynote
   */
  constructor(container) {
    this.dom = {
      container: container
    }
    this.nextSlide = 0
  }

  play() {
    this._init()
  }

  _init() {
    this._bindEvent()
  }

  /**
   * bind main event handlers
   */
  _bindEvent() {
    let debounce = this._windowResize()

    window.addEventListener('load', () => this._windowLoad())
    window.addEventListener('resize', () => debounce())
  }

  /**
   * while scripts loaded
   */
  _windowLoad() {
    Log.record('window', 'loaded')

    this._initDom()
    this._initStyle()
    this._initLayout()
  }

  /**
   * get the main dom object
   */
  _initDom() {
    // Container
    const container = this.dom.container = document.querySelector(this.dom.container)
    // Slides
    this.dom.slides = container.querySelectorAll('section')
    this.dom.contents = container.querySelectorAll('section .content')

    Log.record('dom', this.dom)
  }
  
  /**
   * set the main dom in right place or size
   */
  _initStyle() {
    const container = this.dom.container
    // Container
    container.style.position = 'relative'
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.overflow = 'hidden'

    const scale = this._getSlideScale()

    // Slide Scale
    for (let content of this.dom.contents.values()) {
      content.style.transform = `scale(${scale})`
    }
  }

  /**
   * get the scale radio to make full of the browser window
   */
  _getSlideScale() {
    let scale = 1
    const containerHeight = this.dom.container.offsetHeight
    const containerWidth = this.dom.container.offsetWidth
    const ratio = containerWidth / containerHeight

    Log.record('container', containerWidth, containerHeight)

    // use max height
    if (ratio > Setting.SLIDE_WIDTH / Setting.SLIDE_HEIGHT) {
      scale = containerHeight / Setting.SLIDE_HEIGHT
    }

    // use max width
    else {
      scale = containerWidth / Setting.SLIDE_WIDTH
    }

    Log.record('content scale', scale)
    return scale
  }

  /**
   * while window resized
   */
  _windowResize() {
    let handle
    Log.record('window', 'waiting for resizing')

    return () => {
      // debounce
      handle && clearTimeout(handle)

      handle = setTimeout(() => {
        this._initStyle()
        Log.record('window', 'resized!')
      }, Setting.WINDOW_RESIZE_TIMEOUT)
    }
  }

  /**
   * detect and set the slide initial position
   */
  _initLayout() {
    let prevSlide = null
    const _setPosition = this._setPositionOfSlide()

    for (let slide of this.dom.slides.values()) {
      let position = slide.dataset.position
      Log.record('slide', position)
      _setPosition(slide, position)
    }

    // TODO: get rid of reference to _setPosition?
  }


  _setPositionOfSlide() {
    let pointer = {
      x: 0,
      y: 0
    }
    
    return function (slide, position) {
      Log.record(position, position)
      switch(position) {
        case "center":
          setPosition(slide, pointer)
          break
        case "top":
          pointer.y -= 1
          setPosition(slide, pointer)
          break
        case "bottom":
          pointer.y += 1 
          setPosition(slide, pointer)
          break
        case "left":
          pointer.x -= 1
          setPosition(slide, pointer)
          break
        case "right":
          pointer.x += 1
          setPosition(slide, pointer)
          break
        default:
          break
      }
    }

    function setPosition(slide, pointer) {
      slide.style.top = pointer.y * 100 + '%'
      slide.style.left = pointer.x * 100 + '%'
    }
  }

  /**
   * TODO: move slide
   */
  _moveSlideTo() {

  }
  move() {

  }

}
