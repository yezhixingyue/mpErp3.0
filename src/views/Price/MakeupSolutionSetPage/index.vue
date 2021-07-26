<template>
  <section class="mp-erp-price-module-makeup-solution-set-page-wrap">
    <header>
      <span>当前产品：</span>
      <span>{{ProductName}}</span>
      <span class="price-name">价格名称：{{Name}}</span>
    </header>
    <main>
      <p class="mp-common-title-wrap">拼版控制</p>
      <ul>
        <li v-for="it in MakeupControlTypeList" :key="it.ID">
          <span class="label">{{it.Name}}方案：</span>
          <span class="value"></span>
          <CtrlMenus :showList='["select"]' />
        </li>
      </ul>
    </main>
    <footer>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import CtrlMenus from '@/components/common/NewComps/CtrlMenus';

export default {
  name: 'MakeupSolutionSet',
  components: {
    CtrlMenus,
  },
  computed: {
    ...mapState('priceManage', ['curPriceItem', 'MakeupControlTypeList']),
  },
  data() {
    return {
      priceID: '',
      Name: '',
      ProductName: '',
      MakeupList: [],
    };
  },
  methods: {
    onGoBackClick() {
      this.$router.replace('/PriceManageList');
    },
  },
  mounted() {
    if (!this.curPriceItem) {
      this.$goback();
      return;
    }
    console.log('curPriceItem', this.curPriceItem);
    const { ID, MakeupList, Name } = this.curPriceItem;
    this.priceID = ID;
    this.MakeupList = MakeupList;
    this.Name = Name;
    this.ProductName = this.$route.params.name;
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
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    padding-left: 5px;
    &.loading {
      opacity: 0.2;
    }
    > .mp-common-title-wrap {
      color: #444;
      font-size: 15px;
      &::before {
        height: 15px;
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    flex: none;
    width: 1100px;
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
