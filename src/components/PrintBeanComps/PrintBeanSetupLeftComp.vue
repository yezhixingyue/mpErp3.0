<template>
  <section v-if="curPrintBeanData" class="mp-erp-print-bean-setup-page-left-comp-wrap">
    <ul>
      <li>
        <label>优先级：</label>
        <el-input v-model.number="Priority" style="width:90px" size="mini" maxlength="3"></el-input>
        <span class="tips-box"><i class="el-icon-warning"></i> 注：数字越小优先级越高</span>
      </li>
      <li>
        <label>标题：</label>
        <el-input v-model.trim="Title" style="width:400px" size="mini" maxlength="20" show-word-limit></el-input>
      </li>
      <li>
        <label>描述：</label>
        <el-input v-model="Describe" style="width:600px" size="mini" class="more-text"  maxlength="60" show-word-limit></el-input>
      </li>
      <li>
        <label>开始日期：</label>
        <el-date-picker
          v-model="StartTime"
          :picker-options="{disabledDate: handleDisabledStartDate, format: 'HH:mm'}"
          :disabled='isStarted'
          size="mini"
          key="StartTime"
          type="datetime"
          value-format="yyyy-MM-ddTHH:mm:ss"
          format="yyyy-MM-dd HH:mm"
          style="width:180px"
          placeholder=" 年 / 月 / 日"
          popper-class='mp-price-tactic-list-page-header-date-selector-wrap'
        />
      </li>
      <li>
        <label></label>
        <el-switch
          v-model="_IsActiveOnLong"
          active-color="#26bcf9"
          active-text="长期执行"
          inactive-color="#DCDFE6">
        </el-switch>
      </li>
      <li>
        <label>结束日期：</label>
        <el-date-picker
          v-model="EndTime"
          :picker-options="{disabledDate: handleDisabledEndDate, format: 'HH:mm'}"
          :disabled='_IsActiveOnLong'
          size="mini"
          type="datetime"
          key="EndTime"
          value-format="yyyy-MM-ddTHH:mm:ss"
          format="yyyy-MM-dd HH:mm"
          default-time="23:59:00"
          style="width:180px"
          placeholder=" 年 / 月 / 日"
          popper-class='mp-price-tactic-list-page-header-date-selector-wrap'
        />
      </li>
      <li class="tyle-radio">
        <label></label>
        <el-radio-group v-model="Category">
          <el-radio :label="it.ID" v-for="it in CategoryEnumsList" :key="it.ID">{{it.Name}}</el-radio>
        </el-radio-group>
      </li>
      <li class="customer" v-if="Category === CategoryEnums.Customer.ID">
        <label>客户编号：</label>
        <CustomerRemoteSelector v-model="Customer" useEffect />
      </li>
    </ul>
    <CheckboxGroupComp
      v-show="Category === CategoryEnums.CustomerType.ID"
      title="客户类型"
      :itemList='userTypeListNoneEmpty'
      :showTips='false'
      v-model="CustomerTypeList"
    />
    <CheckboxGroupComp
      v-show="Category === CategoryEnums.CustomerType.ID"
      title="客户等级"
      :itemList='userRankListNoneEmpty'
      :showTips='false'
      v-model="GradeList"
    />
    <div class="area-box" v-show="Category === CategoryEnums.CustomerType.ID">
      <h2>销售区域：</h2>
      <NewAreaTreeSpreadComp v-model="AreaList" :list='allAreaTreeList' />
    </div>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { CategoryEnums, CategoryEnumsList } from '../../store/printBean/PrintBeanClassType';
import CheckboxGroupComp from '../common/CheckboxGroupComp.vue';
import NewAreaTreeSpreadComp from '../common/SelectorComps/NewAreaTreeSpreadComp/index.vue';
import CustomerRemoteSelector from '../common/SelectorComps/CustomerRemoteSelector.vue';

