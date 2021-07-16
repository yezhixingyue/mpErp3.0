<template>
  <section class="mp-erp-price-manage-makeup-ctrl-page-wrap">
    <header>
      <p>当前产品：{{$route.params.name}}</p>
      <el-radio-group v-model="curControlType" size="small">
        <el-radio-button
         v-for="type in MakeupControlTypeList"
         :label="type.ID"
         :key="type.ID"
         >
         {{type.Name}}（{{getTypeLength(type.ID)}}）
        </el-radio-button>
      </el-radio-group>
      <div class="crtl">
        <el-scrollbar wrap-class="scrollbar-wrapper" v-if="!isSolutionListLoading">
          <el-radio-group v-model="curSolutionID" size="small">
            <el-radio-button v-for="it in curTypeSolutionList" :label="it.ID" :key="it.ID">{{it.Name}}</el-radio-button>
          </el-radio-group>
        </el-scrollbar>
        <span v-else class="is-font-size-12 is-gray" style=""> 方案加载中...</span>
        <span class="is-font-size-12 is-gray" v-if="!isSolutionListLoading && curTypeSolutionList.length === 0">该分类尚无方案，请添加</span>
        <span class="blue-span" @click="onSolutionSaveClick(null)">+添加方案</span>
        <div class="menus" v-if="curSolutionID">
          <span @click="onSolutionSaveClick(curSolutionID)" class="blue-span">编辑当前方案名称</span>
          <span class="red-span" @click="onRemoveClick">删除当前方案</span>
        </div>
      </div>
    </header>
    <main :class="isTableDataloading || isPropertyListLoading?'loading':''">
      <SolutionSaveDialog :visible.sync="solutionSaveVisible" :saveData='solutionSaveData' @submit="onSolutionSaveSubmit" />
      <SolutionTableCom
        @remove='onTableItemRemove'
        @setup="onSetupPageJump($event, '', '')"
        :type='`${curControlType}`'
        :titleObj="{title: '产品尺寸数量', btnText: '+ 添加拼版尺寸数量设置'}"
        :dataList='getTargetItemList()'
        >
        <template #title>
          <p class="tips-box"> <i class="el-icon-warning"></i> 注：未设置的产品 / 部件，不拼版</p>
        </template>
      </SolutionTableCom>
      <template v-if="curProduct && Array.isArray(curProduct.PartList)">
        <SolutionTableCom
        v-for="item in curProduct.PartList"
        :key="item.ID"
        @remove='onTableItemRemove'
        @setup="onSetupPageJump($event, item.ID, item.Name)"
        :type='`${curControlType}`'
        :titleObj="{title: `${item.Name}产品尺寸数量`, btnText: '+ 添加拼版尺寸数量设置'}"
        :dataList='getTargetItemList(item.ID)'
        />
      </template>
      <SolutionTableCom
        @remove='onTableItemRemove'
        @setup="onSetupPageJump($event, '', '')"
        :type='`${curControlType}`'
        :titleObj="{title: '多个部件1混拼设置', btnText: '+ 添加条件'}"
        :dataList='[]'
        >
        <template #title>
          <div>
            <span class="blue-span">设置默认</span>
            <span class="is-gray is-font-size-12">默认：不混拼</span>
            <span class="blue-span">相同条件设置</span>
            <span class="is-gray is-font-size-12">工艺：覆膜 印面 印色 相同工艺：覆膜 印面 印色 相同工艺：覆膜 印面 印色 相同</span>
            <span class="blue-span">排除数量设置</span>
            <span class="is-gray is-font-size-12">子公式1</span>
          </div>
        </template>
      </SolutionTableCom>
    </main>
    <footer>
      <el-button class="goback" @click="onGobackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import PropertyClass from '@/assets/js/TypeClass/PropertyClass';
import SolutionSaveDialog from '@/components/PriceComps/MakeupCtrl/SolutionSaveDialog';
import SolutionTableCom from '@/components/PriceComps/MakeupCtrl/SolutionTableCom.vue';

