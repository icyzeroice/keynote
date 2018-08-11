import Log from '../../lib/log'
import Setting from './setting'

export default class Keynote {
  
  /**
   * Creates an instance of Keynote.
   *
   * @typedef DIY_dom
   * @property {String|Element} container
   * @property {Array<Element>} slides
   * @property {Array<Element>} contents
   * 
   * @param { DIY_dom }
   * @param {Number} nextSlide
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
    this.dom.wrapper = container.querySelector(Setting.CONTAINER_CLASS)
    this.dom.slides = container.querySelectorAll(Setting.SLIDE_CLASS)
    this.dom.contents = container.querySelectorAll(Setting.SLIDE_CONTENT_CLASS)

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
    const _setPosition = this._initPosition()

    for (let slide of this.dom.slides.values()) {
      let position = slide.dataset.position
      Log.record('slide', position)

      // set css position
      _setPosition(this.dom, slide, position)
      // set css background-color / TODO: background-image
      this._setBackground(slide)
    }

    // TODO: get rid of reference to _setPosition?
  }


  _initPosition() {

    let pointer = {
      x: 0,
      y: 0
    }

  /**
    * 
    *  start o----+----+        start o----+----+
    *        | 1  | 2  |              | 2  | 1  |
    *        +----+----+              +----+----+
    *             | 3  |              | 3  |
    *             +----o end          +----+    o end
    *  
    */
    let wrapper = {
      start_x: [0, ],
      start_y: [0, ],
      end_x: [1, ],
      end_y: [1, ],
    }
    
    return function (dom, slide, position) {
      Log.record(position, position)

      if (position === "center") {
        setPosition(slide, pointer)
        setWrapperCorner(wrapper, pointer)
      }

      else if (position === 'top') {
        pointer.y -= 1
        setPosition(slide, pointer)
        setWrapperCorner(wrapper, pointer)
      }

      else if (position === 'bottom') {
        pointer.y += 1
        setPosition(slide, pointer)
        setWrapperCorner(wrapper, pointer)
      }

      else if (position === 'left') {
        pointer.x -= 1
        setPosition(slide, pointer)
        setWrapperCorner(wrapper, pointer)
      }

      else if (position === 'right') {
        pointer.x += 1
        setPosition(slide, pointer)
        setWrapperCorner(wrapper, pointer)
      }

      performWrapperSize(dom.wrapper, wrapper)
    }

    function setPosition(slide, pointer) {
      slide.style.top = pointer.y * 100 + '%'
      slide.style.left = pointer.x * 100 + '%'
    }

    function setWrapperCorner(wrapper, pointer) {
      wrapper.start_x.push(pointer.x)
      wrapper.start_y.push(pointer.y)
      wrapper.end_x.push(pointer.x + 1)
      wrapper.end_y.push(pointer.y + 1)
    }

    function performWrapperSize(wrapper, wrapper_point) {
      let start = {
        x: Math.min(...wrapper_point.start_x),
        y: Math.min(...wrapper_point.start_y)
      }
      let end = {
        x: Math.max(...wrapper_point.end_x),
        y: Math.max(...wrapper_point.end_y)
      }
      let heightScale = end.y - start.y
      let widthScale = end.x - start.x

      wrapper.style.width = widthScale * 100 + '%'
      wrapper.style.height = heightScale * 100 + '%'

      wrapper.style.top = start.y * 100 + '%'
      wrapper.style.left = start.x * 100 + '%'
    }
  }

  _setBackground(slide) {
    slide.style.backgroundColor = slide.dataset.background
  }

  /**
   * TODO: move slide
   */
  _moveSlideTo() {
    
  }
  move() {

  }


  overview() {
    // this.dom.container.style.transform = `scale(0.5)`
    window.onload = () => {
      
    }
  }
}
