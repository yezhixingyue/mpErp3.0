<template>
  <section class="mp-erp-time-limit-set-page-wrap" v-if="TimeLimitData">
    <header>
      <span>当前产品：</span>
      <span>{{TimeLimitData.ProductClass.FirstLevelName}} - {{TimeLimitData.ProductClass.SecondLevelName}}</span>
    </header>
    <LimitSetContentComp :TimeLimitData="TimeLimitData" />
    <footer>
      <normal-btn-full @click.native="onSubmitTimeLimitDataClick" title="保存" />
      <normal-btn @click.native="onReturnClick(false)" title="返回" />
    </footer>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import LimitSetContentComp from '@/components/TimeLimitComps/Content/LimitSetContentComp.vue';

export default {
  components: {
    normalBtnFull,
    normalBtn,
    LimitSetContentComp,
  },
  computed: {
    ...mapState('timelimit', ['TimeLimitData', 'setPageType']),
    ...mapGetters('common', ['allProductClassify', 'subExpressList']),
    subExpressIDList() {
      if (!this.subExpressList || this.subExpressList.length === 0) return [];
      return this.subExpressList.map(it => it.ID);
    },
  },
  methods: {
    async onSubmitTimeLimitDataClick() {
      // console.log('onSubmitTimeLimitDataClick');
      const key = await this.$store.dispatch('timelimit/fetchProducePeriodSave', this.subExpressIDList);

      if (key) {
        const _func = () => {
          if (this.TimeLimitData) {
            let ProductString = '';
            const { ProductClass, ProductList, SchemaList } = this.TimeLimitData;
            const { FirstLevelID, SecondLevelID } = ProductClass;
            if (this.allProductClassify && this.allProductClassify.length > 0) {
              const t1 = this.allProductClassify.find(it1 => it1.ID === FirstLevelID);
              if (t1) {
                const t2 = t1.children.find(it2 => it2.ID === SecondLevelID);
                if (t2) {
                  const _list = t2.children;
                  const _arr = [];
                  if (ProductList.length === _list.length) ProductString = '全部产品';
                  else {
                    ProductList.forEach(it => {
                      const t3 = _list.find(it3 => it3.ID === it.ID);
                      if (t3) _arr.push(t3.ClassName);
                    });
                    ProductString = _arr.join('、');
                  }
                }
              }
            }
            this.$store.commit('timelimit/changeDataList', {
              ProductClass,
              ID: key,
              ProductString,
              RecordCount: SchemaList.length,
            });
            this.onReturnClick();
          } else {
            this.onReturnClick(true);
          }
        };
        const _title = this.setPageType === 'edit' ? '编辑成功' : '添加成功';
        this.messageBox.successSingle(_title, () => _func(), () => _func());
      }
    },
    onReturnClick(key = false) {
      if (key) this.$router.replace('/timeLimitList'); // 需要拉取数据
      else {
        this.$router.replace({ path: '/timeLimitList', query: { notNeedFetch: true } }); // 不需要拉取数据
      }
    },
  },
  mounted() {
    if (!this.TimeLimitData) this.$router.replace('/timeLimitList');
  },
};
</script>

<style lang='scss'>
.mp-erp-time-limit-set-page-wrap {
  font-size: 14px;
  padding: 18px 20px;
  box-sizing: border-box;
  width: 1720px;
  width: 100%;
  overflow: auto;
  flex: 0 0 auto;
  padding-bottom: 5px;
  > header {
    font-size: 15px;
    color: #21cae3;
    font-weight: 700;
    margin-bottom: 25px;
  }
  > article {
    min-height: calc(100vh - 60px - 60px - 100px);
    width: 100%;
    // overflow: auto;
  }
  > footer {
    height: 60px;
    padding: 30px;
    padding-bottom: 0px;
    text-align: center;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    > button {
      margin: 0 20px;
      height: 30px;
      width: 120px;
      border-radius: 2px;
      &:first-of-type {
        background: linear-gradient(to right, #26bcf9, #35dff9);
        border: none;
      }
    }
  }
}
</style>
