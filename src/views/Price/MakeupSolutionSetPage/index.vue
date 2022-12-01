<template>
  <section class="mp-erp-price-module-makeup-solution-set-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="price-name">价格名称：{{Name}}</span>
    </header>
    <main>
      <p class="mp-common-title-wrap">拼版控制</p>
      <ul :class="{loading:isSolutionListLoading}">
        <li v-for="it in list" :key="it.Type">
          <span class="label">{{it.SolutionTypeName}}：</span>
          <span class="value" :class="it.unSetup ? 'un-setup' : ''">{{it.SolutionName}}</span>
          <CtrlMenus :showList='["select"]' @select="onSelectClick(it)" />
        </li>
      </ul>
      <SolutionSelectDialog :visible.sync='visible' :list='selectList' :initData="curSelectItem" @select="onSolutionSelect" />
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';
import SolutionSelectDialog from './Comps/SolutionSelectDialog.vue';

export default {
  name: 'MakeupSolutionSet',
  components: {
    CtrlMenus,
    SolutionSelectDialog,
  },
  computed: {
    ...mapState('priceManage', ['curPriceItem', 'MakeupControlTypeList']),
    list() {
      return this.MakeupList.map(it => {
        let SolutionName = '';
        let unSetup = true;
        if (!this.isSolutionListLoading) {
          SolutionName = '无';
          if (it.Solution && it.Solution.ID !== '') {
            unSetup = false;
            SolutionName = '未知方案（获取名称失败）';
            if (Array.isArray(this.solutionList)) {
              const t = this.solutionList.find(_it => _it.ID === it.Solution.ID);
              if (t) SolutionName = t.Name;
            }
          }
        }
        const targetType = this.MakeupControlTypeList.find(_it => _it.ID === it.Type);
        const SolutionTypeName = targetType ? `${targetType.Name}方案` : '未知方案类型';
        return { ...it, SolutionName, SolutionTypeName, unSetup };
      });
    },
    selectList() {
      if (!this.curSelectItem || !Array.isArray(this.solutionList)) return [];
      const list = this.solutionList.filter(it => it.Type === this.curSelectItem.Type);
      return [...list, { ID: '', Name: '无' }];
    },
  },
  data() {
    return {
      priceID: '',
      Name: '',
      ProductName: '',
      MakeupList: [],
      isSolutionListLoading: true,
      solutionList: [],
      visible: false,
      curSelectItem: null,
    };
  },
  methods: {
    onGoBackClick() {
      this.$router.replace('/PriceManageList');
    },
    async getMakeupSolutionList() { // 获取拼版方案列表数据
      const resp = await this.api.getMakeupSolutionList(this.$route.params.id).catch(() => {});
      this.isSolutionListLoading = false;
      if (resp && resp.data.Status === 1000) {
        this.solutionList = resp.data.Data;
      }
    },
    onSelectClick(item) {
      this.curSelectItem = item;
      this.visible = true;
    },
    onSolutionSelect(solutionID) {
      const { PriceID, Type } = this.curSelectItem;
      this.getMakeupControlSolutionSetup(PriceID, Type, solutionID);
    },
    async getMakeupControlSolutionSetup(PriceID, Type, solutionID) {
      const temp = { PriceID, Type, solutionID };
      const resp = await this.api.getMakeupControlSolutionSetup(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        const cb = () => {
          // 设置数据修改： 当前页 及 列表页
          const t = this.MakeupList.find(it => it.Type === Type && it.PriceID === PriceID);
          if (t) t.Solution = t.Solution ? { ...t.Solution, ID: solutionID } : { ID: solutionID };
          this.$store.commit('priceManage/setPriceItemMakeupSolutionChange', [this.$route.params.id, PriceID, Type, solutionID]);
          this.visible = false;
        };
        this.messageBox.successSingle('设置成功', cb, cb);
      }
    },
  },
  mounted() {
    if (!this.curPriceItem) {
      this.$goback();
      return;
    }
    const { ID, MakeupList, Name } = this.curPriceItem;
    this.priceID = ID;
    this.MakeupList = JSON.parse(JSON.stringify(MakeupList));
    this.Name = Name;
    this.ProductName = this.$route.params.name;
    this.getMakeupSolutionList();
  },
};
</script>
<style lang='scss'>
.mp-erp-price-module-makeup-solution-set-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 45px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 20px;
    line-height: 15px;
    box-sizing: border-box;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    .price-name {
      font-weight: 400;
      margin-left: 80px;
      font-size: 14px;
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    padding-left: 5px;
    > .mp-common-title-wrap {
      color: #444;
      font-size: 15px;
      &::before {
        height: 15px;
      }
    }
    &.loading {
      opacity: 0.2;
    }
    > ul {
      padding-top: 30px;
      width: 540px;
      > li {
        line-height: 20px;
        padding: 15px 40px 10px 50px;
        border-bottom: 1px solid #f5f5f5;
        font-size: 14px;
        color: #585858;
        display: flex;
        > div, > span {
          flex: 0 0 auto;
        }
        > .value {
          flex: 1 1 auto;
          padding-left: 20px;
          &.un-setup {
            font-size: 13px;
            color: #989898;
          }
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    width: 800px;
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
