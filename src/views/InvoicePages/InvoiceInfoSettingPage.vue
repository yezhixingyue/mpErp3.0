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
              <el-input maxlength="20" size="small" v-model.trim="itemData.Name" class="n" show-word-limit></el-input>
            </li>
            <li>
              <label for="">类别单位：</label>
              <el-input maxlength="5" size="small" v-model.trim="itemData.Unit" class="u" show-word-limit></el-input>
            </li>
          </ul>
        </template>
        <template v-slot:right>
          <p class="title">选择对应的产品种类：</p>
          <NewAreaTreeSpreadComp
           :DisabledList="shouldDisabledList"
           v-if="itemData" v-model="ProductRange" :list='allProductClassify' title="产品" leftWidth='7em' rightItemWidth='10em' />
        </template>
      </LRWidthDragAutoChangeComp>
    </div>
    <footer>
      <el-button type="primary" @click="onSubmitClick">提交</el-button>
      <el-button class="cancel-blue-btn" @click="onResetClick">重置</el-button>
      <el-button class="cancel-blue-btn" @click="onGobackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import LRWidthDragAutoChangeComp from '@/components/common/NewComps/LRWidthDragAutoChangeComp.vue';
import NewAreaTreeSpreadComp from '@/components/common/SelectorComps/NewAreaTreeSpreadComp';
import InvoiceInfoItemClass from '@/store/invoice/InvoiceInfoItemClass';

export default {
  name: 'InvoiceInfoSettingPage',
  components: {
    LRWidthDragAutoChangeComp,
    NewAreaTreeSpreadComp,
  },
  data() {
    return {
      curEditOriginItem: null,
      itemData: null,
      isEdit: false,
    };
  },
  computed: {
    ...mapState('invoice', ['InvoiceInfoList']),
    ...mapGetters('common', ['allProductClassify']),
    ProductRange: {
      get() {
        return {
          IsIncludeIncreased: this.itemData ? this.itemData.IsIncludeIncreasedProduct : false,
          List: this.itemData ? this.itemData.ProductClassList : [],
        };
      },
      set(val) {
        if (!this.itemData) return;
        const { IsIncludeIncreased, List } = val;
        this.itemData.ProductClassList = List;
        this.itemData.IsIncludeIncreasedProduct = IsIncludeIncreased;
      },
    },
    ctrlText() {
      return this.isEdit ? '编辑' : '添加';
    },
    shouldDisabledList() {
      const _list = [];
      this.InvoiceInfoList.forEach((level1) => {
        if (level1.ID !== this.itemData.ID) {
          if (level1.IsIncludeIncreasedProduct) _list.push('rootIncreased');
          level1.ProductClassList.forEach(level2 => {
            if (level2.IsIncludeIncreased) _list.push(`${level2.ID}Increased`);
            level2.List.forEach(lv3 => {
              if (lv3.IsIncludeIncreased) _list.push(`${lv3.ID}Increased`);
              lv3.List.forEach(it => {
                _list.push(it.ID);
              });
            });
          });
        }
      });
      return _list;
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
        const t = this.InvoiceInfoList.find(it => it.ID === _id);
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
      if (!this.itemData.checker(this.InvoiceInfoList)) return;
      this.submit();
    },
    submit() {
      // const resp = await this.api.request(this.itemData).catch(() => null)
      // if (!resp || resp.data.Status !== 1000) return;
      const cb = () => {
        const itemData = {
          ...this.itemData,
          // ID: this.itemData.ID || resp.data.Data,
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
  },
  mounted() {
    this.setCurEditItem();
    this.onResetClick();
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
              }
              &.u {
                width: 120px;
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
