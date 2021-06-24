<template>
  <div class="mp-erp-new-comps-condtion-set-common-comp-operator-comp-wrap" :class="isMultiple?'isMultiple':''">
    <el-select v-model="localValue" v-if="showOption" placeholder="请选择" size="mini">
      <el-option
        v-for="item in localOperatorList"
        :key="item.ID"
        :label="item.Name"
        :value="item.ID">
      </el-option>
    </el-select>
    <div v-else  class="text-box">
      <span class="text">{{showText}}</span>
    </div>
    <span v-if="isMultiple">下面任一选项时：</span>
    <div v-if="isMultiple" class="multiple-select">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="it in localOptionList" :key="it.First" :label="it.First">{{it.Second}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import { AllOperatorList } from '@/assets/js/TypeClass/PropertyClass';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    PropertyData: {
      type: Object,
      default: null,
    },
    value: {},
    valueList: {},
  },
  computed: {
    localOperatorList() {
      if (!this.PropertyData || !AllOperatorList || AllOperatorList.length === 0 || !this.PropertyData.OperatorList) return [];
      return AllOperatorList.filter(it => this.PropertyData.OperatorList.includes(it.ID));
    },
    localValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('change', val);
      },
    },
    isMultiple() {
      return this.ValueType === 1 || this.ValueType === 6;
    },
    localOptionList() {
      if (!this.PropertyData || !Array.isArray(this.PropertyData.OptionList) || this.PropertyData.OptionList.length === 0) return [];
      return this.PropertyData.OptionList;
    },
    checkList: {
      get() {
        if (Array.isArray(this.valueList) && this.valueList.length > 0) {
          return this.isMultiple ? this.valueList.map(it => it.Value) : this.valueList[0].Value;
        }
        return Array.isArray(this.valueList) ? [] : '';
      },
      set(val) {
        console.log(val);
        const _list = this.isMultiple ? val.map(Value => ({ Value })) : [{ Value: val }];
        this.$emit('update:valueList', _list);
      },
    },
  },
  data() {
    return {
      showOption: true,
      showText: '',
      ValueType: '',
    };
  },
  mounted() {
    if (!AllOperatorList || AllOperatorList.length === 0 || !this.PropertyData
     || !this.PropertyData.OperatorList || this.PropertyData.OperatorList.length === 0) return;
    if (this.localOperatorList.length === 0) return;
    const [{ ID, Name }] = this.localOperatorList;
    this.$emit('change', ID);
    if (this.PropertyData.OperatorList.length === 1 && this.localOperatorList.length === 1) {
      this.showOption = false;
      this.showText = Name;
    }
    this.ValueType = this.PropertyData.ValueType;
  },
};
</script>
<style lang='scss'>
.mp-erp-new-comps-condtion-set-common-comp-operator-comp-wrap {
  width: 100px;
  // display: flex;
  // align-items: center;
  .el-select {
    width: 100px;
  }
  .el-input {
    // height: 30px;
    .el-input__inner {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
      border-radius: 3px;
    }
    .el-input__suffix {
      height: 30px;
    }
  }
  > span {
    font-size: 12px;
    color: #585858;
    margin-left: 12px;
  }
  > div.text-box {
    display: inline-block;
    line-height: 30px;
    > span.text {
      font-size: 12px;
      color: #585858;
      margin-left: 8px;
      margin-left: 2px;
    }
  }
  &.isMultiple {
    width: 235px;
    & + .del-btn {
      margin-left: 25px;
    }
  }
  .multiple-select {
    height: 30px;
    line-height: 30px;
    .el-checkbox__label {
      font-size: 12px;
      color: #585858;
    }
  }
}
</style>
