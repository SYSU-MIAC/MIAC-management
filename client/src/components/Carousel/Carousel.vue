<template>
  <div class="carousel" :style="{height:height+'px'}" @mouseenter="showControl=true" @mouseleave="showControl=false">
    <div class="carousel-tab" :style="{left}">
      <slot></slot>
    </div>
    <transition enter-active-class="animated zoomIn"
                leave-active-class="animated zoomOut">
      <div class="carousel-controller"
           v-show="showControl">
        <mu-flexbox justify="center" align="center">
          <mu-icon-button icon="navigate_before" @click="last"></mu-icon-button>
          <mu-radio v-for="index in total"
                    name="item-group"
                    :nativeValue="''+index"
                    v-model="activeRadio"></mu-radio>
          <mu-icon-button icon="navigate_next" @click="next"></mu-icon-button>
        </mu-flexbox>
      </div>
    </transition>
  </div>
</template>

<script>
  /*  参考了Element-UI的carousel组件
  *   http://element.eleme.io/#/zh-CN/component/carousel
  *
  *   示例：
  *   <carousel>
  *     <carousel-item></carousel-item>
  *     <carousel-item></carousel-item>
  *   </carousel>
  *   carousel-item组件内放自定义的内容，轮播以carousel-item为单位
  *
  *   props:
  *     height: Number， 表示carousel的px高度值，默认200
  *     interval: Number，自动轮播的间隔ms数，默认1000
  * */
  export default {
    created () {
      this.flag = setInterval(this.next, this.interval)
    },
    props: {
      height: {type: Number, default: 200},
      interval: {type: Number, default: 1000}
    },
    data () {
      return {
        now: 1,
        activeRadio: '1',
        showControl: false,
        flag: null
      }
    },
    computed: {
      left () {
        return (1 - this.now) + '00%'
      },
      total () {
        return this.$slots.default.length
      }
    },
    methods: {
      next () {
        this.now = this.now % this.total + 1
      },
      last () {
        this.now--
        if (this.now === 0) this.now = this.total
      }
    },
    watch: {
      'activeRadio' (newVal, oldVal) {
        this.now = parseInt(newVal)
      },
      'now' (newVal) {
        this.activeRadio = newVal + ''
        clearInterval(this.flag)
        this.flag = setInterval(this.next, this.interval)
      }
    }
  }
</script>

<style scoped>
  .carousel {
    overflow: hidden;
    position: relative;
  }

  .carousel-tab {
    height: 100%;
    position: relative;
    transition: all 0.5s;
  }

  .carousel-controller {
    z-index: 1;
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .animated {
    -webkit-animation-duration: 0.4s;
    -o-animation-duration: 0.4s;
    animation-duration: 0.4s;
  }

  .carousel-radio {
    color: blue;
    margin: 100px;
  }
</style>