<template>
  <section class="mp-common-comps-search-box">
    <span class="text" v-if="title">{{title}}：</span>
    <el-input
      @keyup.enter.native="onKeyWordSubmit"
      v-model.trim='inpVal'
      spellcheck="false"
      :placeholder="placeholder"
      size="mini"
      type="text"
    />
    <button class="mp-search-box-btn" @click="onKeyWordSubmit">
      <!-- <i class="el-icon-search"></i> -->
      <i></i>
    </button>
    <i v-if="spaceBetween" class="space-between"></i>
    <button
     class="order-header-reset-btn" v-if="showResetBtn" @click="onResetBtn">{{resetWords}}</button>
  </section>
</template>

<script>
export default {
  props: {
    word: {
      default: '',
      type: String,
    },
    title: {
      default: '活动标题',
      type: String,
    },
    placeholder: {
      type: String,
      default: '请输入活动标题',
    },
    changePropsFunc: {
      type: Function,
      default: () => {},
    },
    typeList: {
      type: Array,
      required: true,
    },
    requestFunc: {
      type: Function,
      default: () => {},
    },
    showResetBtn: {
      type: Boolean,
      default: true,
    },
    resetWords: {
      default: '清空所有筛选项条件',
      type: String,
    },
    searchWatchKey: {
      default: 0,
    },
    spaceBetween: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inpVal: '',
    };
  },
  methods: {
    onKeyWordSubmit(e) {
      const _keywords = this.inpVal;
      this.changePropsFunc([this.typeList[0], _keywords]);
      this.requestFunc();
      e.target.blur();
    },
    onResetBtn() {
      this.$emit('reset');
      this.requestFunc();
      this.inpVal = '';
    },
  },
  watch: {
    searchWatchKey() {
      this.inpVal = this.word;
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-common-comps-search-box {
  padding-top: 2px;
  text-align: right;
  font-size: 14px;
  display: flex;
  align-items: center;
  // @media screen and (max-width: 1600px) {
  //   padding-right: 30px;
  // }
  > span:first-of-type {
    font-weight: 600;
    display: inline-block;
    margin-right: 15px;
    user-select: none;
    color: $--color-text-primary;
    line-height: 28px;
    min-width: 5em;
  }
  > .el-input {
    width: 130px;
    > input {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
      padding: 0 4px;
      &::placeholder {
        font-size: 12px;
        color: $--color-text-secondary;
      }
    }
  }
  // > input {
  //   height: 28px;
  //   line-height: 28px;
  //   width: 130px;
  //   padding: 0 0 0 3px;
  //   display: inline-block;
  //   vertical-align: top;
  //   border: 1px solid $--border-color-base;
  //   &::placeholder {
  //     font-size: 12px;
  //     color: $--color-text-secondary;
  //   }
  //   box-sizing: border-box;
  //   outline: none;
  //   font-size: 12px;
  // }
  > button {
    border: none;
    height: 28px;
    line-height: 28px;
    width: 70px;
    outline: none;
    font-size: 20px;
    font-weight: 600;
    display: inline-block;
    vertical-align: top;
    color: #fff;
    user-select: none;
    cursor: pointer;
    // border-radius: $--border-radius-small;
    border-top-right-radius: $--border-radius-small;
    border-bottom-right-radius: $--border-radius-small;
    background-color: $--color-primary;
    border: 1px solid #26bcf9 !important;
    &:hover {
      background-color: $--color-text-btn-hover;
      border-color: #009EF9 !important;
    }
    &:active {
      background-color: $--color-primary-light;
      border-color: #35dff9 !important;
    }
  }
  > .order-header-reset-btn {
    user-select: none;
    margin-left: 20px;
    font-size: 12px;
    width: auto;
    font-weight: 400;
    background-color: $--color-white;
    line-height: 28px;
    box-sizing: border-box;
    padding: 0 20px;
    border-radius: $--border-radius-small;
    white-space: nowrap;
    &:hover {
      background-color: $--color-white;
      // color: $--color-white;
      // transform: scale(1.1);
      box-shadow: 0 0px 1px 1px rgba(38, 188, 249, 0.2);
    }
    &:active {
      color: mix($--color-white, $--color-primary, 10%);
      background-color: rgba(168, 168, 168, 0.1);
    }
    color: $--color-primary;
    border: 1px solid $--color-primary;
    height: 28px;
    cursor: pointer;
  }
  > button.mp-search-box-btn > i {
    display: block;
    height: 20px;
    width: 100%;
    background: url("../../assets/images/search.png") center center no-repeat;
  }
  > button.order-header-reset-btn {
    line-height: 26px !important;
  }
  > .space-between {
    flex: 1;
  }
}
</style>
