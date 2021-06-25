<template>
  <div class="mp-erp-new-comps-condtion-set-common-comp-value-select-comp-wrap" v-if="!isMultiple">
    <template v-if="ValueType === 0">
      <el-input v-model.trim="localValue" maxlength="15" size="mini"></el-input>
      <span v-if="Unit" class="unit" :title="Unit">{{Unit}}</span>
    </template>
    <!-- 可多选 -->
    <!-- <el-select v-model="localValue" placeholder="请选择" size="mini" multiple collapse-tags v-else-if="ValueType === 1" key="ValueType1">
      <el-option
        v-for="item in localOptionList"
        :key="item.First"
        :label="item.Second"
        :value="item.First">
      </el-option>
    </el-select> -->
    <!-- 可多选 -->
    <!-- <span class="blue-span" v-else-if="ValueType === 6">设置</span> -->
    <el-select v-model="localValue" v-else-if="ValueType !== 5 && !isMultiple" placeholder="请选择" size="mini" key="ValueType!5">
      <el-option
        v-for="item in localOptionList"
        :key="item.First"
        :label="item.Second"
        :value="item.First">
      </el-option>
    </el-select>
  </div>
</template>

<script>
// import { AllOperatorList } from '@/assets/js/TypeClass/PropertyClass';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  // props: {
  //   PropertyData: {
  //     type: Object,
  //     default: null,
  //   },
  //   value: {},
  // },
  props: ['PropertyData', 'value'],
  computed: {
    localOptionList() {
      if (!this.PropertyData || !Array.isArray(this.PropertyData.OptionList) || this.PropertyData.OptionList.length === 0) return [];
      return this.PropertyData.OptionList;
    },
    localValue: {
      get() {
        if (Array.isArray(this.value) && this.value.length > 0) {
          return this.isMultiple ? this.value.map(it => it.Value) : this.value[0].Value;
        }
        return Array.isArray(this.value) ? [] : '';
      },
      set(val) {
        console.log(val);
        const _list = this.isMultiple ? val.map(Value => ({ Value })) : [{ Value: val }];
        this.$emit('change', _list);
      },
    },
    isMultiple() {
      return this.ValueType === 1 || this.ValueType === 6;
    },
  },
  data() {
    return {
      ValueType: '',
      OptionList: '',
      Unit: '',
    };
  },
  mounted() {
    if (!this.PropertyData) return;
    const { ValueType, OptionList, Unit } = this.PropertyData;
    this.ValueType = ValueType;
    this.OptionList = OptionList;
    this.Unit = Unit;
    console.log(this.PropertyData);
  },
};
</script>
<style lang='scss'>
.mp-erp-new-comps-condtion-set-common-comp-value-select-comp-wrap {
  width: 120px;
  padding-right: 40px;
  vertical-align: middle;
  overflow: hidden;
  display: inline-block;
  // > .el-select {
  //   .el-input__inner {
  //     height: 30px;
  //     line-height: 30px;
  //     font-size: 12px;
  //     border-radius: 3px;
  //   }
  // }
  .el-input__inner {
    height: 30px !important;
    line-height: 30px;
    font-size: 12px;
    border-radius: 3px;
  }
  .unit {
    font-size: 13px;
    margin-left: 5px;
    color: #a2a2a2;
    position: relative;
    top: 1px;
  }
  .el-select {
    height: 30px;
    white-space: nowrap;
  }
  .el-select__tags {
    max-width: 90px !important;
    height: 30px !important;
    white-space: nowrap;
    overflow: hidden;
    flex-wrap: nowrap;
    > span {
      white-space: nowrap;
      > span {
        display: inline-block;
      }
    }
  }
}
</style>
