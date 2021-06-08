<template>
 <div class="mp-edit-dia-right-submit-wrap">
    <main>
        <section class="problem-box"> <!-- 问题选择 -->
            <header>
                <span class='problem-title'>问题：</span>
            </header>
            <ul class="mp-scroll-wrap question-list">
                <li v-for="(item, i) in submitQuestionList.length" :key="i">

                  <DropDown :class="submitQuestionList[i].IDErr ? 'is-warn' : ''"
                   :list='questionList' :title='title' :index='i'
                   :watchTarget='submitQuestionList[i].ID'
                   @select='onSelect' />  <!-- 下拉问题列表 -->
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
              <div>
                <span>款数：</span>
                <input :class="replenish.KindCountErr ? 'is-warn' : ''"
                  v-model="kingNum" @input="onKingCountInput" type="text">
                <span>款</span>
              </div>
              <div>
                <span>补印数量：</span>
                <input :class="replenish.AmountErr ? 'is-warn' : ''"
                  v-model="amountNum" @input="onAmountInput" type="text">
                <span>{{orderDetailData.ProductParams.Attributes.Unit}}</span>
              </div>
              <div class="upload-file-box">
                <ServiceBlueBtn class="uploadFileBox" accept='*'
                 :func="readFileUniqueName" title="上传文件" />
                <el-tooltip
                  class="file-name-box" effect="dark" :content="fileName" placement="top-end">
                  <span class="file-name-box">{{fileName}}</span>
                </el-tooltip>
              </div>
            </li>
            <li v-if="radioState === 0" class="mp-service-count-wrap" >
              <div>
                <span>订单减款：</span>
                <input :class="refund.err ? 'is-warn' : ''"
                  v-model="refundNum" @input="onRefundInput" type="text">
                <span>元</span>
              </div>
              <div style="margin-left: 25px">
                <span>运费减款：</span>
                <input :class="refundFreight.err ? 'is-warn' : ''" style="width: 60px"
                  v-model="refundFreightAmount" @input="onRefundFreightAmountInput" type="text">
                <span>元</span>
              </div>
              <!-- <div class="remark is-gray">注：只有异常取消或已签收状态才可选择补印方案</div> -->
            </li>
          </ul>
        </section>
    </main>
</div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import DropDown from '@/components/common/DropDown.vue';
import ServiceBlueBtn from '@/components/ServiceAfterSale/EditDialog/ServiceBlueBtn.vue'; // serviceSingleRadio
import SingleRadio from '@/components/common/SingleRadio.vue';
// import { Base64 } from 'js-base64';
import MpTextInput from './MpTextInput.vue';

const sha1 = require('js-sha1');

export default {
  components: {
    DropDown,
    ServiceBlueBtn,
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
      title: '请选择',
    };
  },
  computed: {
    // eslint-disable-next-line max-len
    ...mapState('service', ['submitQuestionList', 'fileName', 'replenishFile', 'QuestionTypeList', 'SolutionType', 'replenish', 'refund', 'refundFreight']),
    ...mapState('orderModule', ['isShowServiceDia', 'orderDetailData']),
    ...mapState('common', ['DepartmentList']),
    questionList() {
      if (this.QuestionTypeList.length < 1) return [];
      const list = this.QuestionTypeList.map((it) => ({
        ...it,
        name: it.Title,
      }));
      return list;
    },
    selectList() {
    //   if (this.status === 200) { // 只有已签收交易完成才能选择补印，还有一种情况：异常取消也可以，暂时尚未设置
    //     return [{ value: '减款', type: true }, { value: '补印', type: true }];
    //   }
    //   return [{ value: '减款', type: true }, { value: '补印', type: false }];
      return [{ value: '减款', type: true }, { value: '补印', type: true }]; // 判断信息不明确 ，暂时先全部都可选择
    },
    departmentSelectList() {
      if (this.DepartmentList.length === 0) return [];
      const list = this.DepartmentList.map((it) => ({
        ...it,
        name: it.Title,
      }));
      return list;
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
      this.$utils.animateScroll(oUl.scrollTop, oUl.scrollHeight, (num) => {
        oUl.scrollTop = num;
      });
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
        // this.setServiceImgList([strBase64, inputFile]); // 添加到数据仓库图片列表中
        return strBase64;
      };
    },
    readFileUniqueName(file) {
      // 上传成功后，设置文件名称, 文件唯一标识
      if (!file) return;
      this.setFileName('文件读取中...');
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onerror = () => {
        this.messageBox.failSingleError('文件解析错误！', '请检查文件并重新上传');
        this.setFileName('文件读取失败，请重新上传');
        const oInput = document.querySelector('.uploadFileBox > input');
        oInput.value = '';
      };
      reader.onloadend = () => {
        if (!(reader.result)) return;
        const ext = this.$utils.extname(file.name);
        this.setReplenishFileUniqueName(`${sha1(reader.result)}.${ext}`);
        this.setReplenishFile(file);
        this.setFileName(file.name);
      };
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
      // console.log(num);
      // if (/.$/)
      this.refundFreightAmount = num;
      this.setRefundFreight(this.refundFreightAmount);
    },
    handleSwitch(value) {
      this.radioState = value;
      let str = '';
      if (value === 0) str = 'refund';
      else if (value === 1) str = 'replenish';
      this.setSolutionType(str);
    },
    onSelect([ID, , index]) {
      this.setSubmitQuestionList(['ID', ID, index]);
    },
    onDepartmentSelect([ID, , index]) {
      this.setSubmitQuestionList(['Department', ID, index]);
    },
  },
  // beforeDestroy() {
  // //  console.log('beforeDestroy');
  // },
  mounted() {
    this.$store.dispatch('common/getAfterSalesDepartmentList');
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
        width: 800px;
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
                margin-left: 20px;
                width: 120px;
                &.is-gray {
                  > .el-dropdown-link {
                    color: #cbcbcb;
                  }
                }
              }
            }
            .mp-text-input-wrap {
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
               max-width: 168px;
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
              margin-right: 45px;
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
                  width: 60px;
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
                    width: 80px;
                }
             }
             > div.remark{
               margin-left: 65px;
               line-height: 24px;
             }
            //  margin-bottom: 12px;
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
    }
  }
}
</style>
