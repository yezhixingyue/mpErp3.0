<template>
  <section class="mp-erp-customer-setup-page-wrap">
    <header v-show="localPermission.SetupType">
      <el-button type="primary" size="small" @click="onClassifySaveClick(null)"
        >添加客户分类</el-button
      >
      <el-button type="primary" size="small" @click="onRangeSaveClick(null)"
        >添加客户等级</el-button
      >
    </header>
    <main>
      <!-- 导航 -->
      <div class="header">
        <p>
          <span
            v-for="item in typeList"
            :class="{ active: item.ID === curType }"
            :key="item.ID"
            @click="curType = item.ID"
            >{{ item.Name }}</span
          >
        </p>
      </div>
      <!-- 列表 -->
      <div class="content">
        <!-- 客户分类列表 -->
        <CustomerClassifyTable
          v-if="curType === typeObj.classify.ID"
          :list="curTypeDataList"
          :canSetup='localPermission.SetupType'
          @edit="onClassifySaveClick"
          @remove="onRemoveClick"
        />
        <!-- 客户等级列表 -->
        <CustomerRangeTable
          v-if="curType === typeObj.customerRange.ID"
          :list="curTypeDataList"
          :canSetup='localPermission.SetupType'
          @edit="onRangeSaveClick"
          @remove="onRemoveClick"
        />
        <!-- 价格等级列表 -->
        <PriceRangeTable
          v-if="curType === typeObj.priceRange.ID"
          :list="curTypeDataList"
          :canSetup='localPermission.SetupPriceGrade'
          @change="onPriceRangeChange"
        />
      </div>
      <!-- 弹窗 -->
      <CustomerClassifyDialog
        :visible.sync="classifyVisible"
        :itemData="curEditData"
        @submit="handleClassifySaveSubmit"
        :list="curTypeDataList"
      />
      <CustomerRangeDialog
        :visible.sync="rangeVisible"
        :itemData="curEditData"
        @submit="handleClassifySaveSubmit"
        :list="curTypeDataList"
      />
    </main>
    <footer>
      <span
        >共检索出
        <i class="is-blue is-bold">{{ curTypeDataList.length }}</i> 条记录</span
      >
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import getEnumList from '../../assets/js/utils/getEnumList';
import CustomerClassifyTable from '../../components/CustomerSetupComps/CustomerClassifyTable.vue';
import CustomerRangeTable from '../../components/CustomerSetupComps/CustomerRangeTable.vue';
import PriceRangeTable from '../../components/CustomerSetupComps/PriceRangeTable.vue';
import CustomerClassifyDialog from '../../components/CustomerSetupComps/CustomerClassifyDialog.vue';
import CustomerRangeDialog from '../../components/CustomerSetupComps/CustomerRangeDialog.vue';

