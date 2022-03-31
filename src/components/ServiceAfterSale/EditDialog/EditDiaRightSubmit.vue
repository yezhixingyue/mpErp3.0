<template>
 <div class="mp-edit-dia-right-submit-wrap">
    <main>
        <section class="problem-box"> <!-- 问题选择 -->
            <header>
                <span class='problem-title'>问题：</span>
            </header>
            <ul class="mp-scroll-wrap question-list">
                <li v-for="(item, i) in submitQuestionList.length" :key="i">
                  <!-- 下拉问题列表1 -->
                  <DropDown :class="submitQuestionList[i].IDErr ? 'is-warn' : ''"
                   :list='questionList' title='请选择问题' :index='i'
                   :watchTarget='submitQuestionList[i].level1ID'
                   :default-props="{label:'Name', value:'ID'}"
                   @select='onLevel1Select'
                   class="level1-drop" />
                   <!-- 下拉问题列表2 -->
                   <DropDown :class="submitQuestionList[i].IDErr ? 'is-warn' : ''"
                   :list='getLevel2QuestionList(i)' :index='i'
                   :watchTarget='submitQuestionList[i].ID'
                   :disabled='!submitQuestionList[i].level1ID && submitQuestionList[i].level1ID !== 0'
                   :title="!submitQuestionList[i].level1ID && submitQuestionList[i].level1ID !== 0 ? '请先选择大类' : '请选择具体问题'"
                   :default-props="{label:'Name', value:'ID'}"
                   @select='onSelect'
                   class="level2-drop" />
                   <!-- <el-cascader
                      :value="submitQuestionList[i].ID"
                      @change="ID => onSelect([ID, '', i])"
                      :options="questionList"
                      :show-all-levels="false"
                      :props="{ expandTrigger: 'hover', label: 'Name', value: 'ID' }"
                      size="mini"
                    /> -->
                  <MpTextInput :handleInput='handleInput'
                   :class="submitQuestionList[i].RemarkErr ? 'is-warn' : ''"
                   :watchTarget='submitQuestionList[i].Remark' :index='i' />
                  <DropDown class="second-dropdown"
                    :class="{
                      'is-gray': !submitQuestionList[i].Department && submitQuestionList[i].Department !== 0,
                      'is-warn': submitQuestionList[i].DepartmentErr
                    }"
                   :list='departmentSelectList' title='责任部门' :index='i'
                   :watchTarget='submitQuestionList[i].Department'
                   @select='onDepartmentSelect' />  <!-- 责任部门列表 -->
                  <!-- <MpTextInput :handleInput='handleInputDepartment'
                   msg='责任部门'
                   class="inp-department"
                   :class="submitQuestionList[i].DepartmentErr ? 'is-warn' : ''"
                   :watchTarget='submitQuestionList[i].Department' :index='i' /> -->
                  <span class="icon-wrap" @click="addQuestion()">
                    <img src="@/assets/images/add.png" alt="">添加
                  </span>
                  <span class="icon-wrap" @click="delQuestion(i)">
                    <img src="@/assets/images/del.png" alt="">删除
                  </span>

                </li>
            </ul>
        </section>
        <section class="solution-box"> <!-- 解决方案 -->
            <span class='problem-title left'>解决方案：</span>
          <ul class="right">
            <li>
              <SingleRadio :handleSwitch='handleSwitch'
                :watchValue='isShowServiceDia' :list='selectList'  :defaultRadio=0 />
            </li>
            <li v-if="radioState === 1" class="mp-service-count-wrap">
              <div v-if="showKindCount">
                <span>款数：</span>
                <input :class="replenish.KindCountErr ? 'is-warn' : ''"
                  v-model="kingNum" @input="onKingCountInput" type="text">
                <span>款</span>
              </div>
              <div v-if="showNumber">
                <span>补印数量：</span>
                <input :class="replenish.AmountErr ? 'is-warn' : ''"
                  v-model="amountNum" @input="onAmountInput" type="text">
                <span>{{orderDetailData.ProductParams.Attributes.Unit}}</span>
              </div>
              <div class="upload-file-box">
                <FileSelectBtn class="uploadFileBox" accept='*'  v-if="orderDetailData.FileCase"
                 :func="readFileUniqueName" title="上传文件" />
                <el-tooltip v-if="orderDetailData.FileCase"
                  class="file-name-box" effect="dark" :content="fileName" placement="top-end">
                  <span class="file-name-box">{{fileName}}</span>
                </el-tooltip>
                <span class="is-font-size-12 is-gray" v-if="orderDetailData.FileCase === 1 && !fileName">文件非必传</span>
                <span class="is-font-size-12 is-gray" v-if="orderDetailData.FileCase === 2 && !fileName">文件必传</span>
              </div>
              <div v-if="!orderDetailData.FileCase">
                <span class="is-font-size-12 is-gray" style="line-height:20px">注：该订单不用上传文件</span>
              </div>
            </li>
            <li v-if="radioState === 0" class="mp-service-count-wrap" >
              <div>
                <span>订单减款：</span>
                <input :class="refund.err ? 'is-warn' : ''" style="width:60px"
                  v-model="refundNum" @input="onRefundInput" type="text">
                <span>元</span>
              </div>
              <div style="margin-left: 25px">
                <span>运费减款：</span>
                <input :class="refundFreight.err ? 'is-warn' : ''" style="width: 60px"
                  v-model="refundFreightAmount" @input="onRefundFreightAmountInput" type="text">
                <span>元</span>
              </div>
            </li>
            <li v-if="radioState === 2" class="mp-service-count-wrap" style="line-height:22px">
              <div>
                <span class="is-font-12 blue-span" @click="onCouponSelectClick">选择优惠券</span>
                <span v-if="selectedCouponList.length === 0" style="margin-left:30px" class="is-gray is-font-12">尚未选中优惠券</span>
              </div>
            </li>
          </ul>
        </section>
        <section class="coupon-list-box" v-show="radioState === 2">
          <div v-if="selectedCouponList.length > 0">
            <span>已选：</span>
            <ul>
              <li v-for="it in selectedCouponList" :key="it.CouponID">
                  <span class="is-pink">{{it.Data.Amount}}元</span>
                  <span class="MinPayAmount">满{{it.Data.MinPayAmount}}元使用</span>
                  <span>（ <i class="is-origin">{{it.CouponNumber}}</i>张 ）</span>
                  <i> - </i>
                  <el-tooltip placement="top-start" :enterable='false' >
                    <div slot="content">
                        <p v-for="(item, i) in it.ProductListTextArray" :key="item + '---' + i">
                          {{ item }}
                        </p>
                    </div>
                    <span class="area-span">限产品：{{ it.ProductListTextArray.join(' ') }}</span>
                  </el-tooltip>
              </li>
            </ul>
          </div>
          <el-dialog
            center
            :visible.sync="dialogVisible"
            :modal-append-to-body='false'
            :modal='false'
            :close-on-press-escape='false'
            :close-on-click-modal='false'
            @open='handleCouponDialogOpen'
            custom-class='mp-erp-server-after-sale-solution-coupon-select-dialog'
            top="16vh"
            width="750px">
            <div class="coupon-dialog-content">
              <p v-if="couponList.length === 0 && isCouponListLoaded" style="margin:20px 30px; letter-spacing:1px" class="is-pink is-font-size-12 tips-box">
                <i class="el-icon-warning"></i> 暂无可用优惠券！</p>
              <ul v-else>
                <li v-for="it in couponList" :key="it.CouponID">
                  <el-checkbox v-model="it.checked" class="mp-mini-checkbox">
                    <span class="is-pink">{{it.Data.Amount}}元</span>
                    <span class="MinPayAmount">满{{it.Data.MinPayAmount}}元使用</span>
                    <i> - </i>
                    <el-tooltip placement="top-start" :enterable='false' >
                      <div slot="content">
                          <p v-for="(item, i) in it.ProductListTextArray" :key="item + '---' + i">
                            {{ item }}
                          </p>
                      </div>
                      <span class="area-span">限产品：{{ it.ProductListTextArray.join(' ') }}</span>
                    </el-tooltip>
                  </el-checkbox>
                  <el-input v-show="it.checked" v-model="it.CouponNumber" placeholder="" maxlength="5" size="mini"></el-input>
                  <span v-show="it.checked">张</span>
                </li>
              </ul>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" :disabled='couponList.length === 0' @click="onSelectClick">确 定</el-button>
              <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </section>
    </main>
