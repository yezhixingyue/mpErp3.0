<template>
  <div class="order-list-dialog-orderdetail-wrap" :class="{onlyDetail}">
    <template v-if="showData">
      <div class="orderdetail-left is-shadow">
        <header class="bottom-line">
          <i>
            <img src="@/assets/images/product.png" alt />
          </i>
          <span>产品信息</span>
        </header>
        <article class="product-content">
          <section class="product-header">
            <OrderDetailDisplayItem :ShowData='ProductShowData' :hiddenFactory="hiddenFactory" />
          </section>
          <section class="unit">  <!-- 部件信息 -->
            <OrderDetailDisplayItem v-for="(it, i) in PartShowDataList" :ShowData='it' :key="it.Name" :class="{border: i > 0}" :showBorder='i > 0' />
          </section>
        </article>
        <footer v-if="!isCalculate && !onlyDetail">
          <!-- <ul>
            <li>
              <span>原价：</span>
              <el-tooltip :content="`原价：${showData.Funds.OriginalPrice}元`" placement="top">
                <span>{{showData.Funds.OriginalPrice}}元</span>
              </el-tooltip>
            </li>
            <li>
              <span class="em4-text">成交价：</span>
              <el-tooltip :content="`成交价：${showData.Funds.FinalPrice}元`" placement="top">
                <span class="is-origin is-bold">{{showData.Funds.FinalPrice}}元</span>
              </el-tooltip>
            </li>
            <li v-if="showData.Funds.CouponAmount > 0">
              <span>优惠券：</span>
              <el-tooltip :content="`优惠券：-${showData.Funds.CouponAmount}元`" placement="top">
                <span class="is-pink">-{{showData.Funds.CouponAmount}}元
                </span>
              </el-tooltip>
            </li>
            <li>
              <span>已付：</span>
              <el-tooltip :content="`已付：${showData.Funds.HavePaid}元`" placement="top">
                <span>{{showData.Funds.HavePaid}}元</span>
              </el-tooltip>
              <span class="remark" v-if="showData.Funds.PaidBeanAmount && showData.Funds.PaidBeanAmount > 0">
                （ <i>印豆抵扣{{showData.Funds.PaidBeanAmount}}元</i> ）
              </span>
            </li>
            <li class="text-left">
              <span>未付：</span>
              <el-tooltip :content="`未付：${showData.Funds.Unpaid}元`" placement="top">
                <span class="is-red">{{showData.Funds.Unpaid}}元</span>
              </el-tooltip>
            </li>
            <li>
              <span class="em4-text">退款：</span>
              <el-tooltip :content="`退款：${showData.Funds.Refund}元`" placement="top">
                <span>{{showData.Funds.Refund}}元</span>
              </el-tooltip>
            </li>
            <li v-if="showData.Funds.Reduced > 0">
              <span class="em4-text">售后优惠：</span>
              <el-tooltip :content="`售后优惠：${showData.Funds.Reduced}元`" placement="top">
                <span>{{showData.Funds.Reduced}}元</span>
              </el-tooltip>
            </li>
          </ul> -->
          <OrderDetailPriceBox :OrderData='showData' />
        </footer>
      </div>
      <ul class="orderdetail-right" v-if="!onlyDetail">
        <li class="customer-info is-shadow">
          <header class="bottom-line">
            <i>
              <img src="@/assets/images/customer.png" alt />
            </i>
            <span>客户信息</span>
          </header>
          <article class="customer-content mp-scroll-wrap">
            <section>
              <ul>
                <li>
                  <span class="text-title">客户编号：</span>
                  <span class="text md-font">{{showData.Customer.CustomerSN}}</span>
                </li>
                <li>
                  <span class="text-title">客户名称：</span>
                  <el-tooltip effect="dark"
                        :disabled="showData.Customer.CustomerName.length < 12"
                        :content="showData.Customer.CustomerName" placement="top-end">
                        <span class="text md-font">{{showData.Customer.CustomerName}}</span>
                      </el-tooltip>
                </li>
                <template v-if="!isCalculate">
                  <li v-if="showData.Customer.SellArea">
                    <span class="text-title">销售区域：</span>
                    <span class="text">{{showData.Customer.SellArea.RegionalName}}</span>
                  </li>
                </template>
                <template v-else>
                  <li>
                    <span class="text-title">分类等级：</span>
                    <span class="text">{{GradeContent}}</span>
                  </li>
                </template>
              </ul>
            </section>
            <section>
              <ul>
                <template v-if="showData.Address && !isCalculate">
                  <li v-if="showData.Address && showData.Address.ExpressText">
                    <span class="text-title">配送方式：</span>
                    <span class="text">{{showData.Address.ExpressText}}
                    </span>
                  </li>
                  <li>
                    <span class="text-title special-title">收件人：</span>
                    <span class="text">{{showData.Address.Address.Consignee}}</span>
                    <span class="text">{{showData.Address.Address.Mobile}}</span>
                  </li>
                  <li class="right-flex-wrap">
                    <span class="text-title">收件地址：</span>
                    <span class="text">{{getAddress(showData.Address.Address)}}</span>
                  </li>
                </template>
                <template v-if="isCalculate">
                  <li>
                    <span class="text-title">联系电话：</span>
                    <span class="text">{{showData.Customer.Mobile}}</span>
                  </li>
                  <li>
                    <span class="text-title" style="width:5em;display:inline-block">联系QQ：</span>
                    <span class="text">{{showData.Customer.QQ || '无'}}</span>
                  </li>
                </template>
              </ul>
            </section>
          </article>
        </li>
        <li class="order-info is-shadow">
          <header class="bottom-line">
            <i>
              <img src="@/assets/images/order.png" alt />
            </i>
            <span>订单信息</span>
          </header>
          <div class="order-content mp-scroll-wrap">
            <section>
              <ul>
                <template v-if="!isCalculate">
                  <li>
                    <span class="text-title">订单编号：</span>
                    <span class="text">{{showData.OrderID}}</span>
                  </li>
                  <li v-if="showData.OutPlate && showData.OutPlate.Second">
                    <span class="text-title">电商单号：</span>
                    <span class="text">{{showData.OutPlate.Second}}</span>
                  </li>
                  <li>
                    <!-- 待付款 is-red   已完成 is-completed   其它 is-origin -->
                    <span class="text-title">订单状态：</span>
                    <span
                      class="text"
                      style="display: inline-block;min-width: 72px;"
                      :class="{
                      'is-red':showData.Status===10,
                      'is-completed':showData.Status===200,
                      'is-origin':showData.Status!==10&&showData.Status!==200,
                    }"
                    >{{showData.Status | formatStatus}}</span>
                    <span class="blue-span is-font-size-12 ml-13" v-if="showProdProgress" @click="onProdProgressClick">查看工厂进度</span>
                    <el-tooltip
                    class="item"
                    effect="dark"
                    :content="showData.FileErrorMessage"
                    placement="top-start"
                    >
                      <span
                        class="is-gray is-font-size-12"
                        v-if="$route.name === 'orderManage'
                          && showData.FileErrorMessage
                          && showData.Status===35"
                        > ({{showData.FileErrorMessage}})</span>
                    </el-tooltip>
                  </li>
                  <li v-if="showData.Weight">
                    <span class="text-title">理论重量：</span>
                    <span class="text">{{showData.Weight}} 千克</span>
                  </li>
                  <li class="right-flex-wrap" v-if="showData.Remark">
                    <span class="text-title">订单备注：</span>
                    <span class="text">{{showData.Remark}}</span>
                  </li>
                  <li
                  class="right-flex-wrap download-box"
                  v-if="showDownload && (showData.FilePath || showData.CheckedFileList?.length > 0)
                   && !showData.ProductParams.Attributes.IsSpotGoods && localPermission.DownloadFile">
                    <span class="text-title">文件下载：</span>
                    <a v-if="showData.FilePath" :href="showData.FilePath" target="_blank" class="link download">下载订单文件</a>
                    <a v-if="showData.CheckedFileList?.length > 0" @click.prevent="onCheckFileDownloadClick(showData.CheckedFileList)"
                       class="link download">下载审稿文件</a>
                  </li>
                  <li class="btn-box" v-if="showData.Status===35 && $route.name === 'orderManage'" :class="{hiddenFileUpload: !showData.FileCase}">
                    <!-- <UploadComp4BreakPoint title="重新上传文件再审稿" :successFunc="successFunc"
                     v-if="showData.FileCase" :CustomerID='showData.Customer.CustomerID' /> -->
                    <div class="ft-12" v-if="showData.FileCase" @click="onAnewUploadClick">解决审稿问题</div>
                    <el-button type="primary" @click="handleReview" :disabled="resumeQuestionDisable">
                      <!-- {{showData.FileCase ? '文件没问题' : '该订单无文件'}} -->
                      没问题,重新审稿</el-button>
                  </li>
                  <li class="right-flex-wrap file-content-wrap">
                    <span class="text-title">文件内容：</span>
                    <span class="text">{{showData.Content || '无'}}</span>
                  </li>
                  <li v-if="showData.FileAuthorMobile && showData.FileAuthorMobile.trim()">
                    <span class="text-title">传稿人电话：</span>
                    <span class="text">{{showData.FileAuthorMobile.trim()}}</span>
                  </li>
                  <li>
                    <span class="text-title special-title">下单方式：</span>
                    <span class="text">
                      <i>{{showData.OrderType | formatOrderTypeToText}}</i>
                      <i class="is-gray" v-if="showData.OrderTaker">（ {{showData.OrderTaker.Value}} ）</i>
                    </span>
                  </li>
                  <li>
                    <span class="text-title">下单时间：</span>
                    <span class="text is-gray">{{getDayDate(showData.CreateTime)}}</span>
                    <span class="text is-gray">{{getMiDate(showData.CreateTime)}}</span>
                  </li>
                  <li v-if='showData.PayTime'>
                    <span class="text-title">付款时间：</span>
                    <span class="text is-gray">{{getDayDate(showData.PayTime)}}</span>
                    <span class="text is-gray">{{getMiDate(showData.PayTime)}}</span>
                  </li>
                  <li v-if='showData.ProducePeriod && showData.ProducePeriod.LatestPayTime && showData.Status === 10'>
                    <span class="text-title">最晚付款：</span>
                    <span class="text is-pink">{{getDayDate(showData.ProducePeriod.LatestPayTime)}}</span>
                    <span class="text is-pink">{{getMiDate(showData.ProducePeriod.LatestPayTime)}}</span>
                  </li>
                  <template v-if="[254, 255].indexOf(showData.Status) === -1">
                    <li v-if="showData.ProducePeriod && showData.ProducePeriod.TotalTime">
                      <span class="text-title">{{showData.ProducePeriod.IncludeDiliveryTime ? '预计送达：' : '预计发货：'}}</span>
                      <span class="text is-gray">{{getDayDate(showData.ProducePeriod.TotalTime)}}</span>
                      <!-- <span class="text is-gray">{{getMiDate(showData.ProducePeriod.TotalTime)}}</span> -->
                    </li>
                  </template>
                </template>
                <template v-else>
                  <li>
                    <span class="text-title">原价：</span>
                    <span class="text is-font-size-13">{{showData.Funds.OriginalPrice}}元</span>
                  </li>
                  <li>
                    <span class="text-title">成交价：</span>
                    <span class="text is-origin is-font-size-13">{{showData.Funds.FinalPrice}}元</span>
                  </li>
                  <li>
                    <span class="text-title">报价方式：</span>
                    <span class="text is-font-size-13">{{this.showData.Terminal | formatTerminalType}}</span>
                  </li>
                  <li>
                    <span class="text-title">报价时间：</span>
                    <span class="text is-gray">{{getDayDate(showData.CreateTime)}}</span>
                    <span class="text is-gray">{{getMiDate(showData.CreateTime)}}</span>
                  </li>
                </template>
              </ul>
            </section>
          </div>
        </li>
      </ul>
    </template>
    <template v-else>
      <p class="not-have-info">暂无数据</p>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
