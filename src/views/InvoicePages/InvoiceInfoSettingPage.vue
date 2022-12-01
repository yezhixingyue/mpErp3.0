<template>
  <section class="mp-erp-invoice-info-manage-setting-page-wrap">
    <header>
      <p class="mp-common-title-wrap">{{ctrlText}}开票类别</p>
    </header>
    <div class="content">
      <LRWidthDragAutoChangeComp leftWidth='610px'>
        <template v-slot:left>
          <ul class="invoice-info-setting-left-content" v-if="itemData">
            <li>
              <label for="">开票类别名称：</label>
              <el-input maxlength="30" size="small" v-model.trim="itemData.CategoryName" class="n" show-word-limit></el-input>
            </li>
            <li>
              <label for="">类别单位：</label>
              <el-input maxlength="6" size="small" v-model.trim="itemData.Unit" class="u" show-word-limit></el-input>
            </li>
          </ul>
        </template>
        <template v-slot:right>
          <p class="title">选择对应的产品种类：</p>
          <MultipleLevel2Selector v-if="itemData" v-model="itemData.ProductList" :disabledIds="shouldDisabledList" />
        </template>
      </LRWidthDragAutoChangeComp>
    </div>
    <footer>
      <el-button type="primary" @click="onSubmitClick">保存</el-button>
      <el-button class="cancel-blue-btn" @click="onResetClick">重置</el-button>
      <el-button class="cancel-blue-btn" @click="onGobackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LRWidthDragAutoChangeComp } from '@/components/common/mpzj-sell-lib/lib';
import InvoiceInfoItemClass from '@/store/invoice/InvoiceInfoItemClass';
import MultipleLevel2Selector from '@/components/common/SelectorComps/MultipleLevel2Selector/index.vue';

export default {
  name: 'InvoiceInfoSettingPage',
  components: {
    LRWidthDragAutoChangeComp,
    MultipleLevel2Selector,
  },
  data() {
    return {
      curEditOriginItem: null,
      itemData: null,
      isEdit: false,
      shouldDisabledList: [],
    };
  },
  computed: {
    ...mapState('invoice', ['InvoiceInfoList', 'defaultItemInfo']),
    ...mapGetters('common', ['allProductClassify']),
    ctrlText() {
      return this.isEdit ? '编辑' : '添加';
    },
  },
  methods: {
    setCurEditItem() {
      const _id = this.$route.params.id;
      if (_id === 'new') {
        this.isEdit = false;
        this.curEditOriginItem = null;
      } else {
        this.isEdit = true;
        const t = this.InvoiceInfoList.find(it => it.InvoiceCategoryID === _id);
        this.curEditOriginItem = t; // 在列表数据中找到该项，对其进行赋值
      }
    },
    onGobackClick() {
      this.$goback();
    },
    onResetClick() {
      this.itemData = new InvoiceInfoItemClass(this.curEditOriginItem);
    },
    onSubmitClick() {
      if (!this.itemData.checker(this.InvoiceInfoList, this.defaultItemInfo)) return;
      this.submit();
    },
    async submit() {
      if (this.isEdit && JSON.stringify(this.itemData) === JSON.stringify(new InvoiceInfoItemClass(this.curEditOriginItem))) {
        this.messageBox.failSingleError('操作失败', '信息未改动');
        return;
      }
      const resp = await this.api.getInvoiceCategorySave(this.itemData).catch(() => null);
      if (!resp || resp.data.Status !== 1000) return;
      const cb = () => {
        const itemData = {
          ...this.itemData,
          InvoiceCategoryID: this.itemData.InvoiceCategoryID || +resp.data.Data,
        };
        const temp = {
          itemData,
          isEdit: this.isEdit,
        };
        this.$store.commit('invoice/setInvoiceInfoItemChange', temp);
        this.onGobackClick();
      };
      this.messageBox.successSingle(`${this.ctrlText}成功`, cb, cb);
    },
    getShouldDisabledList() {
      if (!this.itemData) {
        this.shouldDisabledList = [];
        return;
      }
      const _list = [];
      this.InvoiceInfoList.forEach((it) => {
        if (it.InvoiceCategoryID !== this.itemData.InvoiceCategoryID) {
          // const tempArr = oTree.getDefaultCheckedKeys(it.ProductList);
          const tempArr = it.ProductList.map(_it => _it.TypeID);
          if (Array.isArray(tempArr)) {
            _list.push(...tempArr);
          }
        }
      });
      this.shouldDisabledList = _list;
    },
  },
  mounted() {
    this.setCurEditItem();
    this.onResetClick();
    this.$nextTick(() => {
      this.getShouldDisabledList();
    });
  },
};
</script>
<style lang='scss'>
.mp-erp-invoice-info-manage-setting-page-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding-right: 12px;
  > header {
    flex: none;
    padding: 35px 45px;
  }
  > div.content {
    flex: 1;
    font-size: 14px;
    color: #585858;
    overflow: hidden;
    padding-left: 45px;
    .mp-erp-common-comps-left-and-right-width-drap-auto-change-comp-wrap {
      > .left {
        > ul.invoice-info-setting-left-content {
          min-width: 500px;
          padding-right: 20px;
          > li {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            > label {
              min-width: 7em;
              text-align: right;
            }
            > .el-input {
              &.n {
                width: 420px;
                input {
                  padding-right: 52px;
                }
              }
              &.u {
                width: 140px;
              }
            }
          }
        }
      }
      > .right {
        padding-left: 24px;
        > p.title {
          line-height: 32px;
          min-width: 500px;
          margin-bottom: 10px;
        }
      }
    }
  }
  > footer {
    flex: none;
    height: 104px;
    padding-top: 36px;
    padding-left: 400px;
    padding-left: 22vw;
    box-sizing: border-box;
    text-align: left;
    white-space: nowrap;
    > button.el-button {
      width: 120px;
      height: 35px;
      padding: 0;
      & + button {
        margin-left: 35px;
      }
    }
  }
}
</style>
