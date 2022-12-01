/* eslint-disable max-len */
import { mapMutations, mapActions } from 'vuex';

export default {
  data() {
    return {
      beginTime: '',
      endTime: '',
      begin: '',
      end: '',
      key: false,
      visible: false,
    };
  },
  methods: {
    ...mapMutations('orderModule', ['setCurOrderID', 'setCurOrderStatus', 'setCurOrderProductName', 'setOrderListDialogShow', 'setOrderListDialogHide', 'setIsShowServiceDiaTrue', 'setIsShowServiceDiaFail']),
    ...mapMutations('common', ['setIsLoading']),
    ...mapActions('orderModule', ['selectOrderProgress', 'getOrderDetail', 'getServiceOrderHistory']),
    ...mapActions('orderModule', { getPackageListByOrderID2OrderModule: 'getPackageListByOrderID' }),
    ...mapMutations('service', ['clearServiceFormInfo']),
    ...mapActions('service', ['getQuestionTypeList', 'getPackageListByOrderID']),
    handleCatchError(error) { // 处理tab弹窗点击与切换catch错误信息
      this.messageBox.handleLoadingError(
        error,
        () => { this.setOrderListDialogHide(); this.setIsLoading(false); },
        () => { this.setOrderListDialogHide(); this.setIsLoading(false); },
      );
    },
    async onMenuClick(data, id) {
      let str = '';
      let key = true;
      this.setIsLoading(true);
      this.setCurOrderID(data.OrderID);
      this.setCurOrderStatus(data.Status);
      this.setCurOrderProductName(data.ProductName);
      switch (id) {
        case 0:
          str = 'third';
          this.setOrderListDialogShow(str);
          await this.selectOrderProgress().catch((error) => {
            key = false;
            this.handleCatchError(error);
          });
          break;
        case 1:
          str = 'first';
          this.setOrderListDialogShow(str);
          await this.getOrderDetailSelf().catch((error) => {
            key = false;
            this.handleCatchError(error);
          });
          break;
        case 2:
          str = 'second';
          this.setOrderListDialogShow(str);
          await this.getPackageListByOrderID2OrderModule().catch((error) => {
            key = false;
            this.handleCatchError(error);
          });
          break;
        default:
          break;
      }
      if (key) this.setIsLoading(false);
    },
    async getOrderDetailSelf() {
      await this.getOrderDetail();
    },
    // async jump2Service(data) {
    //   let key = true;
    //   this.setIsLoading(true);
    //   this.clearServiceFormInfo();
    //   this.setCurOrderID(data.OrderID);
    //   this.setIsShowServiceDiaTrue();
    //   await Promise.all(
    //     [
    //       this.getQuestionTypeList(),
    //       this.getOrderDetailSelf(),
    //       this.getPackageListByOrderID(data.OrderID),
    //       this.getServiceOrderHistory(),
    //       this.$store.dispatch('service/getPayPackageByOrder', data.OrderID),
    //     ],
    //   ).catch((error) => {
    //     key = false;
    //     this.messageBox.handleLoadingError(
    //       error,
    //       () => { this.setIsShowServiceDiaFail(); this.setIsLoading(false); },
    //       () => { this.setIsShowServiceDiaFail(); this.setIsLoading(false); },
    //     );
    //   });
    //   if (key) this.setIsLoading(false);
    // },
  },
};