export default {
  name: 'CustomerSetupPage',
  components: {
    CustomerClassifyTable,
    CustomerRangeTable,
    PriceRangeTable,
    CustomerClassifyDialog,
    CustomerRangeDialog,
  },
  data() {
    const typeObj = {
      classify: {
        ID: 1,
        Name: '客户分类',
      },
      customerRange: {
        ID: 2,
        Name: '客户等级',
      },
      priceRange: {
        ID: 3,
        Name: '价格等级',
      },
    };
    return {
      dataList: [],
      typeObj,
      curType: typeObj.classify.ID,
      classifyVisible: false,
      rangeVisible: false,
      curEditData: null,
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
    typeList() {
      return getEnumList(this.typeObj);
    },
    curTypeDataList() {
      return Array.isArray(this.dataList) && this.dataList.length > 0
        ? this.dataList.filter((it) => it.Type === this.curType)
        : [];
    },
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionSetupCustomerType?.Obj) {
        return this.Permission.PermissionList.PermissionSetupCustomerType.Obj;
      }
      return {};
    },
  },
  methods: {
    async getDataList() {
      const resp = await this.api.getCustomerCategoryList().catch(() => null);
      if (resp && resp.data.Status === 1000) {
        this.dataList = resp.data.Data;
      }
    },
    onPriceRangeChange(data) {
      // 价格等级保存成功后的处理函数
      if (Array.isArray(data)) {
        const _list = this.dataList.filter(
          (it) => it.Type !== this.typeObj.priceRange.ID,
        );
        this.dataList = [..._list, ...data];
      }
    },
    onClassifySaveClick(item) {
      // 客户分类保存 (编辑|新增)
      this.curEditData = item || { Type: this.typeObj.classify.ID };
      this.classifyVisible = true;
    },
    async onRemoveClick({ CategoryID, Type }) {
      // 客户分类删除
      const resp = await this.api
        .getCustomerCategoryRemove(CategoryID, Type)
        .catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const i = this.dataList.findIndex(
            (it) => it.CategoryID === CategoryID,
          );
          if (i > -1) {
            this.dataList.splice(i, 1);
          }
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    onRangeSaveClick(item) {
      // 客户等级保存 (编辑|新增)
      this.curEditData = item || { Type: this.typeObj.customerRange.ID };
      this.rangeVisible = true;
    },
    async handleClassifySaveSubmit(item) {
      // 客户分类和客户等级保存提交
      if (!item) return;
      const resp = await this.api
        .getCustomerCategorySave(item)
        .catch(() => null);
      if (resp && resp.data.Status === 1000) {
        const isEdit = item.CategoryID || item.CategoryID === 0;
        const title = isEdit ? '编辑成功' : '添加成功';
        const cb = () => {
          if (isEdit) {
            const i = this.dataList.findIndex(
              (it) => it.CategoryID === item.CategoryID,
            );
            if (i > -1) {
              this.dataList.splice(i, 1, item);
            }
          } else {
            this.dataList.push({ ...item, CategoryID: resp.data.Data });
          }
          this.classifyVisible = false;
          this.rangeVisible = false;
          this.curType = item.Type;
        };
        this.messageBox.successSingle(title, cb, cb);
      }
    },
  },
  watch: {
    dataList(newVal) {
      // 此页面修改对仓库中的数据调整最后进行处理
      if (!Array.isArray(newVal) || newVal.length === 0) return;
      this.$store.commit('common/setUserInfo', newVal);
    },
  },
  mounted() {
    this.getDataList();
  },
};
</script>
<style lang='scss'>
.mp-erp-customer-setup-page-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #f5f5f5;
  box-sizing: border-box;
  padding-left: 8px;
  font-size: 14px;
  min-width: 800px;
  > header {
    flex: none;
    height: 30px;
    background: #fff;
    margin-bottom: 10px;
    padding: 16px 20px;
    > button.el-button {
      padding: 0;
      height: 30px;
      width: 125px;
      font-size: 14px;
      border-radius: 2px;
      & + button {
        margin-left: 32px;
      }
    }
  }
  > main {
    flex: 1;
    background: #fff;
    overflow: hidden;
    > .header {
      padding-top: 18px;
      padding-bottom: 25px;
      > p {
        border-bottom: 1px solid #eee;
        padding: 0 20px;
        > span {
          display: inline-block;
          width: 120px;
          height: 38px;
          color: #585858;
          line-height: 40px;
          text-align: center;
          box-sizing: border-box;
          background: #f5f5f5;
          border-left: 1px solid #eee;
          border-top: 1px solid #eee;
          cursor: pointer;
          transition: 0.05s ease-in-out;
          &:last-of-type {
            border-right: 1px solid #eee;
          }
          &.active {
            background: #fff;
            position: relative;
            color: #428dfa;
            top: 1px;
            &::before {
              content: "";
              width: 100%;
              position: absolute;
              left: 0;
              height: 3px;
              top: -1px;
              background: #428dfa;
              border-radius: 1px;
            }
          }
        }
      }
    }
    > .content {
      height: calc(100% - 82px);
      width: 865px;
      padding: 0 20px;
      > section {
        color: #585858;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 20px;
        box-sizing: border-box;
        > header {
          flex: none;
          height: 38px;
          background: #f5f5f5;
          border: 1px solid #eee;
          box-sizing: border-box;
          padding: 9px 0;
          line-height: 18px;
          font-weight: 700;
        }
        > main {
          flex: 1;
          overflow-y: scroll;
          overflow-y: overlay;
          scroll-behavior: smooth;
          > ul {
            > li {
              height: 40px;
              padding: 6px 0;
              line-height: 28px;
              box-sizing: border-box;
              transition: background 0.06s ease-in-out;
              > div {
                &:nth-of-type(2) {
                  color: #989898;
                  font-size: 13px;
                }
              }
              &:hover {
                background: #d8effc;
              }
            }
          }
        }
        > header > div,
        > main > ul > li > div {
          display: inline-block;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          &:first-of-type {
            width: 220px;
          }
          &:nth-of-type(2) {
            width: 380px;
            padding-right: 80px;
          }
          &:last-of-type {
            width: 180px;
          }
        }
        > footer {
          flex: none;
        }
      }
    }
  }
  > footer {
    flex: none;
    background: #fff;
    color: #888;
    text-align: right;
    padding: 15px 30px;
  }
}
</style>
