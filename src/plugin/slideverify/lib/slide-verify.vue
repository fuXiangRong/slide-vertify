<template>
  <div class="mask-box">
    <transition name="slide-fade">
      <div class="slider-pop" v-show="toShow">
        <div class="slider-pop-title">
          <span>请完成安全验证</span>
          <span v-show="showClose" class="iconfont icon-close" @click="cancel"></span>
        </div>
        <div class="slide-verify" id="slideVerify" onselectstart="return false;">
          <canvas :width="w" :height="h" ref="canvas"></canvas>
          <div @click="refresh" class="slide-verify-refresh-icon">
            <span class="iconfont icon-shuaxin"></span>
          </div>
          <canvas :width="w" :height="h" ref="block" class="slide-verify-block"></canvas>
          <!-- container -->
          <div
            class="slide-verify-slider"
            :class="{'container-active': containerActive, 'container-success': containerSuccess, 'container-fail': containerFail}"
          >
            <div class="slide-verify-slider-mask" :style="{width: sliderMaskWidth}">
              <!-- slider -->
              <div
                @mousedown="sliderDown"
                @touchstart="touchStartEvent"
                @touchmove="touchMoveEvent"
                @touchend="touchEndEvent"
                class="slide-verify-slider-mask-item"
                :style="{left: sliderLeft}"
              >
                <div class="slide-verify-slider-mask-item-icon">
                   <span class="iconfont" :class="'icon-'+status" style="position:relative;top:-2px"></span>
                </div>
              </div>
            </div>
            <span class="slide-verify-slider-text">{{sliderText}}</span>
          </div>
        </div>
      </div>
    </transition>
    <div class="mask-bg" v-show="toShow"></div>
  </div>
</template>
<script>
const PI = Math.PI

function sum(x, y) {
  return x + y
}

