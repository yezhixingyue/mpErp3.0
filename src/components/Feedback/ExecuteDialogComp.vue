<template>
  <el-dialog
    title="售后处理"
    :visible="visible"
    :modal-append-to-body='false'
    width="1000px"
    :modal='false'
    custom-class="dialog-to-order-service-box dialogexecutedialogcomp mp-img-style-header"
    top="6vh"
    center :close-on-press-escape='false'
    :before-close="handleClose" :close-on-click-modal='false'
    v-dialogDrag
    v-loading="ReprintFilePercentageVisible"
    :element-loading-text="`文件上传中，${ReprintFilePercentage}%`"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <template>
      <section v-show="!isLoading" class="question-photo">
        <!-- 问题照片 -->
        <header class="right-line">
          <VTypeTitle :imgSrc="require('@/assets/images/photo.png')" title="问题照片" />
        </header>
        <main>
          <div class="submit-img-box" v-show='QuestionPicLength.length >= 9'>
            <div class="upload-demo" style="text-align: left;">
              <el-button size="small" type="primary" @click="beforeUpload">上传问题照片</el-button>
            </div>
            <span class="explain">最多上传9张照片，支持.jpg .jpeg .png .bmp</span>
          </div>
          <div class="submit-img-box" v-show='QuestionPicLength.length < 9'>
            <el-upload
              class="upload-demo"
              :action="'/Api/Upload/Image?type=3'"
              multiple
              :disabled ="QuestionPicLength.length >= 9"
              accept='.png,.jpeg,.jpg,.bmp'
              :on-success='handllePictureUploaded'
              :before-upload="beforeUpload"
              :file-list="fileList">
              <el-button size="small" type="primary" :disabled ="QuestionPicLength.length >= 9">上传问题照片</el-button>
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
            <span class="explain">最多上传9张照片，支持.jpg .jpeg .png .bmp</span>
          </div>
          <DisplayPictrue :delFunc='handleDel' :imgList='[...HandlingAfterSalesForm.PassQuestionPicList,...serviceImgList]' />
        </main>
      </section>

      <section class="service-after-sale" v-show="!isLoading">
        <!-- 售后处理 -->
        <header class="right-line">
          <VTypeTitle :imgSrc="require('@/assets/images/service2.png')" title="售后处理" />
        </header>
        <main>
          <div class="left-table">
            <EditDiaLeftTable :SelectionData="AfterSalePackages"
            :otherPackageNo="OrderPackageListTableData?.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo) || []"
            :tableData='OrderPackageListTableData?.BackPackageInfos||[]' @SelectionChange='SelectionPackageChange' />
          </div>
          <div class="right-submit-wrap">
            <div class="questions">
              <div class="left">
                问题：
              </div>
              <div class="right">
                <div class="row" v-for="(item, index) in HandlingAfterSalesForm.AfterSaleQuestions" :key="item.key">
                  <el-select v-model="item.FirstQuestionType"
                  @change="changeQuestions(index)" placeholder="请选择问题类型" size="small" class="mp-common-select-comp-wrap font-12">
                    <el-option
                      v-for="it in FirstGradeQuestionType"
                      :key="it.ID"
                      :label="it.Name"
                      :disabled="!!oldQuestionType.find(el => el.FirstQuestionType === it.ID)"
                      :value="it.ID">
                    </el-option>
                  </el-select>
                  <el-select v-model="item.SecondQuestionType"
                  placeholder="请选择具体问题" size="small" class="mp-common-select-comp-wrap font-12">
                    <el-option
                      v-for="it in SecondLevelQuestionType(index)"
                      :key="it.ID"
                      :label="it.Name"
                      :disabled="!!oldQuestionType.find(el => el.SecondQuestionType === it.ID)"
                      :value="it.ID">
                    </el-option>
                  </el-select>
                  <el-input size="small" v-model="item.Remark" placeholder="在此输入备注信息" maxlength="300" show-word-limit></el-input>
                  <div class="menus">
                    <span @click="onQuestionsAddClick">
                      <img src="@/assets/images/add.png" alt />添加</span>
                    <span @click="onQuestionsRemoveClick(index)" v-if="true">
                      <img src="@/assets/images/del.png" alt />删除</span>
                    <span v-else class="disabled">
                      <img src="@/assets/images/del-disabled.png" alt />删除</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="department">
              <div class="left">
                责任部门：
              </div>
              <div class="right">
                <div class="row" v-for="(item, i) in HandlingAfterSalesForm.AfterSaleResponsibilities" :key="item.key">
                  <el-select v-model="item.Department"
                  class="mp-common-select-comp-wrap font-12"
                  placeholder="请选择">
                    <el-option
                      v-for="it in DepartmentList"
                      :key="it.ID"
                      :label="it.Title"
                      :value="it.ID">
                    </el-option>
                  </el-select>
                  <el-input oninput="value=value.replace(/[^\d]/g,'')"
                    v-model.number="item.Proportion" placeholder="输入责任比例" size="small">
                  </el-input>
                  %
                  <div class="menus">
                    <span @click="onDepartmentAddClick">
                      <img src="@/assets/images/add.png" alt />添加</span>
                    <span @click="onDepartmentRemoveClick(i)" v-if="true">
                      <img src="@/assets/images/del.png" alt />删除</span>
                    <span v-else class="disabled">
                      <img src="@/assets/images/del-disabled.png" alt />删除</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="bottom">
              <div class="left">
                <div class="solution">
                  <div class="left">
                    解决方案：
                  </div>
                  <div class="right">
                    <div class="row">
                      <el-checkbox-group v-model="HandlingAfterSalesForm.Solution.SolutionTypes">
                        <el-checkbox :label="2"
                        :disabled='(!RefundBalanceShow && !RefundPrintBeanShow && !RefundThirdPartyShow && !UnpaidReducedAmountShow) ||
                         !!HandlingAfterSalesForm.Solution.SolutionTypes.find(it => it === 7)'>退款</el-checkbox>
                        <el-checkbox :label="7" :disabled="!!HandlingAfterSalesForm.Solution.SolutionTypes.find(it => it === 2)">补印</el-checkbox>
                        <el-checkbox :label="8">赠送优惠劵</el-checkbox>
                        <el-checkbox :label="255">其他</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </div>
                <div class="dispose">
                  <div class="right">
                    <template v-if="HandlingAfterSalesForm.Solution.SolutionTypes.find(it => it === 2)">
                      <div class="row solution-type2" v-if="RefundBalanceShow">
                        <div class="form-item">
                          <div class="label">
                            退到余额：
                          </div>
                          <div class="conent">
                            <el-input @change="RefundBalanceChange()"
                              v-model="HandlingAfterSalesForm.Solution.RefundBalance" placeholder="输入余额退款"
                            oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]"></el-input>元
                          </div>
                        </div>
                        <el-radio v-model="HandlingAfterSalesForm.Solution.RefundFreightType" :label="1">含运费</el-radio>
                        <div class="form-item" v-if="HandlingAfterSalesForm.Solution.RefundFreightType === 1">
                          <div class="conent">
                            <el-input @change="RefundFreightAmountChange()" placeholder="输入运费退款"
                              v-model="HandlingAfterSalesForm.Solution.RefundFreightAmount"
                              oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]"></el-input>元
                          </div>
                        </div>
                      </div>
                      <div class="row solution-type2" v-if="RefundPrintBeanShow">
                        <div class="form-item">
                          <div class="label">
                            退印豆：
                          </div>
                          <div class="conent">
                            <el-input @change="RefundPrintBeanChange()" placeholder="输入印豆退款"
                              v-model="HandlingAfterSalesForm.Solution.RefundPrintBean"
                              oninput="value=value.replace(/[^\d]/g,'')"></el-input>个
                          </div>
                        </div>
                        <el-radio v-model="HandlingAfterSalesForm.Solution.RefundFreightType" :label="3">含运费</el-radio>
                        <div class="form-item" v-if="HandlingAfterSalesForm.Solution.RefundFreightType === 3">
                          <div class="conent">
                            <el-input @change="RefundFreightAmountChange()" placeholder="输入运费退款"
                              v-model="HandlingAfterSalesForm.Solution.RefundFreightAmount"
                              oninput="value=value.replace(/[^\d]/g,'')"></el-input>个
                          </div>
                        </div>
                      </div>
                      <div class="row solution-type2" v-if="RefundThirdPartyShow">
                        <div class="form-item">
                          <div class="label">
                            退到扫码账户：
                          </div>
                          <div class="conent">
                            <el-input @change="HandlingAfterSalesForm.Solution.RefundThirdParty > dataInfo.Order.SurplusOrderThirdParty ?
                              HandlingAfterSalesForm.Solution.RefundThirdParty = dataInfo.Order.SurplusOrderThirdParty :
                              HandlingAfterSalesForm.Solution.RefundThirdParty" placeholder="输入扫码退款"
                              v-model="HandlingAfterSalesForm.Solution.RefundThirdParty"
                            oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]"></el-input>元
                          </div>
                        </div>
                        <el-radio v-model="HandlingAfterSalesForm.Solution.RefundFreightType" :label="2">含运费</el-radio>
                        <div class="form-item" v-if="HandlingAfterSalesForm.Solution.RefundFreightType === 2">
                          <div class="conent">
                            <el-input @change="HandlingAfterSalesForm.Solution.RefundFreightAmount > dataInfo.Order.SurplusOrderThirdParty ?
                              HandlingAfterSalesForm.Solution.RefundFreightAmount = dataInfo.Order.SurplusOrderThirdParty :
                              HandlingAfterSalesForm.Solution.RefundFreightAmount" placeholder="输入运费退款"
                              v-model="HandlingAfterSalesForm.Solution.RefundFreightAmount"
                              oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]"></el-input>元
                          </div>
                        </div>
                      </div>
                      <div class="row solution-type2" v-if="UnpaidReducedAmountShow">
                        <div class="form-item">
                          <div class="label">
                            售后优惠：
                          </div>
                          <div class="conent">
                            <el-input @change="HandlingAfterSalesForm.Solution.UnpaidReducedAmount > dataInfo.Order.UnPaidAmount ?
                              HandlingAfterSalesForm.Solution.UnpaidReducedAmount = dataInfo.Order.UnPaidAmount :
                              HandlingAfterSalesForm.Solution.UnpaidReducedAmount" placeholder="输入售后优惠"
                              v-model="HandlingAfterSalesForm.Solution.UnpaidReducedAmount"
                            oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]"></el-input>元
                          </div>
                        </div>
                      </div>
                    </template>

                    <div class="row" v-if="HandlingAfterSalesForm.Solution.SolutionTypes.find(it => it === 7)">
                      <div class="form-item">
                        <div class="label" style="width: 5.8em;">
                          款数：
                        </div>
                        <div class="conent">
                          <el-input v-model="HandlingAfterSalesForm.Solution.KindCount" oninput="value=value.replace(/[^\d]/g,'')" ></el-input>款
                        </div>
                      </div>
                      <div class="form-item">
                        <div class="label">
                          数量：
                        </div>
                        <div class="conent">
                          <el-input v-model="HandlingAfterSalesForm.Solution.Number"
                          oninput="value=value.replace(/[^\d]/g,'')" ></el-input>{{dataInfo.Order.Product.Unit}}
                        </div>
                      </div>
                      <!-- <div class="form-item">
                        <div class="conent">
                          <div class="upload-file-box" v-if="ReprintIsUpload">
                            <FileSelectBtn class="uploadFileBox" accept='*'
                            :func="readFileUniqueName" title="上传文件" />
                            <span class="file-name-box">
                              {{fileName}}
                            </span>
                          </div>
                            <p v-else class="is-font-size-12 is-gray" style="line-height:20px">注：该订单不用上传文件</p>
                        </div>
                      </div> -->
                    </div>
                    <div class="row" v-if="HandlingAfterSalesForm.Solution.SolutionTypes.find(it => it === 7)">
                      <div class="form-item">
                        <div class="conent" style="padding-left:2.5em">
                          <div class="upload-file-box" v-if="ReprintIsUpload">
                            <FileSelectBtn class="uploadFileBox" accept='*'
                            :func="readFileUniqueName" title="上传文件" />
                            <span class="file-name-box">
                              {{fileName}}
                              <!-- <i v-if="this.HandlingAfterSalesForm.Solution.FileName" @click="clearFile" class="el-icon-circle-close"></i> -->
                            </span>
                            <!-- <span class="is-font-size-12 is-gray" v-if="orderDetailData.FileCase === 1 && !fileName">文件非必传</span>
                            <span class="is-font-size-12 is-gray" v-if="orderDetailData.FileCase === 2 && !fileName">文件必传</span> -->
                          </div>
                            <p v-else class="is-font-size-12 is-gray" style="line-height:20px">注：该订单不用上传文件</p>
                        </div>
                      </div>
                    </div>
                    <div class="row" v-if="HandlingAfterSalesForm.Solution.SolutionTypes.find(it => it === 8)">
                      <div class="form-item">
                        <div class="label select" @click="onCouponSelectClick">
                          选择优惠券
                        </div>
                        <div class="conent selected-coupon">
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
                          <div v-else style="margin-top:0px;color:#999999;font-size:12px">暂未选择优惠券</div>
                        </div>
                      </div>
                    </div>
                    <div class="row" v-if="!!HandlingAfterSalesForm.Solution.SolutionTypes.find(it => it === 255)">
                      <div class="form-item other-remark">
                        <div class="label">
                          其他费用：
                        </div>
                        <div class="conent">
                          <TextareaInput type="textarea"
                          style="width: 430px;"
                          placeholder="请输入其他费用描述"
                          show-word-limit :maxlength="300" v-model.trim="HandlingAfterSalesForm.Solution.OtherSolutionRemark"></TextareaInput>
                        </div>
                      </div>
                    </div>
                    <div class="row" v-if="!!HandlingAfterSalesForm.Solution.SolutionTypes.length">
                      <div class="form-item opinion">
                        <div class="label">
                          处理意见：
                        </div>
                        <div class="conent">
                          <TextareaInput type="textarea"
                          style="width: 430px;"
                          placeholder="请输入处理意见"
                          show-word-limit :maxlength="300" v-model.trim="HandlingAfterSalesForm.Solution.Opinion"></TextareaInput>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="right" v-if="dataInfo">
                <p><span class="label">成交价：</span>       {{dataInfo.Order.FinalPrice}}元</p>
                <p><span class="label">已付金额：</span>     {{dataInfo.Order.PaidAmount}}元（含{{dataInfo.Order.PaidPrintBean}}个印豆）</p>
                <p><span class="label">退款：</span>         {{dataInfo.Order.RefundOrderAmount}}元（含{{dataInfo.Order.RefundOrderPrintBean}}个印豆）</p>
                <p><span class="label">未收金额：</span>     {{dataInfo.Order.UnPaidAmount}}元</p>
                <p><span class="label">售后优惠：</span>     {{dataInfo.Order.ReducedAmount}}元</p>
                <p><span class="label">运费：
                  </span> {{dataInfo.Order.FreightAmount}}元（含{{dataInfo.Order.FreightPrintBean}}个印豆，含{{dataInfo.Order.FreightOrderNumber}}个订单）
                </p>
                <p><span class="label">已退运费：</span>     {{dataInfo.Order.RefundFreightAmount}}元（含{{dataInfo.Order.RefundFreightPrintBean}}个印豆）</p>
                <p><span class="label">扫码支付：</span>     {{dataInfo.Order.OrderThirdPartyAmount}}元</p>
                <p><span class="label">已退扫码金额：</span> {{dataInfo.Order.RefundOrderThirdPartyAmount}}元</p>
              </div>
            </div>
          </div>
        </main>
      </section>
      <span slot="footer" class="dialog-footer" v-show="!isLoading">
        <div class="loss-box">
          <span class="title"><i>*</i>损失金额：</span>
          <input class="'is-warn'"
            v-model="HandlingAfterSalesForm.LossAmount"
            oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]"
            type="text" placeholder="请输入损失金额">
          <span>元</span>
        </div>
        <div class="btns">
          <normalBtn @click.native="handleClose" title="取消" />
          <normalBtn @click.native="submitServiceOrder(true)" title="保存" class="white"/>
          <normalBtnFull @click.native="submitServiceOrder(false)" title="处理完成" />
        </div>
      </span>
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
              <p v-if="couponList.length === 0" style="margin:20px 30px; letter-spacing:1px" class="is-pink is-font-size-12 tips-box">
                <i class="el-icon-warning"></i> 暂无可用优惠券！</p>
              <ul v-else>
                <li v-for="it in couponList" :key="it.CouponID">
                  <el-checkbox v-model="it.checked" class="mp-mini-checkbox">
                    <span class="is-pink">{{it.Data.Amount}}元</span>
                    <span class="MinPayAmount"> 满{{it.Data.MinPayAmount}}元使用</span>
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
              <el-button type="primary" :disabled='couponList.length === 0' @click="onSelectClick(false)">确 定</el-button>
              <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
          </el-dialog>
    </template>
    <div v-if="isLoading">
      <LoadingComp class="loading-box" />
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex';
import VTypeTitle from '@/components/ServiceAfterSale/EditDialog/VTypeTitle.vue';
import EditDiaLeftTable from '@/components/Feedback/DialogContent/EditDiaLeftTable.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import DisplayPictrue from '@/components/ServiceAfterSale/EditDialog/DisplayPictrue.vue';
import LoadingComp from '@/components/common/LoadingComp.vue';
// eslint-disable-next-line import/no-named-default
import { default as breakPointUpload, getUniqueFileName } from '@/assets/js/upload/UploadFileByBreakPoint';
// import { getUniqueFileName } from '@/assets/js/upload/UploadFileByBreakPoint';
import FileSelectBtn from '@/packages/FileSelectComp/src/FileSelectBtn';
import TextareaInput from '@/components/common/TextareaInput';

