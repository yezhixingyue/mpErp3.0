<template>
  <div class="mp-text-input-wrap" :class="{'active': isActive}">
      <input type="text" :maxlength="maxlength"
        @blur="onBlur" @focus="onFocus" @input="onInput" v-model="value" :placeholder="msg">
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 传递一个方法，当input框输入文字时触发，用于将该input框中的信息传递到外面
     */
    handleInput: {
      type: Function,
      default: () => {},
    },
    /**
     * 传递一个索引值，触发事件时需要返还给父组件
     */
    index: {
      type: Number,
      default: -1,
    },
    /**
     * 传递一个文字信息，用于在placeholder处显示
     */
    msg: {
      type: String,
      default: '在此输入备注信息',
    },
    /**
     * 监听对象，如果该对象改变为''，则本组件标题修改为传递进来的title,监听的该对象实际是本下拉框选择后影响的数据对象
     */
    watchTarget: {
    },
    maxlength: {
      type: Number,
      default: 200,
    },
  },
  watch: {
    watchTarget(newVal) {
    //  console.log(newVal, this.value);
      if (newVal === '') this.value = '';
      if (this.value !== newVal) this.value = newVal;
    },
  },
  data() {
    return {
      value: '',
      isActive: false,
      // isWarn: false,
    };
  },
  methods: {
    onInput() {
      this.handleInput(this.value, this.index);
    },
    onFocus() {
      this.isActive = true;
      this.isWarn = false;
    },
    onBlur() {
      this.isActive = false;
      // if (!this.value) this.isWarn = true;
    },
  },
};
</script>

<style lang='scss'>
  @import "@/assets/css/var.scss";
  .mp-text-input-wrap{
    display: inline-block;
    position: relative;
    margin-left: 25px;
    > input{
        width: 300px;
        height: 24px;
        outline: none;
        box-sizing: border-box;
        padding-left: 5px;
        font-size: 12px;
        &::-webkit-input-placeholder{
            color: $--color-text-secondary;
            font-size: 12px;
        }
        border:1px solid $--border-color-dark;
    }
    &.active{
      &::after{
        // width: 100%;
      }
    }
    // &.is-warn{
    //   > input{
    //     border-color: rgba($color:  $--color-text-table-pending, $alpha: 0.6);
    //   }
    // }
    &::after{
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      transition: width  300ms;
      background-color: $--color-primary;
    }
  }
</style>
