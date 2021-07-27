<template>
  <div class="mp-erp-common-comps-top-radio-button-comp-wrap">
    <el-scrollbar wrap-class="scrollbar-wrapper" v-if="!loading">
      <el-radio-group v-model="radio" size="small">
        <el-radio-button v-for="it in list" :label="it.ID" :key="it.ID">{{it.Name}}</el-radio-button>
      </el-radio-group>
    </el-scrollbar>
    <span v-else class="is-font-size-12 is-gray" style=""> {{title}}加载中...</span>
    <span class="is-font-size-12 is-gray" v-if="!loading && list.length === 0">该分类尚无{{title}}，请添加</span>
    <span class="blue-span" @click="onItemSaveClick(null)">+添加{{title}}</span>
    <div class="menus" v-if="radio">
      <span @click="onItemSaveClick(radio)" class="blue-span">编辑当前{{title}}名称</span>
      <span class="red-span" @click="onRemoveClick">删除当前{{title}}</span>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    title: {
      type: String,
      default: '方案',
    },
    list: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    value: {},
  },
  computed: {
    radio: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
  },
  methods: {
    onRemoveClick() {
      this.$emit('remove');
    },
    onItemSaveClick(data) { // 添加或编辑事件, 传参为编辑 否则为添加
      this.$emit('itemSave', data);
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comps-top-radio-button-comp-wrap {
  display: flex;
  align-items: center;
  height: 32px;
  line-height: 32px;
  margin-top: 23px;
  font-weight: 400;
  > span {
    font-size: 14px;
    margin-right: 30px;
    white-space: nowrap;
    &.is-gray {
      text-indent: 1em;
    }
  }
  > .menus {
    font-size: 12px;
    white-space: nowrap;
    > span {
      margin-left: 30px;
      line-height: 32px;
      white-space: nowrap;
    }
  }
  > .el-scrollbar {
    overflow: hidden;
    margin-right: 12px;
    .el-radio-group {
      white-space: nowrap;
      .el-radio-button__inner {
        width: auto;
        min-width: 100px;
      }
    }
  }
  .el-radio-group {
    > .el-radio-button {
      user-select: none;
      .el-radio-button__inner {
        font-size: 14px;
        padding: 5px 16px;
        padding-left: 20px;
        width: 120px;
        line-height: 20px;
      }
      position: relative;
      &::before {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #fff;
        opacity: 0;
        z-index: 10;
        left: 10px;
        top: calc(50% - 2px);
        transition: opacity 0.1s ease-in-out;
      }
      &.is-active{
        &::before {
          opacity: 1;
        }
      }
    }
  }
}
</style>