export default {
  name: 'MakeupCtrl',
  components: {
    SolutionSaveDialog,
    SolutionTableCom,
  },
  computed: {
    ...mapState('priceManage', ['MakeupControlTypeList', 'MakeupLeftPropertyList', 'MakeupRightPropertyList', 'SizeNumberPropertyList', 'PriceManageList']),
    curTypeSolutionList() {
      if (!this.solutionList || (!this.curControlType && this.curControlType !== 0) || this.solutionList.length === 0) return [];
      return this.solutionList.filter(it => it.Type === this.curControlType);
    },
    curSolutionItem() {
      if (!this.curSolutionID) return null;
      return this.solutionList.find(it => it.ID === this.curSolutionID);
    },
    localSolutionDataList() {
      if (!Array.isArray(this.MakeupRuleItemList) || this.MakeupRuleItemList.length === 0) return [];
      const list = JSON.parse(JSON.stringify(this.MakeupRuleItemList)).map(it => {
        const { Constraint } = it;
        const [_Constraint, _ConditionText] = PropertyClass.getConstraintAndTextByImperfectConstraint(
          Constraint, this.MakeupLeftPropertyList, this.MakeupRightPropertyList,
        );
        return { ...it, Constraint: _Constraint, _ConditionText };
      });
      return list;
    },
    curProduct() {
      if (Array.isArray(this.PriceManageList) && this.$route.params.id) {
        return this.PriceManageList.find(it => it.ID === this.$route.params.id);
      }
      return null;
    },
  },
  data() {
    return {
      curControlType: 0,
      curSolutionID: '',
      solutionSaveVisible: false,
      solutionSaveData: null,
      solutionList: [],
      isSolutionListLoading: true,
      MakeupRuleItemList: [],
      isTableDataloading: false,
      isPropertyListLoading: true,
    };
  },
  methods: {
    onGobackClick() {
      this.$router.replace('/PriceManageList');
    },
    onSolutionSaveClick(ID) {
      const data = ID ? this.solutionList.find(it => it.ID === ID) : null;
      const temp = {
        ID: data ? data.ID : '',
        Name: data ? data.Name : '',
        Type: this.curControlType,
        ProductID: this.$route.params.id,
      };
      this.solutionSaveData = temp;
      this.solutionSaveVisible = true;
    },
    async onSolutionSaveSubmit(data) { // 保存拼版方案
      const nameSameItem = this.solutionList.find(it => it.Name === data.Name);
      if (nameSameItem) {
        if (nameSameItem.ID === data.ID) {
          this.messageBox.failSingleError('保存失败', '方案名称未发生更改');
        } else {
          this.messageBox.failSingleError('保存失败', '存在相同的方案名称');
        }
        return;
      }
      const resp = await this.api.getMakeupSolutionSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          if (!data.ID) { // 新增
            this.solutionList.push({ ...data, ID: resp.data.Data });
            if (this.curTypeSolutionList.length === 1) this.curSolutionID = resp.data.Data;
          } else { // 编辑
            const t = this.solutionList.find(it => it.ID === data.ID);
            if (t) t.Name = data.Name;
          }
          this.solutionSaveVisible = false;
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    async getMakeupSolutionList() { // 获取拼版方案列表数据
      const resp = await this.api.getMakeupSolutionList(this.$route.params.id).catch(() => {});
      this.isSolutionListLoading = false;
      if (resp && resp.data.Status === 1000) {
        this.solutionList = resp.data.Data;
        if (this.solutionList.length > 0) this.curSolutionID = this.solutionList[0].ID;
      }
    },
    onRemoveClick() {
      this.messageBox.warnCancelBox('确定要删除当前方案吗', `方案名称：[ ${this.curSolutionItem ? this.curSolutionItem.Name : '未知方案名称'} ]`, () => {
        this.getMakeupSolutionRemove();
      });
    },
    async getMakeupSolutionRemove() { // 删除方案
      const resp = await this.api.getMakeupSolutionRemove(this.curSolutionID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          const i = this.solutionList.findIndex(it => it.ID === this.curSolutionID);
          if (i > -1) {
            this.solutionList.splice(i, 1);
            const _atterList = this.solutionList.slice(i);
            const t = _atterList.find(it => it.Type === this.curControlType);
            if (t) this.curSolutionID = t.ID;
            else {
              const _formerList = this.solutionList.slice(0, i).reverse();
              const t2 = _formerList.find(it => it.Type === this.curControlType);
              if (t2) this.curSolutionID = t2.ID;
              else this.curSolutionID = '';
            }
          }
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    getTypeLength(type) {
      return this.solutionList.filter(it => it.Type === type).length;
    },
    async onTableItemRemove(e) {
      if (!e || !e.ID) return;
      const resp = await this.api.getMakeupSolutionItemRemove(e.ID).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.MakeupRuleItemList = this.MakeupRuleItemList.filter(it => it.ID !== e.ID);
        };
        this.messageBox.successSingle('删除成功', cb, cb);
      }
    },
    onSetupPageJump(data, PartID, PartName) { // 跳转条件配置页面
      if (!data) return;
      const [setType, editData] = data;
      const params = {
        ProductID: this.$route.params.id,
        PartID: PartID || 'null',
        ProductName: this.$route.params.name,
        PartName: PartName || 'null',
        SolutionName: this.curSolutionItem.Name,
        SolutionID: this.curSolutionItem.ID,
        setType,
      };
      this.$store.commit('priceManage/setCurMakeupItemEditData', editData);
      this.$router.push({ name: 'MakeupCtrlConditionSet', params });
    },
    async getMakeupRuleItemList() { // 获取方案列表数据
      if (!this.curSolutionID) return;
      this.isTableDataloading = true;
      const resp = await this.api.getMakeupRuleItemList(this.curSolutionID).catch(() => {});
      this.isTableDataloading = false;
      if (resp && resp.data.Status === 1000) {
        this.MakeupRuleItemList = resp.data.Data;
      }
    },
    getTargetItemList(PartID) {
      if (!Array.isArray(this.localSolutionDataList)) return [];
      if (PartID) {
        return this.localSolutionDataList.filter(it => it.PartID === PartID);
      }
      return this.localSolutionDataList.filter(it => !it.PartID);
    },
  },
  watch: {
    curControlType() {
      if (this.curTypeSolutionList.length > 0) this.curSolutionID = this.curTypeSolutionList[0].ID;
      else this.curSolutionID = '';
      this.MakeupRuleItemList = [];
    },
    curSolutionID() {
      this.getMakeupRuleItemList();
    },
  },
  async mounted() {
    this.getMakeupSolutionList();
    await this.$store.dispatch('priceManage/getMakeupPropertyList', this.$route.params.id);
    this.isPropertyListLoading = false;
  },
  activated() {
    this.getMakeupRuleItemList();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-manage-makeup-ctrl-page-wrap {
  padding: 0 10px;
  background-color: #f5f5f5;
  min-width: 980px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  > header {
    padding: 20px;
    padding-bottom: 25px;
    background-color: #fff;
    flex: none;
    > p {
      font-weight: 700;
      line-height: 30px;
      font-size: 15px;
      color: #21CAE3;
      margin-bottom: 25px;
    }
    .el-radio-group {
      > .el-radio-button {
        user-select: none;
        .el-radio-button__inner {
          font-size: 14px;
          padding: 5px 16px;
          padding-left: 20px;
          width: 120px;
          line-height: 20px;
        }
        position: relative;
        &::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #fff;
          opacity: 0;
          z-index: 10;
          left: 10px;
          top: calc(50% - 2px);
          transition: opacity 0.1s ease-in-out;
        }
        &.is-active{
          &::before {
            opacity: 1;
          }
        }
      }
    }
    > .crtl {
      display: flex;
      align-items: center;
      height: 32px;
      line-height: 32px;
      margin-top: 23px;
      > span {
        font-size: 14px;
        margin-right: 30px;
        white-space: nowrap;
        &.is-gray {
          text-indent: 1em;
        }
      }
      > .menus {
        font-size: 12px;
        white-space: nowrap;
        > span {
          margin-left: 30px;
          line-height: 32px;
          white-space: nowrap;
        }
      }
      > .el-scrollbar {
        overflow: hidden;
        margin-right: 12px;
        .el-radio-group {
          white-space: nowrap;
          .el-radio-button__inner {
            width: auto;
            min-width: 100px;
          }
        }
      }
    }
  }
  > main {
    flex: 1;
    margin-top: 10px;
    background-color: #fff;
    padding-left: 20px;
    padding-top: 30px;
    padding-right: 8px;
    // > .mp-erp-product-module-interaction-risk-warning-table-com-container {
    //   > header {
    //   }
    // }
    &.loading {
      > section {
        opacity: 0.2;
      }
    }
    .tips-box {
      width: 300px;
      margin-left: 35px;
    }
  }
  > footer {
    background-color: #fff;
    padding: 20px;
    text-align: center;
    padding-right: 120px;
  }
}
</style>
