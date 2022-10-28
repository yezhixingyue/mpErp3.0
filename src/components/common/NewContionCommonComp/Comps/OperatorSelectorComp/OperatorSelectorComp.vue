<template>
  <div class="mp-erp-new-comps-condtion-set-common-comp-operator-comp-wrap" :class="{isMultiple: isMultiple, hidden: hidden, hasCompare: hasCompare }">
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
    <span v-if="isMultiple && !hidden">{{operatContent}}</span>
    <div v-if="isMultiple && !hidden" class="multiple-select">
      <div class="multiple" v-if="localOptionList.length >= 4 || [46, 47, 52].includes(PropertyData.FixedType)">
        <span class="blue-span" @click="onSelectDialogClick">选择</span>
        <div class="show-text" :title="showSelectedText">{{showSelectedText}}</div>
        <CheckboxDialogComp v-if="!(ValueType === 6 && PropertyData.Type === 5)"
         :visible.sync='propVisibel' v-model="checkList" :list='localOptionList' width='800px'
         title="选择选项" submitText='确定' :defaultProps="{label: 'Second', value: 'First'}" class="CheckboxDialogComp" />
        <MaterialSelectDialog submitText='确定' v-else :visible.sync='materialVisible' v-model="checkList" :optionList='localMaterialOptionList' />
        <!-- <ADAreaDialogSelector :visible.sync="areaVisible" v-model="checkList" :treeType='treeType' :displayLevel2='displayLevel2' /> -->
      </div>
      <el-checkbox-group v-model="checkList" v-else>
        <el-checkbox v-for="it in localOptionList" :key="it.First" :label="it.First" :title="it.Second">{{it.Second}}</el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex';
