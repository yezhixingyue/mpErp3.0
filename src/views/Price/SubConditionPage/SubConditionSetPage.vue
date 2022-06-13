<template>
  <section class="mp-erp-price-manage-child-condition-set-page-wrap">
    <header>
      <span>当前部件：{{$route.params.ProductName}} - {{$route.params.PartName}}</span>
      <div>
        <span class="label">子条件名称：</span>
        <el-input v-model.trim="Name" size="small" maxlength="10" show-word-limit></el-input>
      </div>
    </header>
    <main>
      <ContionCommonComp
       ref="oLeftComp"
       :PropertyList='PropertyList'
       :curEditData='curChildConditionEditData'
       single
       canNotNull
       :showPriority='false'
       leftText='条件' />
    </main>
    <footer>
      <el-button @click="onSubmitClick" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';

export default {
  name: 'subConditionSet',
  data() {
    return {
      visible: false,
      Name: '',
    };
  },
  components: {
    ContionCommonComp,
  },
  computed: {
    ...mapState('priceManage', ['ChildConditionPropertyList', 'curChildConditionEditData']),
    PropertyList() {
      if (this.ChildConditionPropertyList.length === 0) return [];
      const t = this.ChildConditionPropertyList.find(it => it.length > 0 && it[0].Part && it[0].Part.ID === this.$route.params.PartID);
      return t || [];
    },
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    onSubmitClick() {
      if (!this.Name) {
        this.messageBox.failSingleError('保存失败', '请输入子条件名称');
        return;
      }
      const condition = this.$refs.oLeftComp.getConditonResult();
      if (!condition) return;
      const temp = {
        ...condition,
        Name: this.Name,
        PartID: this.$route.params.PartID,
      };
      delete temp.Priority;
      this.handleSubmit(temp);
    },
    async handleSubmit(data) {
      const resp = await this.api.getPartChildConditionSave(data).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          this.onGoBackClick();
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
  },
  mounted() {
    if (this.curChildConditionEditData && this.curChildConditionEditData.Name) this.Name = this.curChildConditionEditData.Name;
  },
};
</script>
<style lang='scss'>
.mp-erp-price-manage-child-condition-set-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 40px;
    line-height: 20px;
    box-sizing: border-box;
    height: 120px;
    color: #21CAE3;
    flex: none;
    white-space: nowrap;
    > span {
      &:first-of-type {
        font-weight: bold;
        font-size: 15px;
        margin-left: 0;
        margin-right: 10px;
      }
      margin-left: 40px;
      font-size: 14px;
    }
    > div {
      padding: 30px 0;
      padding-top: 35px;
      > span {
        color: #888E99;
        font-size: 14px;
      }
      > div {
        width: 400px;
        .el-input__inner {
          font-size: 13px;
          color: #585858;
        }
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    width: 800px;
    overflow: hidden;
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    width: 755px;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      &:last-of-type {
        color: #26BCF9;
        margin-left: 30px;
      }
    }
  }
}
</style>
