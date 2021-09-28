<template>
  <section class="mp-feedback-page-main-wrap">
    <ListPageHeader :dataList='dataList' :condition='condition' @getDataList='getDataList'
     @clearCondition='clearCondition' @setCondition='setCondition' />
    <div>
      <el-table stripe border fit :data="dataList" style="width: 100%" class="ft-14-table" :max-height="h" :height="h">
        <el-table-column prop="Order.OrderID" label="订单号" minWidth="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Customer.Name" label="客户名称" minWidth="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Order.CustomerType" label="客户类型" minWidth="85" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品名称" prop="Order.ProductName" minWidth="150" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.Order.SecondLevelName+' - '+ scope.row.Order.ProductName}}</template>
        </el-table-column>
        <el-table-column prop="Order.Content" label="订单备注" minWidth="150" show-overflow-tooltip>
          <span class="is-gray" slot-scope="scope">{{scope.row.Order.Content}}</span>
        </el-table-column>
        <el-table-column label="售后原因" minWidth="130" show-overflow-tooltip>
          <template slot-scope="scope">{{getApplyText(scope.row.QuestionList)}}</template>
        </el-table-column>
        <el-table-column label="诉求意向" minWidth="80" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.AppealType | formatAppealType }}</template>
        </el-table-column>
        <el-table-column prop="Remark" label="问题备注" minWidth="240" show-overflow-tooltip>
          <span class="is-gray" slot-scope="scope">{{scope.row.Remark}}</span>
        </el-table-column>
        <el-table-column prop="Order.SellArea" label="销售区域" minWidth="145" show-overflow-tooltip></el-table-column>
        <el-table-column prop="Mobile" label="联系方式" minWidth="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="QQ" label="QQ号码" minWidth="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="申请时间" show-overflow-tooltip minWidth="125">
          <span class="is-gray" slot-scope="scope">{{ scope.row.CreateTime | format2MiddleLangTypeDate }}</span>
        </el-table-column>
        <el-table-column prop="Content" label="进度" show-overflow-tooltip minWidth="90">
          <div slot-scope="scope">
            <span :class="getStatusClass(scope.row.Status)">{{ scope.row.Status | formatFeedbackProgress }}
            </span>
          </div>
        </el-table-column>
        <el-table-column label="操作" width="115" show-overflow-tooltip>
          <div class="is-font-12 btn-wrap" slot-scope="scope">
            <span @click="onPhotoClick(scope.row)">
              <img src="@/assets/images/detail.png" alt />详情/处理
            </span>
          </div>
        </el-table-column>
      </el-table>
      <el-dialog
        :modal='false'
        title="售后申请详情"
        :visible.sync="feedbackDetailDialog"
        :close-on-press-escape='false'
        width="860px"
        top='6vh'
        v-dialogDrag
        class="mp-img-style-header feedback-detail-dialog"
        :before-close="handleFeedbackDetailDialogClose">
        <ul v-if="curItemData">
          <li>
            <p class="mp-common-title-wrap">客户信息</p>
            <ul>
              <li>
                <span class="title">客户名称：</span>
                <span class="text">{{curItemData.Customer.Name}}</span>
              </li>
              <li style="display: inline-block">
                <span class="title">联系方式：</span>
                <span class="text">{{curItemData.Mobile}}</span>
              </li>
              <li style="display: inline-block; margin-left: 160px">
                <span class="title">QQ号码：</span>
                <span class="text">{{curItemData.QQ}}</span>
              </li>
            </ul>
          </li>
          <li>
            <p class="mp-common-title-wrap">订单信息</p>
            <ul>
              <li>
                <span class="title">订单号：</span>
                <span class="text">{{curItemData.Order.OrderID}}</span>
              </li>
              <li>
                <span class="title">产品名称：</span>
                <span class="text">{{curItemData.Order.SecondLevelName + ' - ' + curItemData.Order.ProductName}}</span>
              </li>
              <li>
                <span class="title">订单备注：</span>
                <span class="text is-font-size-12 gray">{{curItemData.Order.Content}}</span>
              </li>
            </ul>
          </li>
          <li>
            <p class="mp-common-title-wrap">售后申请</p>
            <ul>
              <li>
                <span class="title">当前状态：</span>
                <span class="text" :class="getStatusClass(curItemData.Status)"
                >{{curItemData.Status | formatFeedbackProgress}}</span>
              </li>
              <li v-if="curItemData.RejectReason && curItemData.Status === 3">
                <span class="title">拒绝原由：</span>
                <span class="text is-font-size-12" :class="getStatusClass(curItemData.Status)"
                >{{curItemData.RejectReason}}</span>
              </li>
              <li>
                <span class="title">售后原因：</span>
                <span class="text">{{getApplyText(curItemData.QuestionList)}}</span>
              </li>
              <li>
                <span class="title">诉求意向：</span>
                <span class="text">{{ curItemData.AppealType | formatAppealType }}</span>
              </li>
              <li>
                <span class="title">问题描述：</span>
                <span class="text is-font-size-12 gray">{{curItemData.Remark}}</span>
              </li>
              <li class="img-box">
                <span class="title">凭证照片：</span>
                <div>
                  <el-image
                    v-for="url in curPicList"
                    :key="url"
                    :mpCloseViewer='()=>{}'
                    style="width: 130px; height: 130px"
                    :src="url"
                    fit='cover'
                    :preview-src-list="curPicList">
                  </el-image>
                  <span v-if="curPicList.length === 0">无</span>
                </div>
              </li>
              <li>
                <span class="title">申请时间：</span>
                <span class="text">{{curItemData.CreateTime | format2MiddleLangTypeDate}}</span>
              </li>
            </ul>
          </li>
          <li class="crtl">
            <p class="mp-common-title-wrap">操作处理：</p>
            <div>
              <span class="span-title-blue" @click="onMenuClick(curItemData.Order, 1)">查看订单</span>
              <span :class="curItemData.Status !== 0 ? 'disabled' : ''"
               class="span-title-blue" @click="onApplyStartClick(curItemData)">开始处理</span>
              <span :class="curItemData.Status === 0 || curItemData.Status === 1 ? '' : 'disabled'"
               class="span-title-blue" @click="handleOpenAfterSalesDia(curItemData)">执行售后</span>
              <span :class="curItemData.Status === 0 || curItemData.Status === 1 ? '' : 'disabled'"
               class="span-title-pink" @click="onTurnDownClick(curItemData)">驳回申请</span>
            </div>
          </li>
        </ul>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleFeedbackDetailDialogClose">关闭</el-button>
        </span>
      </el-dialog>
      <OrderListDialog />
      <ServiceDialog @handleItemStatusChange='handleItemStatusChange' key="mp-feedback-page" />
      <el-dialog
        title="驳回申请"
        :visible.sync="turnDownDialog"
        width="660px"
        :modal='false'
        top='22vh'
        v-dialogDrag
        class="mp-img-style-header turn-down-dialog"
        :before-close="handleTurnDownDialogClose">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="88px" class="demo-ruleForm">
          <el-form-item label="驳回原因:" prop="cause">
            <el-input type="textarea" v-model="ruleForm.cause" maxlength="200" show-word-limit></el-input>
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="handleTurnDownDialogClose">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- <ImgSwiperDialog /> -->
    </div>
    <footer>
      <Count
       :watchPage='condition.Page'
       :handlePageChange='handlePageChange'
       :count='dataNumber'
       :pageSize='20'
       />
    </footer>
  </section>
