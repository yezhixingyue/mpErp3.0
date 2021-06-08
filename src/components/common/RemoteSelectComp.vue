<template>
  <div class="mp-common-remote-select-comp-wrapper">
    <el-select
   :value="value"
   class="mp-common-remote-select-comp-wrap"
   :class="mini?'font-12':''"
   filterable
   clearable
   :remote="remote"
   :disabled="isDisabled"
   :placeholder="placeholder"
   @change='onChange'
   :remote-method="remoteMethod"
   :loading="loading"
   :key='key'
   >
      <el-option
        v-for="item in optionList"
        :key="item.value"
        :label="item[defaultProps.label]"
        :value="item[defaultProps.value]">
      </el-option>
    </el-select>
    <i class="el-icon-error" @click="onClearClick" v-show="value !== '' && !isDisabled"></i>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: '不限',
    },
    defaultProps: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value',
      }),
    },
    mini: {
      type: Boolean,
      default: false,
    },
    requestListFunc: {
      type: Function,
      default: () => {},
      required: true,
    },
    placeholder: {
      type: String,
      default: '请输入姓名',
    },
    watchValue: {},
    isDisabled: {
      type: Boolean,
      default: false,
    },
    needlimit: { // 是否添加不限选项
      type: Boolean,
      default: false,
    },
    remote: { // 是否采用即使网络获取数据
      type: Boolean,
      default: true,
    },
    staffList: { // 列表数据，如果不采用上方即时网络获取数据则需要传递此项
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      options: [],
      key: 2021,
    };
  },
  computed: {
    watchValue1() {
      return this.watchValue;
    },
    optionList() {
      if (!this.remote) {
        return this.staffList;
      }
      return this.options;
    },
  },
  watch: {
    watchValue1: {
      handler(newVal) { // 用不上 因为其会每次挂载 监控不到变化 --- 缓存模式可用
        if (newVal) {
          this.options = [newVal];
          this.key += 1;
        }
      },
      // immediate: true,
    },
  },
  methods: {
    onChange(newVal) {
      this.$emit('handleChange', newVal);
    },
    onClearClick() {
      this.$emit('handleChange', '');
    },
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.requestListFunc(query).then(res => {
          this.loading = false;
          if (res.data.Status === 1000) {
            if (this.needlimit) this.options = [{ [this.defaultProps.label]: '不限', [this.defaultProps.value]: '' }, ...res.data.Data];
            else this.options = res.data.Data;
          }
        }).catch(() => { this.loading = false; });
      } else {
        this.options = [];
      }
    },
  },
  mounted() {
    if (this.watchValue1) this.options = [this.watchValue1];
  },
  // activated() {
  //   if (this.watchValue1) this.options = [this.watchValue1]; // 作为详情页面显示内容时，初始获取value对应的列表信息以展示value对应的label名称
  //   console.log('activated');
  // },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-common-remote-select-comp-wrapper {
  position: relative;
  .mp-common-remote-select-comp-wrap {
    height: 25px;

    .el-input {
      > input {
      //   border: none;
      //   border-bottom: 1px solid gainsboro;
        height: 25px;
        width: 110px;
        margin-top: -1px;
        font-size: 13px;
        color: $--color-text-primary;
        // &::-webkit-input-placeholder {
        //   color: rgba($color: $--color-text-primary-light, $alpha: 0.5);
        // }
        &::placeholder {
        font-size: 12px;
        color: $--color-text-secondary;
      }
        padding: 0 7px 0 5px;
        line-height: 25px;
      }
      // &::after {
      //     content: "";
      //     position: absolute;
      //     background: url('../../assets/images/arrowbottom.png') no-repeat center;
      //     background-size: 100% 100%;
      //     height: 9px;
      //     width: 11px;
      //     right: 5px;
      //     top: 5px;
      // }
      > .el-input__suffix {
          display: none;
      }
    }
    &.font-12 {
      .el-input > input {
        font-size: 12px;
      }
    }
  }
  > i {
    color: #989898c5;
    // background-color: #989898c5;
    border-radius: 50%;
    font-size: 15px;
    // padding: 3px;
    // transform: scale(0.88);
    position: absolute;
    right: 15px !important;
    top: 4px;
    cursor: pointer;
    font-weight: 100;
    display: none;
  }
  &:hover {
    > i {
      display: block;
    }
  }
}

</style>