export default {
  components: {
    normalBtn,
    normalBtnFull,
    VTypeTitle,
    EditDiaLeftTable,
    DisplayPictrue,
    LoadingComp,
    FileSelectBtn,
    TextareaInput,
  },
  props: {
    className: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
    },
    paramsData: {
      type: Object,
    },
    dataInfo: {
      type: Object,
    },
  },
  data() {
    return {
      radio: '',
      UploadDisabled: false,
      QuestionTypeList: null,
      oldQuestionType: [],
      imgInfo: [],
      imgSrc: null,
      imgRules: [
        { strategy: 'maxLength:3', errorMsg: '最多上传4张照片' },
        // 要求为不能大于4张，但在此处设置的规则为最大为3，原因为在通过该项规则后系统还会向列表继续添加，还会产生变动，所以提前减一
      ],
      lossesNum: null,
      fileList: [],
      // 补印文件
      ReprintFile: null,
      // 上传进度
      ReprintFilePercentage: 0,
      dialogVisible: false,
      // 优惠卷列表
      couponList: [],
      // 选择的优惠卷
      selectedCouponList: [],
      // 需不需要上传补印文件
      ReprintIsUpload: false,
      // 包裹列表
      AfterSalePackages: [],
      HandlingAfterSalesForm: {
        AfterSaleCode: 0,
        SolutionQuestionPicList: [''],
        PassQuestionPicList: [],
        Opinion: '',
        LossAmount: '',
        AfterSaleQuestions: [],
        AfterSaleResponsibilities: [],
        AfterSalePackages: [],
        PackageList: '包裹列表',
        Solution: {
          SolutionTypes: [],
          KindCount: '',
          Number: '',
          UniqueName: '',
          FileName: '',
          IsFileInLan: true,
          FilePath: '',
          FileSize: '',
          Refund: '',
          RefundAmount: '',
          RefundBeanNumber: '',
          RefundBeanAmount: '',
          RefundFreightCashAmount: '',
          RefundFreightBeanNumber: '',
          RefundFreightBeanAmount: '',
          RefundFreightAmount: '', // 运费退款

          RefundFreightType: '', // 运费退款方式
          RefundBalance: '', // 订单余额退款
          RefundThirdParty: '', // 订单扫码退款
          RefundPrintBean: '', // 订单印豆退款
          UnpaidReducedAmount: '', // 售后优惠

          RefundType: '',
          LogisticsReduced: '',
          OrderID: '',
          CouponList: [],
        },
        IsSave: true,
      },

      serviceImgList: [],
      serviceImgList2Upload: [],
      OrderPackageListTableData: null,
    };
  },
  computed: {
    ...mapState('common', ['isLoading', 'DepartmentList']),
    FirstGradeQuestionType() {
      return this.QuestionTypeList?.filter(res => res && res.SonClassList.length) || [];
      // return this.QuestionTypeList?.filter(res => res.ParentID === -1);
    },
    // 图片总数量
    QuestionPicLength() {
      return [...this.HandlingAfterSalesForm.PassQuestionPicList, ...this.serviceImgList];
    },
    SecondLevelQuestionType() {
      // eslint-disable-next-line max-len
      return (index) => this.QuestionTypeList?.find(res => res.ID === this.HandlingAfterSalesForm.AfterSaleQuestions[index].FirstQuestionType)?.SonClassList || [];
      // return (index) => this.QuestionTypeList?.filter(res => res.ParentID === this.HandlingAfterSalesForm.AfterSaleQuestions[index].FirstQuestionType);
    },
    fileName() {
      // this.HandlingAfterSalesForm.Solution.FileName
      return this.HandlingAfterSalesForm.Solution.FileName ? this.HandlingAfterSalesForm.Solution.FileName : '请上传文件';
    },
    ReprintFilePercentageVisible() {
      return this.ReprintFilePercentage > 0 && this.ReprintFilePercentage < 100;
    },
    // 余额退款
    RefundBalanceShow() {
    // 余额为0的时候看有没有运费
      if (this.dataInfo?.Order.SurplusOrderBalance === 0) {
        return this.dataInfo?.Order.SurplusFreightAmount;
      }
      return this.dataInfo?.Order.SurplusOrderBalance;
    },
    // 剩余印豆
    RefundPrintBeanShow() {
      // dataInfo.Order.SurplusOrderPrintBean + dataInfo.Order.SurplusFreightPrintBean
      // eslint-disable-next-line no-unsafe-optional-chaining
      return this.dataInfo?.Order.SurplusOrderPrintBean + this.dataInfo?.Order.SurplusFreightPrintBean;
    },
    // 剩余扫码
    RefundThirdPartyShow() {
      //
      return 0; // 退款的第三方接口暂时不能使用
      //
      // SurplusOrderBalance 为已支付金额 如果 SurplusOrderBalance 为0，则不能退扫码（扫码支付可能为多个订单组合支付，分不清当前订单的实际金额）
      // 退款的第三方接口暂时不能使用
      // return this.dataInfo?.Order.SurplusOrderBalance ? this.dataInfo?.Order.SurplusOrderThirdParty : 0;
    },
    UnpaidReducedAmountShow() {
      return this.dataInfo?.Order.UnPaidAmount;
    },
  },
  methods: {
    // eslint-disable-next-line max-len
    setFrom() {
      this.HandlingAfterSalesForm = {
        AfterSaleCode: this.paramsData.AfterSaleCode,
        SolutionQuestionPicList: [],
        PassQuestionPicList: [],
        Opinion: '',
        LossAmount: '',
        AfterSaleQuestions: [],
        AfterSaleResponsibilities: [],
        AfterSalePackages: [],
        PackageList: '包裹列表',
        Solution: {
          SolutionTypes: [],
          KindCount: '',
          Number: '',
          UniqueName: '',
          FileName: '',
          IsFileInLan: true,
          IsNewUpFile: false,
          FilePath: '',
          FileSize: '',
          Refund: '',
          RefundAmount: '',
          RefundBeanNumber: '',
          RefundBeanAmount: '',
          RefundFreightCashAmount: '',
          RefundFreightBeanNumber: '',
          RefundFreightBeanAmount: '',
          RefundFreightAmount: '', // 运费退款

          RefundFreightType: '', // 运费退款方式
          RefundBalance: '', // 订单余额退款
          RefundThirdParty: '', // 订单扫码退款
          RefundPrintBean: '', // 订单印豆退款
          UnpaidReducedAmount: '', // 售后优惠

          RefundType: '',
          LogisticsReduced: '',
          OrderID: '',
          CouponList: [],
        },
        IsSave: true,
      };
    },
    // 选择上传的文件
    readFileUniqueName(file) {
      // 上传成功后，设置文件名称, 文件唯一标识 getUniqueFileName
      if (!file) return;
      const CustomerID = this.dataInfo?.Order?.CustomerID || '';
      const uniqueName = getUniqueFileName({ file, Terminal: 1, CustomerID });
      // breakPointUpload()
      this.ReprintFile = { file, uniqueName };
      this.HandlingAfterSalesForm.Solution.UniqueName = uniqueName;
      this.HandlingAfterSalesForm.Solution.FileName = file.name;
      this.HandlingAfterSalesForm.Solution.IsNewUpFile = true;
    },
    // 清除文件
    clearFile() {
      this.HandlingAfterSalesForm.Solution.UniqueName = '';
      this.HandlingAfterSalesForm.Solution.FileName = '';
      this.HandlingAfterSalesForm.Solution.IsNewUpFile = false;
      this.ReprintFile = null;
    },
    onDepartmentRemoveClick(i) {
      if (this.HandlingAfterSalesForm.AfterSaleResponsibilities.length === 1) {
        return;
      }
      this.HandlingAfterSalesForm.AfterSaleResponsibilities.splice(i, 1);
    },
    onDepartmentAddClick() {
      // 责任部门
      this.HandlingAfterSalesForm.AfterSaleResponsibilities.push({
        AfterSaleCode: this.paramsData.AfterSaleCode,
        Department: '',
        Proportion: undefined,
        key: new Date().getTime(),
      });
    },
    onCouponSelectClick() {
      this.dialogVisible = true;
    },
    // 优惠劵确定
    onSelectClick(bool) {
      const list = this.couponList.filter(it => it.checked); // CouponNumber
      if (list.length === 0 && !bool) {
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
      const _list = this.selectedCouponList.map(it => ({ CouponID: it.CouponID, Number: +it.CouponNumber }));
      this.HandlingAfterSalesForm.Solution.CouponList = _list;
      this.dialogVisible = false;
    },
    // 选择优惠卷的弹窗
    async handleCouponDialogOpen(CouponList) {
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
          const temp = CouponList?.filter(item => item.CouponID === it.CouponID);
          return {
            ...it,
            checked: !!CouponList?.some(item => item.CouponID === it.CouponID),
            CouponNumber: temp && temp.length ? temp[0].Number : '',
            ProductListTextArray,
          };
        });
        if (CouponList) this.onSelectClick(true);
      }
    },
    onQuestionsAddClick() {
      // 问题添加
      this.HandlingAfterSalesForm.AfterSaleQuestions.push({
        AfterSaleCode: this.paramsData.AfterSaleCode,
        SecondQuestionType: '',
        FirstQuestionType: '',
        Remark: '',
        key: new Date().getTime(),
      });
    },
    onQuestionsRemoveClick(i) {
      if (this.HandlingAfterSalesForm.AfterSaleQuestions.length === 1) {
        return;
      }
      this.HandlingAfterSalesForm.AfterSaleQuestions.splice(i, 1);
    },
    handleClose() {
      this.$emit('cloce');
      this.selectedCouponList = [];
      this.isCouponListLoaded = false;
    },
    handllePictureUploaded(e) {
      if (this.QuestionPicLength.length >= 9) return;
      this.serviceImgList.push(e.Data.Url);
    },
    beforeUpload() {
      if (this.QuestionPicLength.length >= 9) {
        this.messageBox.failSingle('最多上传9张照片');
        this.UploadDisabled = true;
        return false;
      }
      return true;
    },
    verifyQuestions() {
      const temp = this.HandlingAfterSalesForm.AfterSaleQuestions.filter(item => item.Remark === '' || item.SecondQuestionType === '');
      if (temp.length) return true;
      return false;
    },
    verifyResponsibilities() {
      const temp = this.HandlingAfterSalesForm.AfterSaleResponsibilities.filter(item => item.Department === '' || !item.Proportion);
      if (temp.length) return true;
      return false;
    },
    responsibilityRatio() {
      let num = 0;
      this.HandlingAfterSalesForm.AfterSaleResponsibilities.forEach(item => {
        num += Number(item.Proportion);
      });
      return num !== 100;
    },
    // 余额退款的最大值限制
    RefundBalanceChange() {
      const maxNum = this.dataInfo.Order.SurplusOrderBalance
      + (this.HandlingAfterSalesForm.Solution.RefundFreightType === 1 ? this.dataInfo.Order.SurplusFreightAmount : 0);
      if (this.HandlingAfterSalesForm.Solution.RefundBalance > maxNum) {
        this.HandlingAfterSalesForm.Solution.RefundBalance = maxNum;
      }
      this.RefundFreightAmountChange();
    },
    // 印豆退款的最大值限制
    RefundPrintBeanChange() {
      const maxNum = this.dataInfo.Order.SurplusOrderPrintBean
      + (this.HandlingAfterSalesForm.Solution.RefundFreightType === 3 ? this.dataInfo.Order.SurplusFreightPrintBean : 0);
      if (this.HandlingAfterSalesForm.Solution.RefundPrintBean > maxNum) {
        this.HandlingAfterSalesForm.Solution.RefundPrintBean = maxNum;
      }
      this.RefundFreightAmountChange();
    },
    // 运费改变
    RefundFreightAmountChange() {
      if (this.HandlingAfterSalesForm.Solution.RefundFreightType === 1) {
        if (this.HandlingAfterSalesForm.Solution.RefundFreightAmount > this.dataInfo.Order.SurplusFreightAmount) {
          this.HandlingAfterSalesForm.Solution.RefundFreightAmount = this.dataInfo.Order.SurplusFreightAmount;
        }
      }
      if (this.HandlingAfterSalesForm.Solution.RefundFreightType === 3) {
        if (this.HandlingAfterSalesForm.Solution.RefundFreightAmount > this.dataInfo.Order.SurplusFreightPrintBean) {
          this.HandlingAfterSalesForm.Solution.RefundFreightAmount = this.dataInfo.Order.SurplusFreightPrintBean;
        }
      }
    },
    checkSubmitInfo() {
      if (this.verifyQuestions()) { // 问题验证
        // 提示问题有错误
        this.messageBox.failSingleError('提交失败', '请选择问题并输入备注');
        return false;
      }
      if (this.verifyResponsibilities()) { // 部门验证
        this.messageBox.failSingleError('提交失败', '请选择部门并输入责任比例');
        // 提示责任部门有错误
        return false;
      }
      if (this.responsibilityRatio()) { // 责任比例
        this.messageBox.failSingleError('提交失败', '所有责任部门的责任比例求和应为100%');
        // 提示责任部门有错误
        return false;
      }
      if (!this.HandlingAfterSalesForm.Solution.SolutionTypes.length) { // 解决方案
        this.messageBox.failSingleError('提交失败', '请选择解决方案');
        // 提示解决方案有错误
        return false;
      }
      if (this.HandlingAfterSalesForm.Solution.SolutionTypes.find(it => it === 2)) { // 订单退款
        const { Solution } = this.HandlingAfterSalesForm;

        if (this.RefundBalanceShow || this.RefundPrintBeanShow || this.RefundThirdPartyShow || this.UnpaidReducedAmountShow) {
          let num = 0;
          if (this.RefundBalanceShow) {
            num += Number(Solution.RefundBalance);
          }
          if (this.RefundPrintBeanShow) {
            num += Number(Solution.RefundPrintBean);
          }
          if (this.RefundThirdPartyShow) {
            num += Number(Solution.RefundThirdParty);
          }
          if (this.UnpaidReducedAmountShow) {
            num += Number(Solution.UnpaidReducedAmount);
          }
          if (num === 0) {
            this.messageBox.failSingleError('提交失败', '请输入退款金额');
            return false;
          }
        }

        // console.log(String(Solution.RefundFreightAmount));
        // if (!Solution.RefundFreightAmount && Solution.RefundFreightAmount !== 0) {
        //   this.messageBox.failSingleError('提交失败', '请输入运费退款');
        //   return false;
        // }

        // 退余额
        if (Solution.RefundFreightType === 1
          && (Number(Solution.RefundBalance) - Number(Solution.RefundFreightAmount)).toFixed(2) > this.dataInfo.Order.SurplusOrderBalance
        ) {
          this.messageBox.failSingleError('提交失败', '余额退款金额不能超过支付金额');
          return false;
        }
        if (Solution.RefundFreightType === 1 && Number(Solution.RefundFreightAmount) > Number(Solution.RefundBalance)
        ) {
          this.messageBox.failSingleError('提交失败', '运费退款金额不能超过余额退款金额');
          return false;
        }
        // 退印豆
        if (Solution.RefundFreightType === 3
          && (Number(Solution.RefundPrintBean) - Number(Solution.RefundFreightAmount)).toFixed(2) > this.dataInfo.Order.SurplusOrderPrintBean
        ) {
          this.messageBox.failSingleError('提交失败', '印豆退款数量不能超过支付印豆数量');
          return false;
        }
        if (Solution.RefundFreightType === 3
          && Number(Solution.RefundFreightAmount) > Number(Solution.RefundPrintBean)
        ) {
          this.messageBox.failSingleError('提交失败', '运费退款金额不能超过印豆退款数量');
          return false;
        }
        // 退扫码
        if (Solution.RefundFreightType === 2 && Solution.RefundThirdParty > this.dataInfo.Order.SurplusOrderThirdParty
        ) {
          this.messageBox.failSingleError('提交失败', '退到扫码账户金额不能超过扫码支付金额');
          return false;
        }
        if (Solution.RefundFreightType === 2
          && Number(Solution.RefundFreightAmount) > Number(Solution.RefundThirdParty)
        ) {
          this.messageBox.failSingleError('提交失败', '运费退款金额不能超过退到扫码账户金额');
          return false;
        }
      }
      if (this.HandlingAfterSalesForm.Solution.SolutionTypes.find(it => it === 7)) { // 补印
        if (!this.HandlingAfterSalesForm.Solution.KindCount) {
          this.messageBox.failSingleError('提交失败', '请输入补印款数');
          return false;
        }
        if (!this.HandlingAfterSalesForm.Solution.Number) {
          this.messageBox.failSingleError('提交失败', '请输入补印数量');
          return false;
        }
        if (this.ReprintIsUpload && !this.HandlingAfterSalesForm.Solution.FileName) {
          this.messageBox.failSingleError('提交失败', '请上传补印文件');
          return false;
        }
      }
      if (this.HandlingAfterSalesForm.Solution.SolutionTypes.find(it => it === 8)) { // 优惠券
        if (!this.HandlingAfterSalesForm.Solution.CouponList || !this.HandlingAfterSalesForm.Solution.CouponList.length) {
          this.messageBox.failSingleError('提交失败', '请选择优惠券');
          return false;
        }
      }
      if (!this.HandlingAfterSalesForm.Solution.Opinion) {
        this.messageBox.failSingleError('提交失败', '请输入处理意见');
        return false;
      }
      if (!this.HandlingAfterSalesForm.LossAmount) {
        this.messageBox.failSingleError('提交失败', '请输入损失金额');
        return false;
      }
      return true;
    },
    CompleteSave(temp, IsSave) {
      this.api.getComplete(temp).then(resp => {
        if (resp.data.Status === 1000 || resp.data.Status === 1100) {
          const cb = () => {
            if (IsSave) {
              this.handleClose();
              if (this.dataInfo.AfterSale.Status === 0) {
                this.$emit('changeStatus');
              }
            } else {
              this.$emit('successSubmit');
            }
          };
          // 保存/提交成功
          this.messageBox.successSingle(IsSave ? '保存成功' : '提交成功', cb, cb);
        }
      });
    },
    async submitServiceOrder(IsSave) {
      this.HandlingAfterSalesForm.IsSave = IsSave;
      this.HandlingAfterSalesForm.AfterSaleCode = this.paramsData.AfterSaleCode;
      this.HandlingAfterSalesForm.SolutionQuestionPicList = this.serviceImgList;
      const temp = JSON.parse(JSON.stringify(this.HandlingAfterSalesForm));
      temp.AfterSaleQuestions = temp.AfterSaleQuestions.filter(it => it.FirstQuestionType || it.SecondQuestionType || it.Remark);
      temp.AfterSaleResponsibilities = temp.AfterSaleResponsibilities.filter(it => it.Department || (it.Proportion === 0 || !!it.Proportion));
      const cb = () => {
        if (!this.ReprintFile || !this.HandlingAfterSalesForm.Solution.IsNewUpFile) {
          this.CompleteSave(temp, IsSave);
        } else {
          const { file, uniqueName } = this.ReprintFile;
          // 先上传文件
          breakPointUpload(file, uniqueName, (res) => {
            this.ReprintFilePercentage = Math.round(res);
          }).then(res => {
            if (!res.status) return;
            // 文件上传成功
            this.CompleteSave(temp, IsSave);
          });
        }
      };
      if (IsSave) {
        // 保存
        cb();
      } else {
        if (!this.checkSubmitInfo()) return;
        this.messageBox.warnCancelMsgSM('售后单提交之后立即执行无法更改，请谨慎操作!', cb);
      }
    },
    handleDel(i) {
      if (i < this.HandlingAfterSalesForm.PassQuestionPicList.length) {
        this.HandlingAfterSalesForm.PassQuestionPicList.splice(i, 1);
      } else {
        this.serviceImgList.splice(i - this.HandlingAfterSalesForm.PassQuestionPicList.length, 1);
      }
    },
    async getOldQuestion() {
      const res = await this.api.getQuestionList();
      if (res.data.Status === 1000) {
        this.oldQuestionType.forEach(element => {
          let pushData = null;
          pushData = res.data.Data.find(it => it.ID === element.FirstQuestionType);
          if (pushData) {
            const t = this.QuestionTypeList.find(it => it.ID === pushData.ID);
            if (t) {
              t.SonClassList = [...t.SonClassList, res.data.Data.find(it => it.ID === element.SecondQuestionType)].filter(it => it);
            } else {
              pushData.SonClassList = [res.data.Data.find(it => it.ID === element.SecondQuestionType)].filter(it => it);
              this.QuestionTypeList = [pushData, ...this.QuestionTypeList];
            }
          }
        });
      }
    },
    async getQuestionTypeList() {
      // 获取所有问题
      // const res = await this.api.getQuestionList();
      const res = await this.api.getOrderAfterSaleQuestionClassList({ searchType: 1, ID: this.paramsData.ProductID });
      if (res.data.Status === 1000) {
        this.QuestionTypeList = res.data.Data;
      }
    },
    // 一级问题改变
    changeQuestions(index) {
      this.HandlingAfterSalesForm.AfterSaleQuestions[index].SecondQuestionType = '';
      this.HandlingAfterSalesForm.AfterSaleQuestions[index].Version = 2;
    },
    // 包裹选择
    SelectionPackageChange(val) {
      this.HandlingAfterSalesForm.AfterSalePackages = val.map(res => ({
        AfterSaleCode: this.paramsData?.AfterSaleCode,
        PackageID: res.ID,
      }));
    },
    // 获取包裹列表
    async getPackageListByOrderID(orderId) {
      const res = await this.api.getPackagesByOrderID(orderId);
      if (res.data.Status === 1000) {
        this.OrderPackageListTableData = res.data.Data;
      }
    },

    async getSaveDetailAsyncByAfterSaleCode(afterSaleCode) {
      this.setFrom();
      this.onQuestionsAddClick();
      this.onDepartmentAddClick();
      const res = await this.api.getSaveDetailAsync(afterSaleCode);
      if (res.data.Status === 1000) {
        if (!res.data.Data.afterSaleSuccessInfo) {
          return;
        }
        const { afterSaleSuccessInfo } = res.data.Data;
        afterSaleSuccessInfo.Solution = Object.assign(this.HandlingAfterSalesForm.Solution, afterSaleSuccessInfo.Solution);
        // Object.assign(this.HandlingAfterSalesForm, afterSaleSuccessInfo);
        this.HandlingAfterSalesForm = JSON.parse(JSON.stringify(afterSaleSuccessInfo));
        this.ReprintIsUpload = res.data.Data.ReprintIsUpload;
        // 回显包裹
        // 过滤出保存的包裹id对应的包裹数据
        this.AfterSalePackages = this.OrderPackageListTableData.BackPackageInfos
          .filter(TableDataItem => this.HandlingAfterSalesForm.AfterSalePackages
            .some(Packages => TableDataItem.ID === Packages.PackageID));
        // 回显问题
        // this.HandlingAfterSalesForm.AfterSaleQuestions = afterSaleSuccessInfo.AfterSaleQuestions.map((it, i) => {
        //   const _it = it;
        //   const temp = this.QuestionTypeList.filter(item => item.ID === _it.SecondQuestionType);
        //   _it.FirstQuestionType = temp[0]?.ParentID;
        //   _it.key = new Date().getTime() + i;
        //   return _it;
        // });
        // 回显部门
        this.HandlingAfterSalesForm.AfterSaleResponsibilities = afterSaleSuccessInfo.AfterSaleResponsibilities.map((it, i) => {
          const _it = it;
          _it.key = new Date().getTime() + i;
          return _it;
        });
        // 回显优惠券
        // 思路：把选中的标记 手动调用一下选择优惠券确定
        if (afterSaleSuccessInfo.Solution.CouponList && afterSaleSuccessInfo.Solution.CouponList.length) {
          this.handleCouponDialogOpen(afterSaleSuccessInfo.Solution.CouponList);
        }
        // 回显图片
        this.serviceImgList = this.HandlingAfterSalesForm.SolutionQuestionPicList || [];
        this.serviceImgList2Upload = this.HandlingAfterSalesForm.SolutionQuestionPicList;
        // 如果为空添加一行
        if (this.HandlingAfterSalesForm.AfterSaleQuestions.length === 0) {
          this.onQuestionsAddClick();
        }
        if (this.HandlingAfterSalesForm.AfterSaleResponsibilities.length === 0) {
          this.onDepartmentAddClick();
        }
        if (!this.HandlingAfterSalesForm.Solution.RefundFreightType) {
          if (this.RefundBalanceShow) {
            this.HandlingAfterSalesForm.Solution.RefundFreightType = 1;
          } else if (this.RefundPrintBeanShow) {
            this.HandlingAfterSalesForm.Solution.RefundFreightType = 3;
          } else if (this.RefundThirdPartyShow) {
            this.HandlingAfterSalesForm.Solution.RefundFreightType = 2;
          }
        }
      }

      this.oldQuestionType = [];
      this.HandlingAfterSalesForm.AfterSaleQuestions.forEach(element => {
        if (element.Version === 1 && !this.oldQuestionType
          .find(it => it.FirstQuestionType === element.FirstQuestionType && it.SecondQuestionType === element.SecondQuestionType)) {
          this.oldQuestionType.push({ ...element });
        }
      });
      if (this.oldQuestionType.length) {
        this.getOldQuestion();
      }
    },
  },
  watch: {
    visible(newVal) {
      if (!newVal) return;
      Promise.all([this.getPackageListByOrderID(this.paramsData?.OrderID), this.getQuestionTypeList()]).then(() => {
        // 需要用到问题父级id
        this.getSaveDetailAsyncByAfterSaleCode(this.paramsData?.AfterSaleCode);
      });
      // 获取部门
      this.$store.dispatch('common/getAfterSalesDepartmentList');
    },
    'HandlingAfterSalesForm.Solution.RefundFreightType': {
      handler(newVal) {
        if (newVal !== 1) {
          this.RefundBalanceChange();
        }
        if (newVal !== 3) {
          this.RefundPrintBeanChange();
        }
      },
    },
  },
  beforeDestroy() {
    this.$router.push({ query: {} });
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.dialog-to-order-service-box{

  &.dialogexecutedialogcomp {
    height: 800px;
    position: relative;
    .el-dialog--center .el-dialog__body{
      text-align: left;
    }

    .el-dialog__header > span::before {
      background: url(../../assets/images/service.png) no-repeat center;
    }

    .el-dialog__body {
      box-sizing: border-box;
      height: 695px;
      padding: 0%;
      padding-top: 20px;
      > section {
        margin-left: 20px;
        width: 960px;
        box-sizing: border-box;
        &.question-photo {
          display: flex;
          height: 90px;
          align-items: center;
          box-shadow: 0px 3px 10px 0px rgba(98, 98, 98, 0.2);
          border-radius: 5px;
          border: solid 1px $--border-color-light;
          > header {
            text-align: left;
            height: 100%;
            width: 85px;
            padding-top: 16px;
            box-sizing: border-box;
            > div {
              margin: 0 auto;
            }
          }
          > main {
            // padding-top: 8px;
            // margin-bottom: 20px;
            padding-left: 20px;
            display: flex;
            height: 100%;
            // padding-right: 10px;
            flex: 1;
            .submit-img-box{
              display: flex;
              flex-direction: column;
              margin-right: 32px;
              padding-top: 8px;
                .el-button {
                  width: 100px;
                  height: 25px;
                  line-height: 25px;
                  padding: 0;
                  margin: 14px 0 16px 0;
                }
                .el-upload-list{
                  height: 0;
                  display: none;
                  overflow: hidden;
                }
              // .upload-btn{
              //   margin: 14px 0 16px 0;
              // }
              .explain {
                font-size: 12px;
                color: $--color-text-table-time;
              }
            }
            .mp-service-imglist-display-wrap{
              max-width: 578px;
              display: flex;
              height: 100%;
              overflow-x: auto;
              overflow-y: none;
              align-items: flex-start;
              .img-list{
                display: flex;
                height: 50px;
                padding-top: 19px;
                // display: none;
                padding-bottom: 2px;
                .img-tips{
                  width: 8em;
                  line-height: 50px;
                }
              }
            }
          }
        }
        &.service-after-sale {
          min-height: 570px;
          max-height: 570px;
          display: flex;
          margin-top: 20px;
          box-shadow: 0px 3px 10px 0px rgba(98, 98, 98, 0.2);
          border-radius: 5px;
          border: solid 1px $--border-color-light;
          > header {
            // height: 100%;
            width: 85px;
            flex: none;
            > div {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
          > main {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            margin-top: 20px;
            overflow: auto;
            .left-table {
              >.edit-dia-left-table-wrap{
                .has-gutter{
                  >tr{
                    height: 36px;
                  }
                }
              }
            }
            .right-submit-wrap {
              .questions{
                display: flex;
                .left{
                  width:81px;
                  margin-top: 20px;
                  line-height: 30px;
                  text-align: right;
                  font-size: 14px;
                  font-weight: 700;
                }
                .left::before{
                  content: '*';
                  color: #FF3769;
                  margin-right: -3px;
                }
                .right{
                  flex: 1;
                  overflow: auto;
                  margin-top: 20px;
                  font-size: 12px;
                  .row{
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    // margin-left: 15px;
                    >.el-select{
                      margin-right: 20px;
                      border: none;
                      width: 110px;
                      height: 25px;
                    }
                    >.el-input{
                      flex: 1;
                      height: 24px;
                      margin-right: 20px;
                      input{
                        padding-right: 63px;
                        height: 100%;
                      }
                    }
                    > .menus {
                      padding-left: 2px;
                      > span {
                        font-size: 12px;
                        color: #999;
                        margin: 0 13px;
                        transition: color 0.1s ease-in-out;
                        user-select: none;
                        &:not(.disabled){
                          cursor: pointer;
                          &:hover {
                            color: #444;
                          }
                        }
                        > img {
                          vertical-align: bottom;
                          margin-right: 6px;
                        }
                      }
                    }
                  }
                  .row:last-child{
                    margin-bottom: 0;
                  }
                }
              }
              .department{
                display: flex;
                >.left{
                  width:81px;
                  line-height: 30px;
                  text-align: right;
                  margin-top: 20px;
                  font-size: 14px;
                  font-weight: 700;
                }
                >.left::before{
                  content: '*';
                  color: #FF3769;
                  margin-right: -3px;
                }
                >.right{
                  flex: 1;
                  overflow: auto;
                  font-size: 12px;
                  margin-top: 20px;
                  >.row{
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                    // margin-left: 15px;
                    >.el-select{
                      border: none;
                      width: 110px;
                      height: 25px;
                    }
                    >.el-input{
                      height: 24px;
                      width: 120px;
                      margin-right: 20px;
                      margin-left: 15px;
                      .el-input{
                        height: 24px;
                        display: flex;
                      }
                      input{
                        height: 24px;
                        line-height: 24px;
                      }
                    }
                    > .menus {
                      padding-left: 2px;
                      > span {
                        font-size: 12px;
                        color: #999;
                        margin: 0 13px;
                        transition: color 0.1s ease-in-out;
                        user-select: none;
                        &:not(.disabled){
                          cursor: pointer;
                          &:hover {
                            color: #444;
                          }
                        }
                        > img {
                          vertical-align: bottom;
                          margin-right: 6px;
                        }
                      }
                    }
                  }
                  >.row:last-child{
                    margin-bottom: 0;
                  }
                }
              }
              .bottom{
                display: flex;
                margin-top: 15px;
                >.left{
                  min-height: 151px;
                  min-width: 547px;
                }
                .solution{
                  display: flex;
                  .left{
                    width:81px;
                    line-height: 30px;
                    text-align: right;
                    font-size: 14px;
                    font-weight: 700;
                  }
                  .left::before{
                    content: '*';
                    color: #FF3769;
                    margin-right: -3px;
                  }
                  .right{
                    flex: 1;
                    font-size: 12px;
                    .row{
                      display: flex;
                      align-items: center;
                      min-height: 30px;
                      .el-radio-group{
                        .el-radio{
                          font-size: 12px;
                          .el-radio__label{
                            font-size: 12px;
                          }
                        }
                      }
                    }
                  }
                }
                .dispose{
                  display: flex;
                  font-size: 12px;
                  .left{
                    width:81px;
                    line-height: 24px;
                    text-align: right;
                  }
                  .right{
                    flex: 1;
                    min-height: 30px;
                    margin-left: 20px;
                    .row{
                      display: flex;
                      align-items: center;
                      margin-top: 10px;
                      .form-item{
                        display: flex;
                        align-items: center;
                        margin-right: 30px;
                        .select{
                          color: #26BCF9;
                          height: 27px;
                          margin-right: 10px;
                        }

                        .select:hover{
                          cursor:pointer;
                        }
                        .label{
                          text-align: right;
                          line-height: 24px;
                          height: 100%;
                          align-self: start;
                        }
                        .label::before{
                          content: '*';
                          color: #FF3769;
                          margin-right: -3px;
                        }
                        >.conent{
                          // flex: 1;
                          display: flex;
                          align-items: center;
                          .upload-file-box{
                            display: flex;
                            width: 300px;
                            .upload-btn{
                              margin: 0;
                              width: 70px;
                              height: 23px;
                              line-height: 23px;
                              text-align: center;
                            }
                            .file-name-box{
                              margin-left: 20px;
                              padding-right: 20px;
                              line-height: 23px;
                              height: 23px;
                              width: auto;
                              max-width: 150px;
                              text-align: left;
                              overflow: hidden;
                              white-space: nowrap;
                              text-overflow: ellipsis;
                              position: relative;
                              i{
                                display: none;
                                position: absolute;
                                right: 0;
                                line-height: 23px;
                                font-size: 14px;
                                img{
                                  margin-top: 3px;
                                }
                              }
                              i:hover{
                                cursor: pointer;
                              }
                            }
                            .file-name-box:hover{
                              // color: red;
                              i{
                                display: inline-block;
                              }
                            }
                          }
                          >.el-input{
                            height: 24px;
                            width: 120px;
                            margin-right: 10px;
                            input{
                              height: 100%;
                            }
                          }
                          .el-select{
                            margin-top: 0;
                          }
                          >.el-textarea{
                            margin-right: 20px;
                            width: 430px;
                            // height: 56px;
                          }
                          >span{
                            display: inline-block;
                            height: 25px;
                            width: 25px;
                            display: flex;
                            align-items: center;
                            margin-left: 10px;
                            >i{
                              display: inline-block;
                              width: 15px;
                              height: 15px;
                              color: #F4A307;
                              border: 1px solid #F4A307;
                              text-align: center;
                              line-height: 15px;
                              border-radius: 50%;
                            }
                          }
                          > div {
                            display: flex;
                            // margin-left: 10px;
                            margin-top: 3px;
                            max-width: 510px;
                            > span {
                              width: 3em;
                              flex: none;
                              text-align: right;
                              line-height: 18px;
                              color: #999;
                            }
                            > ul {
                              // width: 690px;
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
                              }
                            }
                          }
                          &.selected-coupon{
                            >div{
                              white-space: nowrap;
                              overflow: hidden;
                              text-overflow: ellipsis;
                              >ul{
                                flex: 1;
                                width: 400px;
                              }
                            }
                          }
                        }
                        &.opinion{
                          .el-textarea{
                            textarea{
                              padding-bottom: 13px;
                            }
                            .el-input__count{
                              width: calc(100% - 22px);
                              background: #fff;
                              height: 12px;
                              line-height: 12px;
                              bottom: 1px;
                              text-align: right;
                              right: 20px;
                              padding-bottom: 3px;
                            }
                          }
                        }
                        &.other-remark{
                          .label::before{
                            content: '*';
                            opacity: 0;
                          }
                        }
                      }
                    }
                    .solution-type2{
                      margin-left: -1.8em;
                      .form-item{
                        .label{
                          width: 7.6em;
                        }
                        .label::before{
                          content: '';
                          color: #FF3769;
                          margin-right: -3px;
                        }
                      }
                    }
                  }
                }
                >.right{
                  flex: 1;
                  padding-left: 30px;
                  border-left: 1px dashed #EEEEEE;
                  margin-top: 10px;
                  display: flex;
                  flex-direction: column;
                  // justify-content: space-between;
                  font-size: 12px;
                  color: #444444;
                  >p {
                    margin-bottom: 15px;
                    display: flex;
                    // .label{
                    //   width: 7em;
                    // }
                  };
                  .red{
                    color: #DF3963;
                  }
                  .tint{
                    color: #989898;
                  }
                }
              }
            }
          }
        }
      }
    }

    .el-dialog__footer {
      padding: 15px 20px 14px 20px;
      .dialog-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .loss-box {
          margin-left: 112px;
          font-size: 12px;
          > .title{
            font-weight: 600;
            >i{
              color: #FF3769;
            }
          }
          > input{
              width: 130px;
              height: 24px;
              box-sizing: border-box;
              border:1px solid $--border-color-base;
              margin-right: 8px;
              outline: none;
              padding:0 5px;
              &::-webkit-input-placeholder{
                color: $--color-text-secondary;
                font-size: 12px;
                text-align: left;
              }
          }
          > span:last-of-type{
            color: $--color-text-table-time;
          }
        }
        .btns{
          position: relative;
          top: 5px;
          display: flex;

          button {
            width: 120px;
            height: 29px;
            border-radius: 2px;
            margin-left: 30px;
            &:first-of-type {
              margin-left: 30px;
            }
            &.normal-full-btn{
              margin-left: 30px;
              background: linear-gradient(
                to right,
                $--color-primary,
                $--color-primary-light
              );
              border: none;
              position: relative;
              top: 0px;
            }
          }
          .white {
            background: #fff;
            border: 1px solid $--color-primary;
          }
        }
        // .mask{
        //   position: absolute;
        //   top: 0;
        //   bottom: 0;
        //   left: 0;
        //   right: 0;
        //   background-color: rgba(255, 255, 255, 0.1);
        // }
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
  }
}
</style>