function square(x) {
  return x * x
}
export default {
  name: 'SlideVerify',
  props: {
    // block length
    l: {
      type: Number,
      default: 42
    },
    // block radius
    r: {
      type: Number,
      default: 10
    },
    // canvas width
    w: {
      type: Number,
      default: 310
    },
    // canvas height
    h: {
      type: Number,
      default: 155
    },
    sliderText: {
      type: String,
      default: '向右拖动滑块填充拼图'
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      containerActive: false, // container active class
      containerSuccess: false, // container success class
      containerFail: false, // container fail class
      canvasCtx: null,
      blockCtx: null,
      block: null,
      block_x: undefined, // container random position
      block_y: undefined,
      L: this.l + this.r * 2 + 3, // block real lenght
      img: undefined,
      originX: undefined,
      originY: undefined,
      isMouseDown: false,
      trail: [],
      sliderLeft: 0, // block right offset
      sliderMaskWidth: 0, // mask width
      toShow: false,
      status: 'right',
      spend: 0
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    show() {
      this.reset()
      this.toShow = true
    },
    open(){
      this.reset()
      this.toShow = true
    },
    cancel(){
      this.toShow = false
      this.$emit('cancel')
    },
    close() {
      this.toShow = false
    },
    init() {
      this.initDom()
      this.initImg()
      this.bindEvents()
    },
    initDom() {
      this.block = this.$refs.block
      this.canvasCtx = this.$refs.canvas.getContext('2d')
      this.blockCtx = this.block.getContext('2d')
    },
    initImg() {
      const img = this.createImg(() => {
        this.drawBlock()
        this.canvasCtx.drawImage(img, 0, 0, this.w, this.h)
        this.blockCtx.drawImage(img, 0, 0, this.w, this.h)
        let { block_x: x, block_y: y, r, L } = this
        let _y = y - r * 2 - 1
        let ImageData = this.blockCtx.getImageData(x, _y, L, L)
        this.block.width = L
        this.blockCtx.putImageData(ImageData, 0, _y)
      })
      this.img = img
    },
    drawBlock() {
      this.block_x = this.getRandomNumberByRange(this.L + 10, this.w - (this.L + 10))
      this.block_y = this.getRandomNumberByRange(10 + this.r * 2, this.h - (this.L + 10))
      this.draw(this.canvasCtx, this.block_x, this.block_y, 'fill')
      this.draw(this.blockCtx, this.block_x, this.block_y, 'clip')
    },
    draw(ctx, x, y, operation) {
      let { l, r } = this
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
      ctx.lineTo(x + l, y)
      ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
      ctx.lineTo(x + l, y + l)
      ctx.lineTo(x, y + l)
      ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
      ctx.lineTo(x, y)
      ctx.lineWidth = 2
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.stroke()
      ctx[operation]()
      ctx.globalCompositeOperation = 'destination-over'
    },
    createImg(onload) {
      const img = document.createElement('img')
      img.crossOrigin = 'Anonymous'
      img.onload = onload
      img.onerror = () => {
        img.src = this.getRandomImg()
      }
      img.src = this.getRandomImg()
      return img
    },
    // 随机生成img src
    getRandomImg() {
      //return 'https://picsum.photos/300/150/?image=' + this.getRandomNumberByRange(0, 8)
      return require('@/assets/sliderBox/slider' + this.getRandomNumberByRange(1, 8) + '.jpg')
    },
    getRandomNumberByRange(start, end) {
      return Math.round(Math.random() * (end - start) + start)
    },
    refresh() {
      this.reset()
      // this.$emit('refresh')
    },
    sliderDown(event) {
      this.originX = event.clientX
      this.originY = event.clientY
      this.isMouseDown = true
    },
    touchStartEvent(e) {
      this.spend = new Date().getTime()
      this.originX = e.changedTouches[0].pageX
      this.originY = e.changedTouches[0].pageY
      this.isMouseDown = true
    },
    bindEvents() {
      document.addEventListener('mousemove', e => {
        if (!this.isMouseDown) return false
        const moveX = e.clientX - this.originX
        const moveY = e.clientY - this.originY
        if (moveX < 0 || moveX + 38 >= this.w) return false
        this.sliderLeft = moveX + 'px'
        let blockLeft = ((this.w - 40 - 20) / (this.w - 40)) * moveX
        this.block.style.left = blockLeft + 'px'

        this.containerActive = true // add active
        this.sliderMaskWidth = moveX + 'px'
        this.trail.push(moveY)
      })
      document.addEventListener('mouseup', e => {
        if (!this.isMouseDown) return false
        this.isMouseDown = false
        if (e.clientX === this.originX) return false
        this.containerActive = false // remove active
        
        // if ((new Date().getTime() - this.spend) > 3000) {
        //   this.spend = 0
        //   this.containerFail = true
        //   this.status = 'close'
        //   // this.$emit('fail')
        //   setTimeout(() => {
        //     this.reset()
        //   }, 1000)
        //   this.$message.warning('验证超时，请重试');
        //   return false
        // }
        const { spliced, TuringTest } = this.verify()
        if (spliced) {
          if (TuringTest) {
            this.containerSuccess = true
            this.status = 'check'
            setTimeout(() => {
              this.close()
            }, 800)
            setTimeout(() => {
              this.$emit('success')
            }, 1000)
          } else {
            this.status = 'close'
            this.containerFail = true
            this.sliderText = 'try again'
            this.reset()
          }
        } else {
          this.containerFail = true
          this.status = 'close'
          // this.$emit('fail')
          setTimeout(() => {
            this.reset()
          }, 1000)
        }
      })
    },
    touchMoveEvent(e) {
      if (!this.isMouseDown) return false
      const moveX = e.changedTouches[0].pageX - this.originX
      const moveY = e.changedTouches[0].pageY - this.originY
      if (moveX < 0 || moveX + 38 >= this.w) return false
      this.sliderLeft = moveX + 'px'
      let blockLeft = ((this.w - 40 - 20) / (this.w - 40)) * moveX
      this.block.style.left = blockLeft + 'px'

      this.containerActive = true
      this.sliderMaskWidth = moveX + 'px'
      this.trail.push(moveY)
    },
    touchEndEvent(e) {
      if (new Date().getTime() - this.spend > 3000) {
        this.spend = 0
        this.containerFail = true
        this.status = 'close'
        // this.$emit('fail')
        setTimeout(() => {
          this.reset()
        }, 1000)
      }
      if (!this.isMouseDown) return false
      this.isMouseDown = false
      if (e.changedTouches[0].pageX === this.originX) return false
      this.containerActive = false

      const { spliced, TuringTest } = this.verify()
      if (spliced) {
        if (TuringTest) {
          this.containerSuccess = true
          this.status = 'check'
          setTimeout(() => {
            this.toShow = false
            this.$emit('success')
          }, 1000)
        } else {
          this.containerFail = true
          this.status = 'close'
          this.sliderText = 'try again'
          this.reset()
        }
      } else {
        this.containerFail = true
        this.status = 'close'
        // this.$emit('fail')
        setTimeout(() => {
          this.reset()
        }, 1000)
      }
    },
    verify() {
      const arr = this.trail // drag y move distance
      const average = arr.reduce(sum) / arr.length // average
      const deviations = arr.map(x => x - average) // deviation array
      const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length) // standard deviation
      const left = parseInt(this.block.style.left)
      return {
        spliced: Math.abs(left - this.block_x) < 10,
        TuringTest: average !== stddev // equal => not person operate
      }
    },
    reset() {
      this.status = 'right'
      this.containerActive = false
      this.containerSuccess = false
      this.containerFail = false
      this.sliderLeft = 0
      this.block.style.left = 0
      this.sliderMaskWidth = 0
      // canvas
      let { w, h } = this
      this.canvasCtx.clearRect(0, 0, w, h)
      this.blockCtx.clearRect(0, 0, w, h)
      this.block.width = w

      // generate img
      this.img.src = this.getRandomImg()
    }
  }
}
</script>
<style scoped>
.slide-verify {
  margin: 15px;
  position: relative;
}