</div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';
import FileSelectBtn from '@/packages/FileSelectComp/src/FileSelectBtn';
import SingleRadio from '@/components/common/SingleRadio.vue';
// import { Base64 } from 'js-base64';
import { getUniqueFileName } from '@/assets/js/upload/UploadFileByBreakPoint';
import MpTextInput from './MpTextInput.vue';
import DropDown from '../../common/DropDown.vue';

export default {
  components: {
    DropDown,
    FileSelectBtn,
    SingleRadio,
    MpTextInput,
  },
  props: {
    /**
     * 根据传递进来的当前订单的状态，来判断当前状态是否可以进行补印(异常取消和已签收后才可以)--异常取消尚未实现
     */
    status: {
      type: Number,
      default: -1,
    },
  },
  data() {
    return {
      radioState: 0,
      kingNum: null,
      amountNum: null,
      refundNum: null,
      refundFreightAmount: 0,
      dialogVisible: false,
      couponList: [],
      selectedCouponList: [],
      couponListLoading: false,
      isCouponListLoaded: false,
    };
  },
  computed: {
    // eslint-disable-next-line max-len
    ...mapState('service', ['submitQuestionList', 'fileName', 'replenishFile', 'SolutionType', 'replenish', 'refund', 'refundFreight', 'FileCaseList']),
    ...mapState('orderModule', ['isShowServiceDia', 'orderDetailData']),
    ...mapState('common', ['DepartmentList', 'AfterSalesTypeList']),
    ...mapGetters('common', ['allProductClassify']),
    ...mapGetters('service', ['QuestionTypeLevelList']),
    questionList() {
      return this.QuestionTypeLevelList;
    },
    selectList() {
      return [{ value: '减款', type: true }, { value: '补印', type: true }, { value: '赠送优惠券', type: true }]; // 判断信息不明确 ，暂时先全部都可选择
    },
    departmentSelectList() {
      if (this.DepartmentList.length === 0) return [];
      const list = this.DepartmentList.map((it) => ({
        ...it,
        name: it.Title,
      }));
      return list;
    },
    showNumber() {
      if (this.orderDetailData?.ProductParams?.Attributes?.HaveNumber) return true;
      return false;
    },
    showKindCount() {
      if (this.orderDetailData?.ProductParams?.Attributes?.HaveKind) return true;
      return false;
    },
  },
  watch: {
    isShowServiceDia(newVal) {
      if (newVal) return;
      this.radioState = 0;
    },
    refund(newVal) {
      if (newVal.refund === '') this.refundNum = '';
    },
    refundFreight(newVal) {
      if (newVal.refundFreight === '') this.refundFreightAmount = '';
    },
    replenish(newVal) {
      if (newVal.KindCount === 0) this.kingNum = '';
      if (newVal.Amount === 0) this.amountNum = '';
    },
  },
  methods: {
    // eslint-disable-next-line max-len
    ...mapMutations('service', ['setSubmitQuestionList', 'addQuestionList', 'delQuestionList', 'setFileName', 'setReplenish', 'setRefund', 'setRefundFreight', 'setSolutionType', 'setReplenishFile', 'setReplenishFileUniqueName']),
    handleInput(value, i) { // 传给MpTextInput子组件，收集该组件input框添加的信息，并同步设置给vuex中对应状态
      this.setSubmitQuestionList(['Remark', value, i]);
    },
    handleInputDepartment(value, i) { // 传给MpTextInput子组件，收集该组件input框添加的信息，并同步设置给vuex中对应状态
      this.setSubmitQuestionList(['Department', value, i]);
    },
    addQuestion() { // 增加问题框
      this.addQuestionList();
      const oUl = document.querySelector('.mp-scroll-wrap.question-list');
      oUl.scrollTop = oUl.scrollHeight;
      setTimeout(() => {
        oUl.scrollTop = oUl.scrollHeight;
      }, 10);
    },
    delQuestion(i) { // 删除问题框
      this.delQuestionList(i);
    },
    addSingleImg(data) { // 添加单张图片， 用于将图片信息添加到仓库中， 暂放此处，可能不用
      const inputFile = data;
      const { name, size } = inputFile;
      const lastModifiedDate = inputFile.lastModifiedDate.toLocaleString(84);
      this.imgInfo.push({
        name,
        size,
        lastModifiedDate,
      });
      const reader = new FileReader();
      reader.readAsDataURL(inputFile);
      reader.onloadend = () => {
        const strBase64 = reader.result.substring(0);
        return strBase64;
      };
    },
    readFileUniqueName(file) {
      // 上传成功后，设置文件名称, 文件唯一标识 getUniqueFileName
      if (!file) return;
      const CustomerID = this.orderDetailData?.Customer?.CustomerID || '';
      const uniqueName = getUniqueFileName({ file, Terminal: 1, CustomerID });
      this.setReplenishFileUniqueName(uniqueName);
      this.setReplenishFile(file);
      this.setFileName(file.name);
    },
    onKingCountInput(v) {
      this.kingNum = this.$utils.filterNumber(v.target.value);
      this.setReplenish(['KindCount', this.kingNum]);
    },
    onAmountInput(v) {
      this.amountNum = this.$utils.filterNumber(v.target.value);
      this.setReplenish(['Amount', this.amountNum]);
    },
    onRefundInput(v) {
      this.refundNum = this.$utils.filterNumber(v.target.value);
      this.setRefund(this.refundNum);
    },
    onRefundFreightAmountInput(v) {
      const num = this.$utils.filterNumber(v.target.value);
      this.refundFreightAmount = num;
      this.setRefundFreight(this.refundFreightAmount);
    },
    handleSwitch(value) {
      this.radioState = value;
      let str = '';
      if (value === 0) str = 'refund';
      else if (value === 1) str = 'replenish';
      else if (value === 2) str = 'giveCoupons';
      this.setSolutionType(str);
    },
    onLevel1Select([ID, , index]) {
      if (this.submitQuestionList[index].level1ID === ID) return;
      this.setSubmitQuestionList(['level1ID', ID, index]);
      this.setSubmitQuestionList(['ID', '', index]);
    },
    onSelect([ID, , index]) {
      this.setSubmitQuestionList(['ID', ID, index]);
    },
    onDepartmentSelect([ID, , index]) {
      this.setSubmitQuestionList(['Department', ID, index]);
    },
    onCouponSelectClick() {
      this.dialogVisible = true;
    },
    async handleCouponDialogOpen() {
      if (this.isCouponListLoaded) {
        this.couponList.forEach(it => {
          const _it = it;
          const t = this.selectedCouponList.find(_item => _item.CouponID === it.CouponID);
          if (t) {
            _it.checked = true;
            _it.CouponNumber = t.CouponNumber;
          } else {
            _it.checked = false;
            _it.CouponNumber = '';
          }
        });
        return;
      }
      this.couponListLoading = true;
      const resp = await this.api.getCouponList({ ProvideStatus: 1, FieldType: 1, ReceiveNumber: 1 }).catch(() => {});
      this.couponListLoading = false;
      if (resp && resp.data.Status === 1000) {
        this.isCouponListLoaded = true;
        this.couponList = resp.data.Data.map(it => {
          const ProductListTextArray = it.ProductString ? it.ProductString.split('\n') : [];
          return {
            ...it,
            checked: false,
            CouponNumber: '',
            ProductListTextArray,
          };
        });
      }
    },
    onSelectClick() {
      const list = this.couponList.filter(it => it.checked); // CouponNumber
      if (list.length === 0) {
        this.messageBox.failSingleError('操作失败', '未选中优惠券');
        return;
      }
      let t = list.find(it => !it.CouponNumber || !this.$utils.getValueIsOrNotNumber(it.CouponNumber, true) || it.CouponNumber <= 0);
      if (t) {
        this.messageBox.failSingleError('操作失败', '优惠券数量未输入或输入不正确');
        return;
      }
      t = list.find(it => it.CouponNumber > it.Data.TotalNumber - it.Data.GenerateNumber);
      if (t) {
        const max = t.Data.TotalNumber - t.Data.GenerateNumber;
        this.messageBox.failSingleError('操作失败', `满${t.Data.MinPayAmount}减${t.Data.Amount}优惠券数量已超最大可用数量：${max}`);
        return;
      }
      this.selectedCouponList = list.map(it => ({ ...it }));
      const _list = this.selectedCouponList.map(it => ({ CouponInfo: { CouponID: it.CouponID }, Number: +it.CouponNumber }));
      this.$store.commit('service/setCouponList', _list);
      this.dialogVisible = false;
    },
    getLevel2QuestionList(i) {
      const { level1ID } = this.submitQuestionList[i];
      if (level1ID || level1ID === 0) {
        const t = this.QuestionTypeLevelList.find(it => it.ID === level1ID);
        if (t) return t.children || [];
      }
      return [];
    },
  },
  mounted() {
    this.$store.dispatch('common/getAfterSalesDepartmentList');
    this.setReplenishFileUniqueName('');
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/common/var.scss";
.mp-edit-dia-right-submit-wrap{
  font-size: 12px;
  text-align: left;
  > main {
    display: block;
    box-sizing: border-box;
    padding-top: 19px;
    section {
      &.problem-box {
        display: flex;
        width: 100%;
        header {
          padding-top: 5px;
        }
        ul {
          width: 100%;
          max-height: 103px;
          overflow: auto;
          transition: 1s;
          > li {
            margin-bottom: 9px;
            .mp-dorp-down-wrap.el-dropdown {
              font-size: 12px;
              width: 90px;
              margin-left: 3px;
              border-color: $--border-color-dark;
              height: 18px;
              vertical-align: bottom;
              > span{
                margin-top: -5px;
                position: relative;
                top: -3px;
              }
              &::after{
                top: 0px;
              }
              &.is-warn {
                border-color: rgba($color:  $--color-text-table-pending, $alpha: 0.6);
              }
              &.second-dropdown {
                margin-left: 18px;
                width: 110px;
                &.is-gray {
                  > .el-dropdown-link {
                    color: #cbcbcb;
                  }
                }
              }
              &.level1-drop {
                width: 85px;
              }
              &.level2-drop {
                width: 105px;
              }
            }
            .mp-text-input-wrap {
              margin-left: 20px;
              &.is-warn {
                > input {
                  border-color: rgba($color:  $--color-text-table-pending, $alpha: 0.6);
                }
              }
              &.inp-department {
                > input {
                  width: 150px;
                }
              }
            }
            span.icon-wrap {
              margin-left: 19px;
              cursor: pointer;
              user-select: none;
              img {
                position: relative;
                top: 3px;
                margin-right: 3px;
              }
              &:first-of-type > img{
                top: 2px;
                position: relative
              }
              color: $--color-text-light;
              &:hover {
                color: $--color-text-table;
              }
              &:last-of-type {
                margin-left: 13px;
              }
            }
          }
        }
        margin-bottom: 8px;
      }
      &.solution-box {
        display: flex;
        > .left {
          padding-top: 6px;
        }
        > .right {
          margin-left: 4px;
          display: flex;
           .upload-file-box{ // 文件上传
             .upload-btn{
                margin: 0;
                width: 80px;
             }
             span.file-name-box {
               color: $--color-text-table-time;
               margin-left: 15px;
               overflow: hidden;
               text-overflow: ellipsis;
               white-space: nowrap;
               max-width: 78px;
               height: 100%;
               line-height: 20px;
               display: inline-block;
               vertical-align: middle;
             }
           }
           > li {
             margin-right: 24px;
           }
           > li:first-of-type{
              line-height: 26px;
              margin-right: 35px;
              > span{
                color: $--color-text-table;
              }
           }
           .mp-service-count-wrap{
             display: flex;
             margin-top: 2px;
             > div{
                > input {
                  height: 24px;
                  width: 56px;
                  box-sizing: border-box;
                  margin-right: 6px;
                  border:1px solid $--border-color-dark;
                  outline: none;
                  padding-left: 5px;
                  text-align: center;
                  font-size: 14px;
                }
                > span:last-of-type{
                  color: $--color-text-table-time;
                }
             }
             > div + div {
                margin-left: 22px;
                > input{
                    width: 70px;
                }
             }
             > div.remark{
               margin-left: 65px;
               line-height: 24px;
             }
            //  margin-bottom: 12px;
           }
           .mp-single-radio-wrap {
             > label:not(:last-of-type) {
               margin-right: 20px;
             }
           }
        }
      }
      .problem-title {
        width: 5em;
        font-size: 13.34px;
        text-align: right;
        display: inline-block;
        color: $--color-text-table;
        font-weight: 600;
      }
      &.coupon-list-box {
        padding-top: 8px;
        width: 800px;
        > div {
          display: flex;
          > span {
            width: 106px;
            flex: none;
            text-align: right;
            line-height: 18px;
            color: #999;
          }
          > ul {
            width: 690px;
            > li {
              padding-bottom: 4px;
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              line-height: 18px;
              display: flex;
              align-items: center;
              color: #999;
              .area-span {
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              > i {
                padding: 0 5px;
              }
              .is-pink {
                min-width: 2.5em;
                margin-right: 0.5em;
                flex: none;
              }
              .MinPayAmount {
                min-width: 72px;
              }
            }
          }
        }
      }
    }
  }
}
.mp-erp-server-after-sale-solution-coupon-select-dialog {
  border-radius: 5px;
  height: 590px;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    height: 520px !important;
    overflow-y: overlay;
    padding-right: 20px;
    .coupon-dialog-content {
      > ul {
        padding-top: 25px;
        > li {
          padding: 2px 40px;
          padding-right: 20px;
          display: flex;
          align-items: center;
          height: 28px;
          > label {
            width: 540px;
            font-size: 12px;
            display: flex;
            align-items: center;
            .el-checkbox__label {
              font-size: 12px;
              display: flex;
              align-items: center;
              overflow: hidden;
              width: 520px;
              color: #585858;
              .area-span {
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
              .is-pink {
                min-width: 3em;
                margin-right: 0.5em;
                flex: none;
              }
              > i {
                padding: 0 5px;
              }
              .MinPayAmount {
                min-width: 76px;
              }
            }
          }
          .el-input {
            width: 80px;
            margin-right: 9px;
            margin-left: 20px;
          }
          > span {
            font-size: 12px;
            color: #999;
          }
        }
      }
    }
  }
  .el-dialog__footer {
    padding-bottom: 25px !important;
    .dialog-footer {
      justify-content: center !important;
      > button {
        width: 120px;
        height: 30px;
        padding: 0;
        border-radius: 2px;
      }
    }
  }
}
</style>
