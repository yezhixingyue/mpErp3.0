<template>
  <section class="mp-erp-product-manage-module-product-save-page-wrap" v-if="productData">
    <header>
      <span class="mp-common-title-wrap">{{title}}</span>
    </header>
    <LRWidthDragAutoChangeComp leftWidth='450px'>
      <template v-slot:left>
        <ul class="left-content">
          <li>
            <p>内部名称：</p>
            <el-input size="small" v-model.trim="productData.Name" maxlength="20" show-word-limit></el-input>
            <span class="tip">内部名称不能重复，仅内部可见</span>
          </li>
          <li>
            <p>显示名称：</p>
            <el-input size="small" v-model.trim="productData.ShowName" maxlength="20" show-word-limit></el-input>
            <span class="tip">显示名称可重复，用于下单界面展示</span>
          </li>
          <li>
            <p>是否标准化产品：</p>
            <el-checkbox v-model="productData.IsSpacial">非标准化产品</el-checkbox>
            <span class="tip">（ 非标准化产品允许修改价格，允许编写订单备注 ）</span>
          </li>
          <li class="remark">
            <p>产品备注：</p>
            <el-input size="small" v-model="productData.Remark" maxlength="50" show-word-limit></el-input>
            <span class="tip">设置产品负责部门或经理联系方式，用于下单界面展示,可为空</span>
          </li>
        </ul>
      </template>
      <template v-slot:right>
        <div class="right-content">
          <p>所属产品分类：</p>
          <div v-for="it of twoLevelsMultipleProductClassifyList4Sort" :key="'ProductSaveClassifyType' + it.ID">
            <p>
              <span class="title" :title="getClassifyTypeName(it.Type)">{{getClassifyTypeName(it.Type)}}：</span>
              <span v-if="!hideClassTypes.includes(it.Type)" class="hide-box" @click="onHideClick(it.Type)">隐藏 <i class="el-icon-arrow-up"></i> </span>
              <span v-else class="hide-box" @click="onShowClick(it.Type)">展开 <i class="el-icon-arrow-right"></i> </span>
            </p>
            <ul class="classify-list-wrap" v-show="!hideClassTypes.includes(it.Type)">
              <li v-for="lv1 of it.List" :key="`${lv1.ClassName}--${lv1.ID}`">
                <span class="title sub" :title="lv1.ClassName"><i>{{lv1.ClassName}}</i>：</span>
                <div v-if="lv1.children && lv1.children.length > 0">
                  <el-radio
                   v-for="lv2 of lv1.children" :key="`${lv2.ClassName}--${lv2.ID}`"
                   :value='getCheckValue(it.Type, lv1.ID, lv2.ID)'
                   :label="true"
                   @change='onCheckBoxChange(it.Type, lv1.ID, lv2.ID, lv1.ClassName, lv2.ClassName)'
                   >{{lv2.ClassName}}</el-radio>
                </div>
                <div class="none-lv2-box" v-else>空</div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </LRWidthDragAutoChangeComp>
    <footer>
      <el-button class="blue-full-color-btn-styles is-blue-button " type="primary" @click="submit">保存</el-button>
      <el-button @click="goback" class="goback"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { LRWidthDragAutoChangeComp } from '@/components/common/mpzj-sell-lib/lib';
import { normalNameReg } from '@/assets/js/utils/regexp';

