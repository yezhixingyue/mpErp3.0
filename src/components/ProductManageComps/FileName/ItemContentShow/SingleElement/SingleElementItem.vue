<template>
  <div class="mp-erp-product-module-filename-item-content-show-single-element-item-comp-wrap">
    <div class="name">
      <span :title="title">{{title}}：</span>
      <el-checkbox v-model="AllowNameHidden" v-if="title === '名称通假字' && showHidden">隐藏名称</el-checkbox>
    </div>
    <el-input v-if="type !== 'SizeUnitPosition'" size="mini" v-model="InpVal" maxlength="50" :disabled="hidden"></el-input>
    <el-select v-else  v-model="InpVal" placeholder="请选择" size="mini">
      <el-option
        v-for="item in FileNameEnumList"
        :key="item.ID"
        :label="item.Name"
        :value="item.ID">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { FileNameReg } from '@/assets/js/utils/regexp';
import { mapState } from 'vuex';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    type: {
      type: String,
      default: 'Name',
    },
    value: {
      type: Object,
      default: null,
    },
    optionTitle: {
      type: String,
      default: '',
    },
    showHidden: {
      type: Boolean,
      default: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('productManage', ['FileNameEnumList']),
    title() {
      if (this.optionTitle) return this.optionTitle;
      let _title = '';
      switch (this.type) {
        case 'Name':
          _title = '名称通假字';
          break;
        case 'Unit':
          _title = '单位通假字';
          break;
        default:
          break;
      }
      return _title;
    },
    AllowNameHidden: {
      get() {
        return this.value ? this.value.AllowNameHidden : false;
      },
      set(val) {
        const AllowNameHidden = val;
        const temp = this.value ? { ...this.value, AllowNameHidden } : { AllowNameHidden };
        this.$emit('change', temp);
      },
    },
    InpVal: {
      get() {
        if (this.hidden) return '';
        return this.value ? this.value[this.type] : '';
      },
      set(val) {
        if (!FileNameReg.test(val)) return;
        const temp = this.value ? { ...this.value } : {};
        temp[this.type] = val;
        this.$emit('change', temp);
      },
    },
  },
  mounted() {
    if (this.type === 'SizeUnitPosition') {
      if (!this.InpVal && this.InpVal !== 0) {
        // 对其进行默认赋值
        this.InpVal = this.FileNameEnumList[0].ID;
      }
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-product-module-filename-item-content-show-single-element-item-comp-wrap {
  width: 190px;
  margin-bottom: 15px;
  margin-right: 18px;
  > .name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
    width: 100%;
    > span {
      font-size: 14px;
      color: #888E99;
      height: 19px;
      line-height: 19px;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    > .el-checkbox {
      display: flex;
      align-items: center;
      .el-checkbox__label {
        font-size: 12px;
        color: #585858;
        padding-left: 6px;
      }
      .el-checkbox__input {
        line-height: 10px;
      }
    }
  }
  > .el-select {
    width: 100%;
  }
}
</style>