export default {
  props: {
    curPrintBeanData: {
      type: Object,
      default: null,
    },
    isStarted: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CheckboxGroupComp,
    NewAreaTreeSpreadComp,
    CustomerRemoteSelector,
  },
  data() {
    return {
      CategoryEnums, // 类别枚举对象
      CategoryEnumsList, // 类别枚举列表
    };
  },
  computed: {
    ...mapState('common', ['userTypeListNoneEmpty', 'userRankListNoneEmpty']),
    ...mapGetters('common', ['allAreaTreeList']),
    Priority: {
      get() {
        return this.curPrintBeanData?.Priority;
      },
      set(val) {
        this.$emit('change', ['Priority', val]);
      },
    },
    Title: {
      get() {
        return this.curPrintBeanData?.Title;
      },
      set(val) {
        this.$emit('change', ['Title', val]);
      },
    },
    Describe: {
      get() {
        return this.curPrintBeanData?.Describe;
      },
      set(val) {
        this.$emit('change', ['Describe', val]);
      },
    },
    StartTime: {
      get() {
        return this.curPrintBeanData?.StartTime;
      },
      set(val) {
        this.$emit('change', ['StartTime', val]);
      },
    },
    EndTime: {
      get() {
        if (this.curPrintBeanData?._IsActiveOnLong) return '';
        return this.curPrintBeanData?.EndTime;
      },
      set(val) {
        this.$emit('change', ['EndTime', val]);
      },
    },
    _IsActiveOnLong: {
      get() {
        return this.curPrintBeanData?._IsActiveOnLong;
      },
      set(val) {
        this.$emit('change', ['_IsActiveOnLong', val]);
      },
    },
    Category: {
      get() {
        return this.curPrintBeanData?.Category;
      },
      set(val) {
        this.$emit('change', ['Category', val]);
      },
    },
    CustomerTypeList: {
      get() {
        return this.curPrintBeanData?.CustomerTypeList.map(it => ({ CategoryID: it.ID })) || [];
      },
      set(list) {
        const _list = list.map(it => ({ ID: it.CategoryID }));
        this.$emit('change', ['CustomerTypeList', _list]);
      },
    },
    GradeList: {
      get() {
        return this.curPrintBeanData?.GradeList.map(it => ({ CategoryID: it.ID })) || [];
      },
      set(list) {
        const _list = list.map(it => ({ ID: it.CategoryID }));
        this.$emit('change', ['GradeList', _list]);
      },
    },
    AreaList: {
      get() {
        return {
          IsIncludeIncreased: this.curPrintBeanData?.IsIncludeIncreasedArea || false,
          List: this.curPrintBeanData?.AreaList || [],
        };
      },
      set(val) {
        const { IsIncludeIncreased, List } = val;
        this.$emit('change', ['IsIncludeIncreasedArea', IsIncludeIncreased || false]);
        this.$emit('change', ['AreaList', List || []]);
      },
    },
    Customer: {
      get() {
        return this.curPrintBeanData?.Customer || {};
      },
      set(customer) {
        this.$emit('change', ['Customer', customer]);
      },
    },
  },
  methods: {
    handleDisabledStartDate(e) { // 限制开始日期
      if (this.EndTime && !this._IsActiveOnLong) {
        // eslint-disable-next-line max-len
        return new Date(e).getTime() > new Date(new Date(`${this.EndTime.slice(0, 16)}:59`)).getTime() || new Date(e).getTime() < new Date(new Date().toLocaleDateString());
      }
      return new Date(e).getTime() < new Date(new Date().toLocaleDateString());
    },
    handleDisabledEndDate(e) { // 限制结束日期
      if (this.StartTime) {
        return new Date(e).getTime() < new Date(new Date(this.StartTime).toLocaleDateString()).getTime();
      }
      return new Date(e).getTime() < new Date(new Date().toLocaleDateString());
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-print-bean-setup-page-left-comp-wrap {
  padding-left: 60px;
  min-width: 700px;
  > ul {
    > li {
      display: flex;
      align-items: center;
      white-space: nowrap;
      margin-bottom: 20px;
      > label {
        font-weight: 700;
        margin-right: 6px;
        width: 80px;
        text-align: right;
      }
      .tips-box {
        width: 400px;
        margin-left: 25px;
      }
      .el-input {
        flex: none;
        height: 30px;
        input {
          height: 30px;
          line-height: 28px;
          border-radius: 4px;
        }
        &.more-text {
          input {
            padding-right: 50px;
          }
        }
        &.el-date-editor {
          .el-input__prefix, .el-input__suffix {
            top: 1px;
          }
        }
      }
      .el-switch__label {
        > span {
          font-size: 12px;
          color: #585858;
          user-select: none;
        }
        &.is-active {
          > span {
            color: #26bcf9;
          }
        }
      }
      .el-radio__label {
        color: #585858;
      }
      &.tyle-radio {
        padding-top: 10px;
      }
      &.customer {
        margin-top: -2px;
        > div {
          width: 200px;
        }
      }
    }
    padding-bottom: 3px;
  }
  .mp-common-comps-checkbox-group-comp-wrap {
    margin-bottom: 16px;
    > span {
      font-weight: 700;
      margin-right: 6px;
      width: 80px;
      text-align: right;
      color: #585858;
    }
    > div {
      .el-checkbox {
        margin-bottom: 4px;
        margin-right: 15px;
        .el-checkbox__label {
          font-size: 12px;
          color: #585858 !important;
          position: relative;
          top: 1px;
          min-width: 72px;
        }
      }
    }
  }
  > .area-box {
    padding-left: 12px;
    > h2 {
      font-weight: 700;
      margin-bottom: 8px;
    }
  }
}
</style>