export default {
  name: 'ProductDataSavePage',
  data() {
    return {
      title: '',
      productData: null,
      hideClassTypes: [],
    };
  },
  components: {
    LRWidthDragAutoChangeComp,
  },
  computed: {
    ...mapState('productManage', ['curEditData']),
    ...mapState('common', ['ProductClassifyIDList']),
    ...mapGetters('common', ['twoLevelsMultipleProductClassifyList4Sort']),
  },
  methods: {
    getInitData() {
      if (this.curEditData) {
        this.title = '编辑产品';
        const { ID, Name, ShowName, Remark, IsSpacial, ClassifyList } = this.curEditData;
        this.productData = { ID, Name, ShowName, Remark, IsSpacial, ClassifyList: JSON.parse(JSON.stringify(ClassifyList)) };
        this.hideClassTypes = [];
      } else if (!this.curEditData) {
        this.title = '添加产品';
        this.productData = { ID: '', Name: '', ShowName: '', Remark: '', IsSpacial: false, ClassifyList: [] };
        this.hideClassTypes = [];
      } else {
        this.goback();
      }
    },
    getClassifyTypeName(Type) {
      const t = this.ProductClassifyIDList.find(it => it.Type === Type);
      return t ? `${t.Name}分类` : '';
    },
    getCheckValue(Type, FirstLevelID, SecondLevelID) {
      if (!this.productData || !this.productData.ClassifyList || !Array.isArray(this.productData.ClassifyList) || this.productData.ClassifyList.length === 0) {
        return false;
      }
      return !!this.productData.ClassifyList.find(it => it.Type === Type && it.FirstLevel.ID === FirstLevelID && it.SecondLevel.ID === SecondLevelID);
    },
    onCheckBoxChange(Type, FirstLevelID, SecondLevelID, FirstLevelName, SecondLevelName) {
      if (!this.productData) return;
      if (!this.productData.ClassifyList || !Array.isArray(this.productData.ClassifyList)) {
        this.productData.ClassifyList = [];
      }
      const i = this.productData.ClassifyList.findIndex(it => it.Type === Type && it.FirstLevel.ID === FirstLevelID && it.SecondLevel.ID === SecondLevelID);
      if (i > -1) return;
      this.productData.ClassifyList = this.productData.ClassifyList.filter(it => it.Type !== Type);
      const _temp = {
        Type,
        FirstLevel: {
          ID: FirstLevelID,
          Name: FirstLevelName,
        },
        SecondLevel: {
          ID: SecondLevelID,
          Name: SecondLevelName,
        },
      };
      this.productData.ClassifyList.push(_temp);
    },
    onHideClick(Type) {
      this.hideClassTypes.push(Type);
    },
    onShowClick(Type) {
      this.hideClassTypes = this.hideClassTypes.filter(it => it !== Type);
    },
    submit() {
      if (!this.productData) return;
      const { Name, ShowName, ClassifyList } = this.productData;
      if (!Name) {
        this.messageBox.failSingleError('保存失败', '请输入内部名称');
        return;
      }
      if (!ShowName) {
        this.messageBox.failSingleError('保存失败', '请输入显示名称');
        return;
      }
      if (!ClassifyList || ClassifyList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请选择所属产品分类');
        return;
      }
      const t = ClassifyList.find(it => it.Type === 1);
      if (!t) {
        this.messageBox.failSingleError('保存失败', '应至少选择一个代客下单分类类别');
        return;
      }
      if (!normalNameReg.test(Name)) {
        this.messageBox.failSingleError('保存失败', '名称仅支持中文、英文(全角/半角)、+-_(全角/半角)、数字(全角/半角)');
        return;
      }
      if (!normalNameReg.test(ShowName)) {
        this.messageBox.failSingleError('保存失败', '名称仅支持中文、英文(全角/半角)、+-_(全角/半角)、数字(全角/半角)');
        return;
      }
      const cb = (data) => {
        this.$store.commit('common/setProductSave', data);
        this.goback();
      };
      this.$store.dispatch('productManage/getProductBaseInfoSave', [this.productData, cb]);
    },
    goback() {
      this.$router.replace('/ProductManageList');
    },
  },
  mounted() {
    this.getInitData();
    this.ProductClassifyIDList.forEach(({ ID }) => {
      this.$store.dispatch('common/getProductClassifyData', { key: ID });
    });
  },
  activated() {
    // this.getInitData();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-manage-module-product-save-page-wrap {
  padding: 25px 20px;
  height: 100%;
  box-sizing: border-box;
  > header {
    padding-bottom: 30px;
  }
  > section {
    height: calc(100% - 110px);
    min-height: 400px;
    ul.left-content {
      padding-top: 10px;
      min-width: 400px;
      > li {
        margin-bottom: 40px;
        > p {
          font-weight: 700;
          font-size: 14px;
          color: #444;
          margin-bottom: 11px;
        }
        > .el-input {
          width: 300px;
          display: block;
          margin-bottom: 4px;
          input {
            border-color: #e5e5e5;
            border-radius: 2px;
            padding-right: 45px;
            font-size: 12px;
          }
          .el-input__suffix {
            right: 1px;
          }
        }
        > span {
          font-size: 12px;
          color: #a2a2a2;
        }
        &.remark {
          > .el-input {
            width: 400px;
            input {
              padding-right: 50px;
            }
          }
        }
      }
    }
    div.right-content {
      padding-top: 10px;
      padding-left: 52px;
      > p {
        font-weight: 700;
        font-size: 14px;
        color: #444;
        // margin-bottom: 25px;
      }
      > div {
        padding-left: 40px;
        padding-top: 28px;
        max-width: 788px;
        > p {
          font-size: 14px;
          color: #585858;
          margin-bottom: 25px;
          > .title {
            margin-right: 10px;
          }
          > .hide-box {
            color: #a2a2a2;
            font-size: 12px;
            line-height: 18px;
            cursor: pointer;
            user-select: none;
            > i {
              background-color: #f5f5f5;
              border-radius: 50%;
              width: 18px;
              height: 18px;
              text-align: center;
              line-height: 18px;
              margin-left: 4px;
            }
            &:hover {
              color: #585858 !important;
              > i{
                background-color: #e5e5e5;
              }
            }
          }
        }
        > ul.classify-list-wrap {
          > li {
            font-size: 12px;
            display: flex;
            align-items: flex-start;
            > span.title {
              line-height: 16px;
              margin-right: 13px;
              color: #585858;
            }
            > .none-lv2-box {
              color: #a2a2a2;
              line-height: 14px;
              margin-bottom: 12px;
            }
            > div {
              flex-wrap: wrap;
              margin-bottom: 8px;
              padding-top: 1px;
            }
            .el-radio {
              width: 125px;
              margin-right: 10px;
              margin-bottom: 8px;
              .el-radio__label {
                font-size: 12px;
                color: #585858;
                max-width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                vertical-align: middle;
                position: relative;
                top: -1px;
              }
            }
          }
        }
        .title {
          width: 8em;
          text-align: right;
          flex: none;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &.sub {
            position: relative;
            top: -1px;
            > i {
              width: 7em;
              text-align: right;
              flex: none;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: inline-block;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
  > footer {
    padding-top: 30px;
    text-align: center;
    > button {
      width: 120px;
      height: 35px !important;
      padding: 0;
      &.goback {
        margin-left: 30px;
      }
    }
  }
}
</style>