import CheckboxDialogComp from './CheckboxDialogComp/CheckboxDialogComp.vue';
import {
  AllOperatorList, getTempMaterialListObj, getTempMaterialOptionList, getTempMaterialSelectedListShowText,
} from '../../utils/PropertyClass';
// import ADAreaDialogSelector from '../../../SelectorComps/ADAreaDialogSelector';
import MaterialSelectDialog from './MaterialSelectDialog.vue';

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
    hidden: {
      type: Boolean,
      default: false,
    },
    hasCompare: {
      type: Boolean,
      default: false,
    },
    productLevel2: { // 产品筛选使用2级分类
      type: Boolean,
      default: false,
    },
    areaLevel2: { // 地区筛选使用2级分类
      type: Boolean,
      default: false,
    },
    sellAreaLevel2: { // 销售筛选使用2级分类
      type: Boolean,
      default: false,
    },
  },
  components: {
    CheckboxDialogComp,
    MaterialSelectDialog,
    // ADAreaDialogSelector,
  },
  computed: {
    // ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allAreaTreeList']),
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
      return [1, 2, 3, 6].includes(this.ValueType) || (this.PropertyData && [18, 26].includes(this.PropertyData.FixedType));
    },
    operatContent() {
      if ([2, 3].includes(this.ValueType)) return '下面所有选项时：';
      return '下面任一选项时：';
    },
    localOptionList() {
      if (!this.PropertyData || !Array.isArray(this.PropertyData.OptionList) || this.PropertyData.OptionList.length === 0) return [];
      const list = [...this.PropertyData.OptionList];
      if ([42, 43, 45].includes(this.PropertyData.FixedType)) return list;
      return list.sort((a, b) => a.Second.localeCompare(b.Second));
    },
    treeType() {
      if (this.PropertyData.FixedType === 47) {
        return 'product';
      }
      if (this.PropertyData.FixedType === 52) {
        return 'sellArea';
      }
      return 'area';
    },
    displayLevel2() {
      if (this.PropertyData.FixedType === 47) {
        return this.productLevel2;
      }
      if (this.PropertyData.FixedType === 52) {
        return this.sellAreaLevel2;
      }
      return this.areaLevel2;
    },
    checkList: {
      get() {
        if ([46, 47, 52].includes(this.PropertyData.FixedType)) {
          if (Array.isArray(this.valueList) && this.valueList.length > 0) {
            return this.valueList.filter(it => it && it.Value).map(it => JSON.parse(it.Value)).filter(it => it);
          }
          return [];
        }
        if (Array.isArray(this.valueList) && this.valueList.length > 0) {
          const _list = this.valueList.filter(it => it || it === 0);
          return this.isMultiple ? _list.map(it => it.Value) : this.valueList[0].Value;
        }
        return this.isMultiple ? [] : '';
      },
      set(val) {
        if ([46, 47, 52].includes(this.PropertyData.FixedType)) {
          const valueList = val.map(it => ({ Value: JSON.stringify(it) }));
          this.$emit('update:valueList', valueList);
          return;
        }
        const _val = val.filter(it => !!(typeof it === 'object' ? it.First : (it || it === 0)));
        const _list = this.isMultiple ? _val.map(Value => ({ Value: (typeof Value === 'object') ? (Value.First || '') : Value })) : [{ Value: _val }];
        this.$emit('update:valueList', _list);
      },
    },
    localMaterialListObj() { // 仅为物料时且列表数量大于3时使用
      return getTempMaterialListObj(this.localOptionList);
    },
    localMaterialOptionList() { // 仅为物料时且列表数量大于3时使用
      return getTempMaterialOptionList(this.localMaterialListObj);
    },
    showSelectedText() { // 已选择物料显示文字
      if (this.PropertyData.FixedType === 46) {
        return this.$utils.getTreeTextDisplayContent(this.checkList, this.allAdAreaTreeList || [], this.treeType);
      }
      if (this.PropertyData.FixedType === 47) {
        return this.$utils.getTreeTextDisplayContent(this.checkList, this.allProductClassify || [], this.treeType);
      }
      if (this.PropertyData.FixedType === 52) {
        return this.$utils.getTreeTextDisplayContent(this.checkList, this.allAreaTreeList || [], this.treeType);
      }
      if (this.ValueType !== 6) {
        const list = this.checkList.map(it => {
          const t = this.localOptionList.find(_it => _it.First === (it.First ? it.First : it));
          return t && t.Second ? t.Second : '';
        }).filter(it => it);
        return list.join('、');
      }
      return getTempMaterialSelectedListShowText(this.checkList, this.localMaterialOptionList);
    },
  },
  data() {
    return {
      showOption: true,
      showText: '',
      ValueType: '',
      propVisibel: false,
      materialVisible: false,
      areaVisible: false,
    };
  },
  methods: {
    onSelectDialogClick() {
      if ([46, 47, 52].includes(this.PropertyData.FixedType)) this.areaVisible = true;
      else if (this.ValueType === 6 && this.PropertyData.Type === 5) this.materialVisible = true;
      else this.propVisibel = true;
    },
  },
  mounted() {
    if (!AllOperatorList || AllOperatorList.length === 0 || !this.PropertyData
     || !this.PropertyData.OperatorList || this.PropertyData.OperatorList.length === 0) return;
    if (this.localOperatorList.length === 0) return;
    const [{ ID, Name }] = this.localOperatorList;
    if (!this.localValue && this.localValue !== 0) this.$emit('change', ID);
    if (this.PropertyData.OperatorList.length === 1 && this.localOperatorList.length === 1) {
      if (!(this.value || this.value === 0) || ID === this.value) {
        this.showOption = false;
        this.showText = Name;
      }
    }
    this.ValueType = this.PropertyData.ValueType;
    if (this.PropertyData.FixedType === 46) {
      this.$store.dispatch('common/fetchAdAreaList');
    }
    if (this.PropertyData.FixedType === 47) {
      this.$store.dispatch('common/getProductClassifyData');
      this.$store.dispatch('common/getAllProductNames');
    }
    if (this.PropertyData.FixedType === 52) {
      this.$store.dispatch('common/getAreaList');
    }
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
  .del-btn {
    user-select: none;
  }
  &.isMultiple {
    width: 255px;
    & + .del-btn {
      margin-left: 25px;
    }
    &.hasCompare {
      width: 280px;
    }
  }
  &.hidden {
    width: 100px !important;
  }
  .multiple-select {
    height: 30px;
    line-height: 30px;
    > .el-checkbox-group {
      height: 30px;
      width: 240px;
      overflow: hidden;
      .el-checkbox {
        margin-right: 10px;
        .el-checkbox__label {
          font-size: 12px;
          color: #585858;
          line-height: 32px;
          width: 50px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          vertical-align: -10px;
        }
      }
    }
    > .multiple {
      padding: 5px 0;
      line-height: 22px;
      font-size: 12px;
      display: flex;
      align-items: center;
      .mp-erp-common-check-box-dialog-comp-wrap {
        .el-dialog__header {
          height: 28px;
          padding: 6px 20px;
          line-height: 28px;
        }
        .el-dialog__body {
          max-height: 520px;
          overflow-y: auto;
          padding-right: 10px;
          .mp-common-comps-checkbox-group-comp-wrap {
            .el-checkbox-group {
              white-space: normal;
              .el-checkbox {
                margin-right: 15px;
                .el-checkbox__label {
                  width: 210px;
                  font-size: 12px;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
      }
      .show-text {
        display: inline-block;
        margin-left: 10px;
        color: #999;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
        max-width: 200px;
        vertical-align: middle;
      }
    }
  }
}
</style>