</template>

<script>
// import ImgSwiperDialog from '@/components/ServiceAfterSale/EditDialog/ImgSwiperDialog.vue';
import OrderListDialog from '@/components/order/Main/OrderListDialog.vue';
import mixin from '@/assets/js/mixins/OrderList&FeedbackCommonDialogMixins/index';
import ListPageHeader from '@/components/Feedback/ListPageHeader.vue';
import ClassType from '@/store/CommonClassType';
import Count from '@/components/common/Count.vue';
import tableMixin from '@/assets/js/mixins/tableHeightAutoMixin';
import recordScrollPositionMixin from '@/assets/js/mixins/recordScrollPositionMixin';

export default {
  name: 'FeedbackPage',
  components: {
    Count,
    OrderListDialog,
    ServiceDialog: () => import(/* webpackChunkName: "async" */ '@/components/order/DialogContent/ServiceDialog.vue'),
    // ImgSwiperDialog,
    ListPageHeader,
  },
  mixins: [mixin, tableMixin, recordScrollPositionMixin('.ft-14-table .el-table__body-wrapper')],
  data() {
    return {
      dataList: [],
      dataNumber: 0,
      // questionList: [],
      feedbackDetailDialog: false, // 照片弹窗开关
      curItemData: null,
      turnDownDialog: false,
      ruleForm: {
        cause: '',
      },
      h: 0,
      rules: {
        cause: [
          { required: true, message: '请输入驳回原因', trigger: 'blur' },
          { min: 3, max: 300, message: '长度在 3 到 300 个字符', trigger: 'blur' },
        ],
      },
      condition: {
        Page: 1,
        PageSize: 20,
        QuestionID: '',
        Status: '',
        Date: {
          First: '',
          Second: '',
        },
        DateType: 'today',
        KeyWords: '',
        CustomerType: {
          First: '',
          Second: '',
        },
      },
    };
  },
  computed: {
    curPicList() {
      if (!this.curItemData || this.curItemData.PicList.length === 0) return [];
      // eslint-disable-next-line max-len
      return this.curItemData.PicList.map(url => (process.env.NODE_ENV === 'development' ? `http://192.168.1.92:8055/${url}` : url));
    },
  },
  methods: {
    setHeight() {
      const tempHeight = this.getHeight('.mp-feedback-page-main-wrap-header-wrap', 60);
      this.h = tempHeight;
    },
    clearCondition() {
      this.condition = {
        Page: 1,
        PageSize: 20,
        QuestionID: '',
        Status: '',
        Date: {
          First: '',
          Second: '',
        },
        DateType: 'today',
        KeyWords: '',
        CustomerType: {
          First: '',
          Second: '',
        },
      };
    },
    handlePageChange(page) {
      this.getDataList(page);
    },
    setCondition([[key1, key2], value]) {
      if (key2) this.condition[key1][key2] = value;
      else this.condition[key1] = value;
    },
    async getDataList(page = 1) { // 获取列表数据
      this.condition.Page = page;
      ClassType.setDate(this.condition);
      const _obj = ClassType.filter(this.condition, true);
      if (_obj.Date) {
        _obj.ApplyTime = _obj.Date;
        delete _obj.Date;
      }
      let key = true;
      this.dataList = [];
      const res = await this.api.getAfterSalesApplyList(_obj).catch(() => { key = false; });
      if (key && res.data.Status === 1000) {
        this.dataList = res.data.Data;
        this.dataNumber = res.data.DataNumber;
      }
    },
    // async getQuestionList() { // 获取问题列表
    //   const res = await this.api.getApplyQuestionList();
    //   if (res && res.data.Status === 1000) this.questionList = res.data.Data;
    // },
    getStatusClass(status) {
      let str = '';
      switch (status) {
        case 1:
          str = 'is-cyan';
          break;
        case 2:
          str = 'is-success';
          break;
        case 3:
          str = 'is-pink';
          break;
        case 255:
          str = 'is-gray';
          break;
        default:
          break;
      }
      return str;
    },
    getApplyText(list) { // 获取售后原因
      const _arr = list.map(it => it.Title);
      return _arr.join('、');
    },
    handleFeedbackDetailDialogClose() { // 照片弹窗关闭
      // console.log('handleFeedbackDetailDialogClose');
      // this.curItemData = null;
      this.feedbackDetailDialog = false;
      this.resetForm('ruleForm');
    },
    handleTurnDownDialogClose(bool = false) {
      this.turnDownDialog = false;
      if (!this.ruleForm.cause || bool) this.resetForm('ruleForm');
    },
    onPhotoClick(itemData) {
      this.curItemData = itemData;
      this.feedbackDetailDialog = true;
    },
    handleOpenAfterSalesDia(data) {
      this.$router.push(`?AppyCode=${data.ID}`);
      this.jump2Service(data.Order);
      // eslint-disable-next-line max-len
      const urlList = data.PicList.map(url => (process.env.NODE_ENV === 'development' ? `http://192.168.1.92:8055/${url}` : url));
      this.$store.commit('service/reWriteUrlList4ServiceImgList', urlList);
    },
    onApplyStartClick() {
      this.messageBox.warnCancelBox('开始处理此申请吗?', '状态 [ 已提交 ] 将变更为 [ 处理中 ]', this.handleApplyStart);
    },
    async handleApplyStart() { // 开始处理
      const res = await this.api.getAfterSalesDealApply(this.curItemData.ID);
      if (res && res.data.Status === 1000) {
        this.messageBox.successSingle('开始处理成功!', this.handleItemStatusChange(1), this.handleItemStatusChange(1));
      }
    },
    onTurnDownClick() { // 驳回 - 打开弹窗
      this.turnDownDialog = true;
    },
    submitForm(formName) {
      if (!this.turnDownDialog) return;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.handleTurnDown();
        }
      });
    },
    resetForm(formName) {
      if (this.$refs[formName]) this.$refs[formName].resetFields();
    },
    async handleTurnDown() {
      const res = await this.api.getApplyReject({
        ApplyCode: this.curItemData.ID,
        ReasonContent: this.ruleForm.cause,
      });
      if (res.data.Status === 1000) {
        // 驳回成功 - 修改状态
        const handleFunc = () => {
          this.handleItemStatusChange(3);
          this.handleTurnDownDialogClose(true);
        };
        this.messageBox.successSingle('驳回成功', handleFunc, handleFunc);
      }
    },
    handleItemStatusChange(Status) {
      this.curItemData.Status = Status;
      const targetID = this.curItemData.ID;
      const t = this.dataList.find(it => it.ID === targetID);
      if (t) t.Status = Status;
      if (Status === 3 && this.ruleForm.cause) {
        this.curItemData.RejectReason = this.ruleForm.cause;
        if (t) t.RejectReason = this.ruleForm.cause;
      }
    },
  },
  mounted() {
    this.getDataList();
    // this.getQuestionList();
    if (this.$route.query.AppyCode) this.$router.push({ query: {} });
    this.$nextTick(() => this.setHeight());
    window.onresize = () => this.setHeight();
  },
  beforeDestroy() {
    window.onresize = null;
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-feedback-page-main-wrap {
  .el-table__header-wrapper thead tr th .cell {
    line-height: 36px;
    font-size: 14px;
  }
  .img-num-box {
    color: #428dfa;
    cursor: pointer;
    display: inline-block;
    min-width: 45px;
    border-radius: 3px;
    &:hover {
      text-decoration: underline;
      // background-color: #fff;
      font-weight: 700;
      font-size: 13px;
    }
  }
  .btn-wrap {
    display: flex;
    justify-content: space-around;
    padding: 0 10px;
    > span {
      > img {
        margin-right: 5px;
        vertical-align: -3px;
      }
      &:not(.disbaled) {
        color: #a2a2a2;
        transition: color 0.2s ease-in-out;
        cursor: pointer;
        &:hover {
          color: #444;
        }
      }
      &.disbaled {
        color: #cbcbcb;
      }
    }
  }
  .el-image-viewer__btn {
    color: #ddd;
  }
  .mp-el-del-btn {
    display: none;
  }
  .mp-img-style-header.feedback-detail-dialog {
    .el-dialog__header {
      > span::before {
        background: url(../assets/images/detail.png) no-repeat center;
      }
      border-radius: 2px 2px 0px 0
    }
    .el-dialog__body {
      padding-top: 20px;
      max-height: 660px;
      overflow: auto;
      padding-left: 30px;
      padding-bottom: 20px;
      margin-right: 6px;
      &::-webkit-scrollbar{
        width: 6px;
        height: 8px;
        // display: none;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 3px;
        &:hover {
          background-color: $--color-text-secondary;
        }
      }
      > ul {
        > li {
          margin-bottom: 15px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
          > p {
            margin-bottom: 12px;
          }
          > ul {
            > li {
              line-height: 20px;
              margin-bottom: 6px;
              > span {
                &.title {
                  width: 5em;
                  display: inline-block;
                  text-align: right;
                  color: #444;
                  font-weight: 700;
                  margin-right: 4px;
                }
                &.text {
                  color: #585858;
                  font-size: 13px;
                }
              }
              > div {
                // padding-top: 2px;
                // padding-bottom: 4px;
                > div {
                  margin-right: 12px;
                  overflow: hidden;
                  border-radius: 4px;
                }
              }
              &.img-box {
                display: flex;
                // margin-top: 4px;
              }
            }
          }
          > div {
            display: inline-block;
            padding-left: 36px;
            font-size: 13px;
            > span {
              margin-right: 24px;
              &:hover {
                text-decoration: underline;
              }
            }
          }
          &.crtl {
            margin: 0;
            padding-top: 12px;
            padding-bottom: 12px;
          }
        }
      }
    }
    .el-dialog__footer {
      padding-bottom: 35px;
      padding-top: 20px;
      > .dialog-footer {
        display: flex;
        justify-content: center;
        > button {
          margin: 0 15px;
          width: 120px;
          height: 30px;
          border-radius: 2px;
          padding: 0;
          color: #fff;
          background: linear-gradient(to right, #26bcf9, #35dff9);
          border: none;
          transition: opacity 0.2s ease-in-out;
          &:hover {
            opacity: 0.7;
          }
          &:active {
            opacity: 1;
          }
        }
      }
    }
  }
  .mp-img-style-header.turn-down-dialog {
    .el-dialog__header {
      > span::before {
        background: url(../assets/images/cancel.png) no-repeat center;
      }
      border-radius: 2px 2px 0px 0
    }
    .el-dialog__body {
      padding-right: 34px;
      .btn-box {
        padding-top: 20px;
        > .el-form-item__content {
          > button {
            width: 120px;
            height: 35px;
            padding: 0;
          }
        }
      }
      .el-textarea__inner {
        min-height: 88px !important;
      }
    }
  }
  > footer {
    padding-top: 8px;
  }
}
.RejectReason-tip-box {
  word-break: break-all;
  word-wrap: break-word;
}
</style>