// import normalBtn from '@/components/common/normalBtn.vue';
// import UploadComp4BreakPoint from '@/components/common/UploadComp/UploadComp4BreakPoint.vue';
import ShowProductDetail from '@/assets/js/TypeClass/ShowProductDetail';
import OrderDetailDisplayItem from '@/packages/OrderDetailDisplayItem';
import OrderDetailPriceBox from '@/packages/OrderDetailPriceBox';

export default {
  props: {
    detailData: {
      default: null,
      type: Object,
    },
    isCalculate: {
      default: false,
      type: Boolean,
    },
    showDownload: {
      type: Boolean,
      default: false,
    },
    onlyDetail: {
      type: Boolean,
      default: false,
    },
    hiddenFactory: {
      type: Boolean,
      default: false,
    },
    CertificateList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState('orderModule', ['orderDetailData', 'OrderStatusList', 'orderListData']),
    ...mapState('common', ['userTypeList', 'userRankList', 'Permission']),
    localPermission() {
      if (this.Permission?.PermissionList?.PermissionManageOrder?.Obj) {
        return this.Permission.PermissionList.PermissionManageOrder.Obj;
      }
      return {};
    },
    showData() {
      if (this.detailData) return this.detailData;
      return this.orderDetailData;
    },
    ProductShowData() {
      let Name = this.showData?.ProductParams?.Attributes?.DisplayName || '产品名称';
      const FactoryName = this.showData?.ProductParams?.Attributes?.FactoryName || '';
      if (Array.isArray(this.showData?.ProductParams?.Attributes?.ClassList)) {
        const t = this.showData.ProductParams.Attributes.ClassList.find(it => it.Type === 1);
        if (t && t.SecondLevel?.Name) {
          Name = `${t.SecondLevel.Name}-${Name}`;
        }
      }
      if (this.showData?.ProductParams?.Attributes?.DisplayOrderList && this.showData.ProductParams.Attributes.DisplayOrderList.length > 0) {
        return {
          Name,
          FactoryName,
          ContentList: this.getPartShowList(this.showData.ProductParams.Attributes.DisplayOrderList, this.showData.ProductParams),
          Type: 'product',
        };
      }
      return {
        Name,
        FactoryName,
        ContentList: [],
        Type: 'product',
      };
    },
    PartList() {
      if (!this.showData) return [];
      if (!this.showData.ProductParams) return [];
      return this.showData.ProductParams.PartList;
    },
    PartShowDataList() {
      const arr = [];
      this.PartList.forEach(it => {
        if (Array.isArray(it.List)) {
          it.List.forEach((part, index) => {
            const ContentList = this.getPartShowList(it.Attributes.DisplayOrderList, part);
            const Name = it.List.length > 1 ? `${it.Attributes.Name}${index + 1}` : it.Attributes.Name;
            const temp = {
              Name,
              Type: 'Part',
              ContentList: ContentList || [],
            };
            arr.push(temp);
          });
        }
      });
      return arr;
    },
    GradeContent() {
      if (this.isCalculate && this.showData.Customer) {
        const { Grade, Type } = this.showData.Customer;
        const t1 = this.userRankList.find(it => it.CategoryID === Grade.First);
        const t2 = this.userTypeList.find(it => it.CategoryID === Type.First);
        if (t1 || t2) {
          const c1 = t1 ? `${t1.CategoryName}` : '';
          const c2 = t2 ? `${t2.CategoryName}` : '';
          return [c1, c2].filter(it => it).join('-');
        }
      }
      return '';
    },
    showProdProgress() {
      if (this.$route.name === 'orderManage' && this.OrderStatusList.filter(it => it.canProdProgress).map(it => it.ID).includes(this.showData.Status)) {
        const row = this.orderListData.find(it => it.OrderID === this.showData.OrderID);
        // console.log('showProdProgress', row);
        return row?.IsOwnFactory;
      }
      return false;
    },
    resumeQuestionDisable() {
      // if (this.showData && this.CertificateList.length > 0 && this.showData.CertificateFileList && this.showData.CertificateFileList.length > 0) {
      //  const [id] = this.showData.CertificateFileList;
      //  const t = this.CertificateList.find(it => it.CertificateID === id);

      //  return !t || t.CheckStatus === 2;
      // }

      return false;
    },
  },
  components: {
    // normalBtn,
    // UploadComp4BreakPoint,
    OrderDetailDisplayItem,
    OrderDetailPriceBox,
  },
  methods: {
    getAddress(Address) {
      const { RegionalName, CityName, CountyName } = Address.ExpressArea;
      const { AddressDetail } = Address;
      return `${RegionalName}${CityName}${CountyName}${AddressDetail}`;
    },
    getDayDate(time) {
      if (!time) return '';
      return time.split('.')[0].split('T')[0];
    },
    getMiDate(time) {
      if (!time) return '';
      return time.split('.')[0].split('T')[1];
    },
    filterGroupList(PropertyGroupList) { // 处理属性组列表信息
      const list = [];
      for (let i = 0; i < PropertyGroupList.length; i += 1) {
        const item = PropertyGroupList[i];
        if (!item.GroupName || !item.GroupID) return;
        const obj = {};
        obj.Name = item.GroupName;
        obj.ID = item.GroupID;
        obj.Value = [];
        item.PropertyList.forEach((Property) => {
          const tempArr = [];
          Property.Second.forEach((sub) => {
            if (sub.ShowValue) tempArr.push(`${sub.PropertyName} : ${sub.ShowValue}${sub.ShowUnit}`);
          });
          obj.Value.push(tempArr);
        });
        list.push(obj);
      }
      // eslint-disable-next-line consistent-return
      return list.filter((item) => item.Value.length > 0);
    },
    async handleReview() { // 不传文件重新提交审稿
      let Certificate;
      if (this.showData.CertificateFileList && this.showData.CertificateFileList.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        Certificate = this.showData.CertificateFileList[0];
      }
      this.messageBox.warnCancelBox(
        '确认该问题件订单没问题吗?',
        '[ 未做更改，审稿人员将重新审核当前订单 ]',
        () => this.$store.dispatch('orderModule/setOrderReCheckFile', { Certificate }),
      );
    },
    successFunc(fileName) {
      this.$store.dispatch('orderModule/setOrderReCheckFile', fileName);
    },
    getPartShowList(DisplayOrderList, ProductParams) {
      return ShowProductDetail.getDisplayContentFromPartDataByDetailData(DisplayOrderList, ProductParams);
    },
    onProdProgressClick() { // 查看工厂进度
      this.$emit('prodProgress');
    },
    onAnewUploadClick() { // 重新上传文件再审稿
      this.$emit('anewUpload');
    },
    onCheckFileDownloadClick(CheckedFileList) {
      const _download = (href) => {
        if (!href) return;

        const link = document.createElement('a');

        link.target = '_blank';
        link.style.display = 'none';
        link.href = href;

        document.body.appendChild(link);

        link.click();
      };

      CheckedFileList.forEach(it => _download(it.FilePath));
    },
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.order-list-dialog-orderdetail-wrap {
  margin: 0 auto;
  width: 805px;
  height: 650px;
  box-sizing: border-box;
  margin-top: 25px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  text-align: left;

  .orderdetail-left {
    height: 100%;
    width: 480px;
    .product-content {
      height: 495px;
      padding: 20px;
      padding-bottom: 18px;
      margin-bottom: 5px;
      box-sizing: border-box;
      overflow-y: scroll;
      .unit {
        .unit-title {
          position: relative;
          padding-left: 11px;
          &::before {
            content: "";
            position: absolute;
            width: 6px;
            height: 6px;
            background-color: $--color-text-orgin;
            border-radius: 50%;
            top: calc(50% - 3px);
            left: 0;
          }
          &.margin-10 {
            margin-bottom: 12px;
          }
        }
        .size {
          > i:last-of-type {
            > em {
              display: none;
            }
          }
        }
      }

      &::-webkit-scrollbar {
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: $--border-color-base;
        border-radius: 4px;
        &:hover {
          background-color: $--color-text-secondary;
        }
      }
    }
    > footer {
      // height: 90px;
      // padding: 0px 20px;
      // padding-top: 8px;
      padding: 0 18px;
      box-sizing: border-box;
      // overflow: hidden;
      > ul {
        display: flex;
        // justify-content: space-between;
        flex-wrap: wrap;
        align-items: flex-start;
        > li {
          padding: 7px 0 3px 0;
          flex: 1;
          color: $--color-text-table;
          margin-right: 15px;
          &:last-of-type {
            width: auto;
            margin-right: 0;
          }
          .em4-text{
            // width: 4em;
            display: inline-block;
            text-align: left;
          }
          white-space: nowrap;
          text-align: left;
          &.text-left {
            text-align: left;
          }
          .remark {
            font-size: 12px;
            > i {
              color: #989898;
            }
          }
        }
      }
    }
  }

  .orderdetail-right {
    width: 305px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    > li {
      width: 100%;
      &.customer-info {
        height: 270px;
      }
      &.order-info {
        height: 360px;
      }
    }

    .customer-content {
      padding: 20px;
      height: 230px;
      box-sizing: border-box;
      overflow: auto;
      overflow: overlay;
      padding-bottom: 0px;
      section {
        &:first-of-type {
          margin-bottom: 26px;
        }
      }
      li {
        margin-bottom: 14px;
        &:last-of-type {
          margin-bottom: 0;
        }
        .text + .text {
          margin-left: 25px;
        }
      }
    }

    .order-content {
      padding: 20px;
      height: 320px;
      overflow: auto;
      overflow: overlay;
      box-sizing: border-box;
      section {
        > ul > li {
          margin-bottom: 15px;
          .text + .text {
            margin-left: 15px;
          }
          &:last-of-type {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  .not-have-info {
    text-align: center;
    width: 90%;
    padding-top: 50px;
    font-size: 12px;
  }

  // 公用样式
  header {
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    font-size: 14px;
    font-weight: 600;
    position: relative;
    color: $--color-text-primary;
    border-left: 1px solid $--color-primary;
    user-select: none;
    > i {
      display: inline-block;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: linear-gradient(
        to right,
        $--color-primary,
        $--color-primary-light
      );
      position: relative;
      vertical-align: -20%;
      margin-right: 12px;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .is-shadow {
    box-shadow: 0px 2px 8px #ddd;
  }
  .is-red {
    color: $--color-text-table-pending !important;
  }
  .is-origin {
    color: $--color-text-orgin !important;
  }
  .is-completed {
    color: $--color-text-table-completed !important;
  }
  .is-gray {
    color: $--color-text-table-time !important;
  }
  .md-font {
    font-size: 14px !important;
  }
  section {
    li,
    li dl > div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    li {
      // margin-bottom: 8px;
      .text-title {
        color: $--color-text-table-time;
        &.special-title {
          width: 5em;
          display: inline-block;
        }
      }
      .text {
        color: $--color-text-table;
        font-size: 12px;
      }
      .title {
        color: $--color-text-table;
        // font-weight: 600;
        > i {
          // font-size: 12px;
          font-weight: 600;
        }
      }
      .text + .text-title {
        margin-left: 30px;
      }
      > dl {
        display: flex;
        > div {
          dd {
            line-height: 14px;
            margin-bottom: 15px;
            white-space: normal;
            > .text {
              min-width: 3em;
              padding-right: 6px;
              display: inline-block;
              box-sizing: border-box;
            }
            > i {
              margin-left: -2px;
              color: $--color-text-table-time;
            }
          }
        }
      }
      div.property-wrap + div.property-wrap{
        margin-top: 10px;
      }
      &.right-flex-wrap {
        display: flex;
        white-space: normal;
        .text-title {
          flex: none;
        }
        .text {
          line-height: 20px;
          margin-top: -3px;
        }
        &.file-content-wrap{
          padding-bottom: 12px;
        }
        &.download-box {
          > button, .link {
            margin: 0;
            height: 16px;
            line-height: 13px;
            // display: inline-block;
            border: none;
            padding: 0;
            // padding-bottom: 10px;
            width: 6em;
            overflow: hidden;
            font-size: 12px;
            position: relative;
            text-align: center;
            left: 0;
            box-shadow: none;
            color: #26bcf9;
            text-decoration: none;
            cursor: pointer;
            // &::after {
            //   position: absolute;
            //   content: "";
            //   width: 0%;
            //   height: 1px;
            //   left: 50%;
            //   transform: translateX(-50%);
            //   bottom: 0;
            //   background-color: $--color-primary-light;
            //   transition: width 0.3s;
            // }
            &:hover {
              color: $--color-primary-light;
              font-size: 12px !important;
              text-decoration: underline;
            }

            & + .link {
              margin-left: 12px
            }
          }
        }
      }
      &.btn-box {
        margin-right: -12px;
        margin-top: 20px;
        overflow: unset;
        > button {
          padding: 6px 10px 7px 14px;
          border-radius: 2px;
          font-size: 12px;
          border: none;
          background-color: #fff;
          color: #428dfa;
          transition: color 0.2s;
          &:hover {
            color: #35dff9;
          }
          &:active {
            color: #009EF9;
          }
          &.is-disabled {
            background-color: #fff;
            color: #cbcbcb;
          }
        }
        > div {
          margin-top: 0;
          margin-right: 13px;
          width: 9em;
          display: inline-block;
          padding: 0 9px;
          background-color: #fff;
          border: 1px solid;
          cursor: pointer;
          user-select: none;
          color: #428dfa !important;
          border-color: #428dfa !important;
          border-radius: 6px;
          height: 30px;
          line-height: 28px;
          transition:  0.2s;
          position: relative;
          text-align: center;
          &:hover {
            color: #35dff9!important;
            border-color: #35dff9 !important;
          }
          &:active {
            background-color: rgba($color: #35dff9, $alpha: 0.15);
          }
          &::after {
            position: absolute;
            content: '';
            height: 36px;
            width: 1px;
            background-color: #eee;
            right: -15px;
            top: -3px;
          }
        }
        position: relative;
        &::after {
          position: absolute;
          content: '';
          height: 1px;
          width: 280px;
          background-color: #eee;
          bottom: -17px;
          left: -3px;
          width: 100%;
        }
        margin-bottom: 35px !important;
      }
    }

    &.unit > ul > li > .sub-part-wrap,
    &.product-header {
      margin-bottom: 12px;
      position: relative;
      padding-bottom: 1px;
      .text.is-bold {
        font-size: 14px;
      }
    }
    &.unit > ul > li {
      & + li {
        margin-bottom: 0;
      }
    }
  }

  li.makeup-box {
    > .makeup {
      margin-left: 17px;
    }
  }
  li.prop-list-wrap {
    margin-bottom: 0;
  }

  &.onlyDetail {
    width: 100%;
    height: auto;
    margin: 0;

    .orderdetail-left {
      width: 100%;
      box-shadow: none;

      > header {
        &::after {
          display: none;
        }
      }

      .product-content {
        height: auto;
      }
    }
  }
}
</style>
