<template>
  <header class="mp-coupon-deatail-list-header-comp-wrap">
    <section class="top"  v-if="objectInfo2CouponUseListPage">
        <div class="left">
            <div>
                <span>
                  <i class="is-pink is-thick-line">¥{{objectInfo2CouponUseListPage.Data.Amount}}</i>
                  满<i class="is-pink">{{objectInfo2CouponUseListPage.Data.MinPayAmount}}元</i>使用
                </span>
                <span v-if="productInfo2CouponUseListPage">
                  <i>限产品：</i>
                  <i class="is-thick-line">
                    <el-tooltip placement="top-start" :enterable='false' transition='none'>
                      <div slot="content">
                        <p v-for="(item, i) in productInfo2CouponUseListPage" :key="item + '-' + i">
                          {{ item }}
                        </p>
                      </div>
                      <span class="area-span">{{ productInfo2CouponUseListPage.join(' ') }}</span>
                    </el-tooltip>
                  </i>
                </span>
            </div>
            <ul>
                <li>
                    <div class="bg-color-box"></div>
                    <span class="is-thick-line"
                      >{{objectInfo2CouponUseListPage.Data.TotalNumber}}张</span>
                    <span>总数量</span>
                </li>
                <li>
                    <div class="bg-color-box"></div>
                    <span class="is-thick-line"
                      >{{objectInfo2CouponUseListPage.Data.GenerateNumber}}张</span>
                    <span>已生成</span>
                </li>
                <li>
                    <div class="bg-color-box"></div>
                    <span class="is-thick-line"
                      >{{objectInfo2CouponUseListPage.Data.TotalNumber
                         - objectInfo2CouponUseListPage.Data.GenerateNumber}}张</span>
                    <span>未生成</span>
                </li>
            </ul>
        </div>
        <ul class="right is-gray">
            <li>
                <span>有效期开始时间：{{
                  objectInfo2CouponUseListPage.ValidStartTime | format2MiddleLangTypeDate}}</span>
                <span>有效期结束时间：{{
                  objectInfo2CouponUseListPage.ValidEndTime | format2MiddleLangTypeDate}}</span>
            </li>
            <li>
                <span>开始发放时间：{{
                  objectInfo2CouponUseListPage.ProvideStartTime | format2MiddleLangTypeDate}}</span>
                <span>结束发放时间：{{
                  objectInfo2CouponUseListPage.ProvideEndTime | format2MiddleLangTypeDate}}</span>
            </li>
        </ul>
    </section>
    <section class="bottom">
        <div>
            <order-channel-selector
            label="状态"
            :options='CouponCodeStatusList'
            :requestFunc='getCouponUseList'
            :changePropsFunc='setCondition2CouponUseList'
            :typeList="[['Status', '']]"
            :value='condition2CouponUseList.Status'
            />
            <order-channel-selector
            label="生成方式"
            :options='CouponGenerateTypeList'
            :requestFunc='getCouponUseList'
            :changePropsFunc='setCondition2CouponUseList'
            :typeList="[['Channel', '']]"
            :value='condition2CouponUseList.Channel'
            />
        </div>
        <search-input-comp
          title="关键词"
          placeholder="请输入搜索关键词"
          :typeList="[['KeyWords', '']]"
          :requestFunc="getCouponUseList"
          :changePropsFunc="setCondition2CouponUseList"
          :word="condition2CouponUseList.KeyWords"
          @reset="clearCondition2CouponUseList"
          :searchWatchKey="searchWatchKey2CouponUseList"
         />
    </section>
  </header>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import OrderChannelSelector from '@/components/common/SelectorComps/OrderChannelSelector.vue';
import SearchInputComp from '@/components/common/SearchInputComp.vue';

export default {
  components: {
    OrderChannelSelector,
    SearchInputComp,
  },
  computed: {
    ...mapState('common', ['CouponCodeStatusList', 'CouponGenerateTypeList']),
    ...mapState('couponStore', ['condition2CouponUseList', 'searchWatchKey2CouponUseList', 'objectInfo2CouponUseListPage', 'productInfo2CouponUseListPage']),
  },
  methods: {
    ...mapMutations('couponStore', ['setCondition2CouponUseList', 'clearCondition2CouponUseList']),
    ...mapActions('couponStore', ['getCouponUseList']),
  },
  mounted() {
    if (!this.condition2CouponUseList.ID) {
      this.$router.replace('/couponList');
    }
  },
};
</script>

<style lang="scss">
@import "@/assets/css/var.scss";
.mp-coupon-deatail-list-header-comp-wrap {
  color: $--color-text-primary;
  > .top {
    width: 100%;
    border-bottom: 1px solid $--border-color-light;
    padding: 15px 0;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    > .left {
      border-right: 1px solid $--border-color-light;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      > div {
        display: flex;
        flex-direction: column;
        max-width: 380px;
        margin-left: 20px;
        > span {
          line-height: 24px;
          font-size: 14px;
          &:first-of-type {
            > i:first-of-type {
                font-size: 16px;
            }
          }
          &:last-of-type {
            font-size: 12px;
            display: flex;
            align-items: center;
            flex: none;
            > i {
              max-width: 332px;
              display: inline-block;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              flex: none;
            }
          }
        }
      }
      > ul {
        display: flex;
        margin-left: 30px;
        flex: none;
        > li {
          display: flex;
          flex-direction: column;
          min-width: 100px;
          padding-right: 45px;
          box-sizing: border-box;
          position: relative;
          padding-left: 35px;
          > span {
            font-size: 12px;
            text-align: right;
            line-height: 18px;
          }
          > .bg-color-box {
            position: absolute;
            width: 24px;
            height: 24px;
            background-color: rgba($--color-primary, 0.25);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            left: 0;
            top: calc(50% - 12px);
            &::after {
                content: '';
                width: 16px;
                height: 16px;
                background-color: $--color-primary;
                border-radius: 50%;
                display: block;
            }
          }
          &:nth-of-type(2) > .bg-color-box{
            background-color: rgba($--color-text-table-completed, 0.25);
            &::after {
              background-color: $--color-text-table-completed;
            }
          }
          &:nth-of-type(3) > .bg-color-box{
            background-color: rgba($--color-pink-ligth, 0.25);
            &::after {
              background-color: $--color-pink-ligth;
            }
          }
        }
      }
    }
    > .right {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 12px;
      min-width: 500px;
      flex: 1.15;
      > li {
        display: flex;
        flex-direction: column;
        height: 50px;
        line-height: 25px;
        margin-left: 20px;
      }
    }
  }
  > .bottom {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    > div {
      display: flex;
      > .mp-common-comps-order-channel-selector-wrap:first-of-type {
        > header {
            width: 3em;
            margin-left: 20px;
        }
        margin-right: 40px;
      }
    }
    > section {
      margin-right: 80px;
    }
  }
}
</style>
