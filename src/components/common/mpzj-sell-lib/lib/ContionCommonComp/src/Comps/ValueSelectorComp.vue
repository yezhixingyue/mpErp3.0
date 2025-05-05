<template>
  <div class="mp-erp-new-comps-condtion-set-common-comp-value-select-comp-wrap" v-if="!isMultiple || ValProperty" >
    <span class="pshow" v-if="ValProperty"
     :title="ValProperty.DisplayContent && ValProperty.DisplayContent.replace(/\[|\]/g, '')"
     >{{ValProperty.DisplayContent && ValProperty.DisplayContent.replace(/\[|\]/g, '')}}</span>
    <el-date-picker
      v-if="!ValProperty && PropertyData.FixedType === 41"
      v-model="localValue"
      type="date"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-ddTHH:mm:ss"
      placeholder="选择日期"
      size="small" />
    <el-time-picker
      v-else-if="!ValProperty && PropertyData.FixedType === 59"
      v-model="localValue"
      format="HH:mm"
      value-format="HH:mm"
      placeholder="选择时间"
      size="small" />
    <template v-else-if="ValueType === 0 && !ValProperty">
      <el-input v-model.trim="localValue" maxlength="9" size="mini"></el-input>
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
    <el-select v-model="localValue" v-else-if="![5, 10].includes(ValueType) && !isMultiple && !ValProperty" placeholder="请选择" size="mini" key="ValueType!5">
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
import { getTimeStrByMinutes } from '../../../js/util';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: ['PropertyData', 'value', 'ComparePropertyList'],
  computed: {
    localOptionList() {
      if (!this.PropertyData || !Array.isArray(this.PropertyData.OptionList) || this.PropertyData.OptionList.length === 0) return [];
      if (this.PropertyData?.ValueType === 4) {
        return this.PropertyData.OptionList.map((it) => ({ ...it, First: (it.Second === '开' || it.Second === '是') ? 'True' : 'False' }));
      }
      return this.PropertyData.OptionList;
    },
    localValue: {
      get() {
        if (Array.isArray(this.value) && this.value.length > 0) {
          const _fixedVal = (Value) => {
            if (/^\d+$/.test(Value) && this.PropertyData.FixedType === 59) { // 字符串时间格式反转
              return getTimeStrByMinutes(Value);
            }
            return Value;
          };
          return this.isMultiple ? this.value.map((it) => _fixedVal(it.Value)) : _fixedVal(this.value[0].Value);
        }

        if (!this.ValProperty && this.PropertyData.FixedType === 41) return '';

        return Array.isArray(this.value) ? [] : '';
      },
      set(val) {
        let _val = val;
        if (this.PropertyData.FixedType === 59 && /\d{2}:\d{2}/.test(_val)) { // 字符串时间格式转换为分钟数
          _val = Number(_val.slice(0, 2)) * 60 + Number(_val.slice(-2));
        }
        const _list = this.isMultiple ? _val.map((Value) => ({ Value })) : [{ Value: _val }];

        this.$emit('change', _list);
      },
    },
    isMultiple() {
      return [1, 2, 3, 6].includes(this.ValueType) || (this.PropertyData && [18, 26].includes(this.PropertyData.FixedType));
    },
    ValProperty() {
      if (Array.isArray(this.value) && this.value.length === 1) {
        if (this.value[0].Property && !this.value[0].Value) return this.value[0].Property;
        return null;
      }
      return null;
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
    const {
      ValueType, OptionList, Unit, Element,
    } = this.PropertyData;
    this.ValueType = ValueType;
    this.OptionList = OptionList;
    this.Unit = Unit;
    if (OptionList && OptionList.length > 0 && ![5, 10].includes(ValueType) && !this.isMultiple && ValueType !== 0 && !this.ValProperty) {
      if (!this.localValue || (Array.isArray(this.localValue) && this.localValue.length === 0)) {
        if (Element && Element.Type !== 3) this.localValue = OptionList[0].First;
        else this.localValue = 'True';
      }
    }
  },
};
</script>
<style lang='scss'>
.mp-erp-new-comps-condtion-set-common-comp-value-select-comp-wrap {
  width: 120px;
  padding-right: 60px;
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
  .el-date-editor.el-input {
    width: 140px;
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
  > .pshow {
    font-size: 12px;
    line-height: 30px;
    overflow: hidden;
    color: #888;
  }
}
</style>
