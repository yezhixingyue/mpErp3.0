<template>
  <div :style="widthStyle" class="mp-table-drag-cell"
    @mousedown="onMousedown"
    ref="moveDiv"
  >
    {{title}}
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 传入的宽度值，指定当前元素的宽度
     */
    width: {
      type: Number,
      default: 0,
    },
    /**
     * 传入的方法，当宽度发生变化时执行该方法
     */
    onWidthChange: {
      type: Function,
      default: null,
    },
    /**
     * 传入的标题
     */
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    widthStyle() {
      return `width: ${this.width}px`;
    },
  },
  data() {
    return {
      flags: false,
      oDIv: undefined,
    };
  },
  methods: {
    onMousedown(event) {
      this.oDIv = this.$refs.moveDiv;
      if (event.offsetX > this.oDIv.offsetWidth - 15) {
        this.flags = true;
        this.oDIv.oldX = event.x;
        this.oDIv.oldWidth = this.oDIv.offsetWidth;
        this.oDIv.style.cursor = 'col-resize';
      }
    },
    onMousemove(event) {
      if (this.oDIv === undefined) this.oDIv = this.$refs.moveDiv;
      if (event.offsetX > this.oDIv.offsetWidth - 15) this.oDIv.style.cursor = 'col-resize';
      else this.oDIv.style.cursor = 'default';
      if (!this.flags) return;
      this.oDIv.style.cursor = 'default';
      if (this.oDIv.oldWidth + (event.x - this.oDIv.oldX) > 30) {
        this.oDIv.width = this.oDIv.oldWidth + (event.x - this.oDIv.oldX);
        if (this.onWidthChange) this.onWidthChange(this.oDIv.width);
      }
      this.oDIv.style.cursor = 'col-resize';
    },
    onMouseup() {
      if (this.oDIv === undefined) this.oDIv = this.$refs.moveDiv;
      this.flags = false;
      this.oDIv.style.cursor = 'default';
    },
  },
  mounted() {
    document.addEventListener('mousemove', this.onMousemove);
    document.addEventListener('mouseup', this.onMouseup);
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-table-drag-cell {
  height: 30px;
  background-color: $--bg-color-blue;
  color: $--color-white;
  line-height: 30px;
  font-size: 14px;
  text-align: center;
  position: relative;
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  padding-right: 6px;
  box-sizing: border-box;
  &::after {
    content: '';
    width: 1px;
    height: 12px;
    background-color: $--border-color-v-line;
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
