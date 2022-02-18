<template>
  <div class="mp-erp-common-comp-customer-remote-selector-comp-wrap">
    <el-popover
      placement="bottom-start"
      width="328"
      trigger="manual"
      popper-class='mp-batch-upload-page-header-comps-customer-select-popper-wrap'
      v-model="visible"
    >
      <!-- 输入框 -->
      <el-input
        slot="reference"
        @focus="visible = true"
        @blur="visible = false"
        @input="handleInput"
        v-model.trim="inpVal"
        :disabled='loading || disabled'
        :placeholder="placeholder"
        :class="{'show-btn': showBtn}"
        size="mini"
        ref="oInp"
      ></el-input>
      <!-- 弹出框显示区域 -->
      <ul class="customer-list">
        <li v-if="options.length === 0" class="empty">
          <span v-if="!loading && !inpVal">请输入客户关键词</span>
          <span v-else-if="loading"> <i class="el-icon-loading"></i> 正在检索信息...</span>
          <span v-else-if="!loading && inpVal && catchQueryString === inpVal">没有搜索到客户，请检查关键词</span>
          <span v-else>正在输入</span>
        </li>
        <li v-for="it in options" :key="it.CustomerID" @click="onItemClick(it)" class="item" :class="{active: it.CustomerID === customerIDFromValue}">
          <span>{{it.CustomerSN}}</span>
          <span class="name" :title="it.CustomerName">{{it.CustomerName}}</span>
          <span>{{it.Mobile}}</span>
        </li>
      </ul>
    </el-popover>
    <!-- 搜索按钮 -->
    <el-button type="primary" size="mini" @click="remoteMethod" :disabled='loading || disabled' v-if="showBtn">
      <img src="@/assets/images/search.png" alt="" />
    </el-button>
  </div>
</template>

<script>
import { debounce } from '@/assets/js/utils/throttle';

export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {},
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showBtn: {
      type: Boolean,
      default: false,
    },
    useEffect: {
      type: Boolean,
      default: false,
    },
    field: {
      type: String,
      default: 'CustomerSN',
    },
  },
  data() {
    return {
      inpVal: '',
      loading: false,
      options: [],
      visible: false,
      catchQueryString: '',
    };
  },
  computed: {
    fieldValue() {
      return this.value?.[this.field] || '';
    },
    customerIDFromValue() {
      return this.value?.CustomerID || '';
    },
  },
  methods: {
    async remoteMethod() {
      if (!this.visible) this.visible = true;
      if (this.catchQueryString === this.inpVal && this.inpVal) {
        this.$nextTick(() => {
          this.$refs.oInp.focus();
        });
        return;
      }
      if (this.useEffect) {
        this.$emit('change', null);
      }
      this.options = [];
      if (this.inpVal) {
        const temp = {
          FieldType: 3,
          KeyWords: this.inpVal,
          PageSize: 10,
          Page: 1,
        };
        this.loading = true;
        const resp = await this.api.getCustomerList(temp, { closeLoading: true }).catch(() => null);
        this.loading = false;
        if (resp && resp.data.Status === 1000) {
          this.options = resp.data.Data;
          this.catchQueryString = this.inpVal;
        } else {
          this.catchQueryString = '';
        }
      } else {
        this.catchQueryString = '';
      }
      this.$nextTick(() => {
        this.$refs.oInp.focus();
      });
    },
    onItemClick(item) { // 选中客户
      if (!item) return;
      this.$emit('change', item);
    },
    async getInitData() { // 不使用
      const temp = {
        FieldType: 3,
        CustomerID: this.customerIDFromValue,
        PageSize: 10,
        Page: 1,
      };
      const resp = await this.api.getCustomerList(temp, { closeLoading: true }).catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.options = resp.data.Data;
      }
    },
  },
  created() {
    this.handleInput = debounce(this.remoteMethod, 300);
  },
  watch: {
    loading(val) {
      if (val) {
        this.$nextTick(() => {
          if (!this.visible) this.visible = true;
        });
      }
    },
    fieldValue: {
      handler(val) {
        if (!this.useEffect) return;
        if (val) {
          this.inpVal = val;
          // 此处初始时应调用数据获取方法
          if (this.options.length === 0 && this.customerIDFromValue && Object.prototype.toString.call(this.value) === '[object Object]') {
            // this.getInitData();
            this.options = [{ ...this.value }];
          }
        }
      },
      immediate: true,
    },
    visible(val) {
      if (!this.useEffect || val !== false || this.loading) return;
      // if (this.inpVal === '') {
      //   this.$emit('change', null);
      //   return;
      // }
      this.inpVal = this.fieldValue;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-common-comp-customer-remote-selector-comp-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  > button {
    padding: 0;
    height: 28px;
    width: 60px;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    flex: none;
  }
  > span {
    flex: 1;
    .el-input {
      width: 100%;
      &.show-btn {
        input {
          border-bottom-right-radius: 0;
          border-top-right-radius: 0;
          border-right: none;
        }
      }
    }
  }
}
.mp-batch-upload-page-header-comps-customer-select-popper-wrap {
  padding-left: 7px;
  padding-right: 7px;
  .customer-list {
    font-size: 12px;
    color: #585858;
    > li {
      display: flex;
      line-height: 28px;
      padding: 1px 9px;
      cursor: pointer;
      &.item > span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:first-of-type {
          width: 95px;
        }
        &:last-of-type {
          width: 90px;
          text-align: right;
        }
        &.name {
          flex: 1;
        }
      }
      &.item:hover {
        background-color: #eee;
      }
      &.item.active {
        color: #428dfa;
        font-weight: 700;
      }
      &.empty {
        color: #888;
        i {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