.slide-verify-block {
  position: absolute;
  left: 0;
  top: 0;
}

.slide-verify-refresh-icon {
  position: absolute;
  right: 1px;
  top: 0px;
  color: #fff;
  cursor: pointer;
  /* background: url('../assets/icon_light.png') 0 -437px; */
  background-size: 34px 471px;
}
.slide-verify-refresh-icon .iconfont {
  font-size:20px;
}
.slide-verify-slider {
  position: relative;
  text-align: center;
  width: 310px;
  height: 40px;
  line-height: 40px;
  margin-top: 15px;
  background: #f7f9fa;
  color: #45494c;
  border: 1px solid #e4e7eb;
}

.slide-verify-slider-mask {
  position: absolute;
  left: 0;
  top: 0;
  height: 40px;
  border: 0 solid #1991fa;
  background: #d1e9fe;
}

.slide-verify-slider-mask-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 38px;
  background: #fff;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background 0.2s linear;
}

.slide-verify-slider-mask-item:hover {
  background: #1991fa;
}

/* .slide-verify-slider-mask-item:hover .slide-verify-slider-mask-item-icon {
  background-position: 0 -13px;
} */
.slide-verify-slider-mask-item-icon:hover {
  color: #fff;
}
/* .slide-verify-slider-mask-item-icon {
  position: absolute;
  top: 15px;
  left: 13px;
  width: 14px;
  height: 12px;
  
  background-size: 34px 471px;
} */
.container-active .slide-verify-slider-mask-item {
  height: 38px;
  top: -1px;
  border: 1px solid #1991fa;
}

.container-active .slide-verify-slider-mask {
  height: 38px;
  border-width: 1px;
}

.container-success .slide-verify-slider-mask-item {
  height: 38px;
  top: -1px;
  border: 1px solid #52ccba;
  background-color: #52ccba !important;
}

.container-success .slide-verify-slider-mask {
  height: 38px;
  border: 1px solid #52ccba;
  background-color: #d2f4ef;
}

.container-success .slide-verify-slider-mask-item-icon {
  color: #fff;
}

.container-fail .slide-verify-slider-mask-item {
  height: 38px;
  top: -1px;
  border: 1px solid #f57a7a;
  background-color: #f57a7a !important;
}

.container-fail .slide-verify-slider-mask {
  height: 38px;
  border: 1px solid #f57a7a;
  background-color: #fce1e1;
}

.container-fail .slide-verify-slider-mask-item-icon {
  color: #fff;
}

.container-active .slide-verify-slider-text,
.container-success .slide-verify-slider-text,
.container-fail .slide-verify-slider-text {
  display: none;
}
.mask-box {
  width: 100%;
}
.mask-bg {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.3);
  /* transition: opacity .3s linear; */
  will-change: opacity;
  width: 100%;
  height: 100%;
  top: 0px;
  z-index: 9998;
  left: 0px;
}
.slider-pop {
  z-index: 9999;
  position: absolute;
  box-sizing: border-box;
  border-radius: 2px;
  border: 1px solid #e4e7eb;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  width: 340px;
  left: calc(50% - 170px);
  top: 50%; /*偏移*/
  transform: translateY(-50%);
}
.slider-pop-title {
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  text-align: left;
  font-size: 16px;
  color: #45494c;
  border-bottom: 1px solid #e4e7eb;
}
.slider-pop-title .icon-close {
  float: right;
  cursor: pointer;
}
.slide-fade-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
/* cubic-bezier(1, 0.5, 0.8, 1) */
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-60%);
  opacity: 0;
}
</style>
