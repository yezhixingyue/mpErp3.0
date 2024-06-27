<template>
  <section class="on-behalf-of-consumer-after-sales">
    <header>
      <BreadcrumbNav backLabel="订单列表" label="售后"></BreadcrumbNav>
    </header>
    <main>
      <div class="left">
        <div class="top">
          <OrderDetailsComp/>
          <div class="after-sales-trouble">
            <header class="title is-bold">问题图片</header>
            <ul>
              <li>
                <span class="label is-bold">售后问题：</span>
                <span class="value">
                  <el-checkbox-group v-model="checkList">
                    <el-checkbox label="复选框 A"></el-checkbox>
                    <el-checkbox label="复选框 B"></el-checkbox>
                    <el-checkbox label="复选框 C"></el-checkbox>
                  </el-checkbox-group>
                </span>
              </li>
              <li>
                <span class="label is-bold">图片凭证：</span>
                <span class="value">后宫编号重复，客户4月28日摇号，同时出现两次重复奖项，客户要求赔偿礼品损失</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <AfterSalesSolutionFromComp/>
      <SuspendDialogComp :visible="SuspendVisible" @cloce="SuspendVisible = false" @submit="SuspendVisible = false"></SuspendDialogComp>
    </main>
    <footer>
      <el-button @click="onGoBackClick" class="linear-bg-color">返回</el-button>
      <el-button @click="SuspendClick">guaqi</el-button>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import OrderDetailsComp from '@/components/AfterSalesComps/OrderDetailsComp.vue';
import AfterSalesSolutionFromComp from '@/components/AfterSalesComps/AfterSalesSolutionFromComp.vue';
import BreadcrumbNav from '@/components/AfterSalesComps/BreadcrumbNav.vue';
import SuspendDialogComp from '@/components/AfterSalesComps/SuspendDialogComp.vue';

export default {
  name: 'AfterSalesInfoPage',
  components: {
    OrderDetailsComp,
    AfterSalesSolutionFromComp,
    BreadcrumbNav,
    SuspendDialogComp,
  },
  data() {
    return {
      nowDate: null,
      SuspendVisible: false,
    };
  },
  computed: {
    ...mapState('common', ['Permission', 'ServerApplyTypeList']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionAfterSalesApply?.Obj) {
        return this.Permission.PermissionList.PermissionAfterSalesApply.Obj;
      }
      return {};
    },
  },
  methods: {
    onGoBackClick() {
      this.$goback();
    },
    SuspendClick() {
      this.SuspendVisible = true;
    },
  },
  mounted() {
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.on-behalf-of-consumer-after-sales{
  overflow-x: auto;
  height: 100%;
  padding-left: 20px;
  >header{
    margin-top: 20px;
  }
  >main{
    display: flex;
    >.left{
      display: flex;
      flex-direction: column;
      >.top{
        display: flex;
        .after-sales-trouble {
          padding-left: 20px;
          width: 453px;
          box-sizing: border-box;
          padding-right: 32px;
          >.title{
            font-size: 16px;
            line-height: 20px;
            margin-top: 10px;
            position: relative;
            margin-bottom: 20px;
            &::before{
              content: "";
              display: inline-block;
              height: 14px;
              width: 3px;
              position: absolute;
              left: -8px;
              top: 3px;
              background: linear-gradient( 180deg, #32DAF9 0%, #28C1F9 100%);
            }
          }
          >ul{
            li{
              display: flex;
              font-size: 12px;
              margin-top: 10px;
              line-height: 15px;
              >.value{
                flex: 1;
              }
            }
          }
        }
      }
    }
  }
  >footer{
    padding: 60px 0 20px 0;
    text-align: center;
    .el-button{
      width: 120px;
      height: 35px;
      padding: 0;
      color: #fff;
      background: linear-gradient( 226deg, #34DEF9 0%, #26BCF9 100%);
      border: none;
      & + .el-button{
        background: #fff;
        margin-left: 30px;
        color: #26BCF9;
        border: 1px solid #26BCF9;
      }
    }
  }
}
</style>
