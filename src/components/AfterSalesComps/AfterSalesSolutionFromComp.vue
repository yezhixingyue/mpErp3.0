<template>
  <section class="after-sales-solution-from-comp">
    <header class="title is-bold">解决方案</header>
    <ul>
      <li v-if="!consent">
        <span class="value">
          <el-radio-group v-model="resultRadio">
            <el-radio :label="3">驳回申请</el-radio>
            <el-radio :label="6">同意售后</el-radio>
          </el-radio-group>
        </span>
      </li>
      <li v-if="resultRadio === 3">
        <span class="label is-bold">驳回原因：</span><span class="value">
          <el-input
            type="textarea"
            :autosize="{minRows: 4, maxRows: 4}"
            placeholder="请输入内容"
            v-model="CompleteFrom.RejectReason">
          </el-input>
        </span>
      </li>
      <template v-if="resultRadio === 6">
        <li>
          <span class="label is-bold">解决方案：</span><span class="value">
            <el-radio-group v-model="SolutionTypes">
              <el-radio :label="2">退款</el-radio>
              <el-radio :label="7">补印</el-radio>
              <el-radio :label="8">赠送优惠券</el-radio>
            </el-radio-group>
          </span>
        </li>
        <template v-if="SolutionTypes !== 8">
          <li>
            <span class="label is-bold">选择包裹：</span><span class="value">
              <el-table v-if="PackagesList" ref="selectPackages" stripe border fit :data="PackagesList.BackPackageInfos" style="width: 100%"
              @selection-change="handleSelectionChange" class="ft-14-table">
                <el-table-column
                  type="selection"
                  label="包裹号"
                  width="73">
                </el-table-column>
                <el-table-column prop="ID" label="包裹号" minWidth="123" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="Logistics.BillNo" label="运单号" minWidth="114" show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row.Logistics?.BillNo }}
                    <template v-if="scope.row.Logistics?.BillNo && PackagesList?.PackageBills.filter(it => it.ExpressBillType === 1)
                    .map(it => it.BillNo).length">
                      、
                    </template>
                    <template v-if="PackagesList?.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).length">
                      {{PackagesList?.PackageBills.filter(it => it.ExpressBillType === 1).map(it => it.BillNo).join('、')}}
                    </template>
                  </template></el-table-column>
                <el-table-column prop="ProductAmount" label="产品数量" minWidth="85" show-overflow-tooltip></el-table-column>
                <el-table-column prop="TotalAmount" label="金额" minWidth="57" show-overflow-tooltip></el-table-column>
                <el-table-column prop="UnPaidAmount" label="代收金额" minWidth="84" show-overflow-tooltip></el-table-column>
              </el-table>
            </span>
          </li>
          <li class="form-box" v-if="SolutionTypes === 2">
            <span class="label is-bold">退到余额：</span><span class="value">
              <span>
                <el-input oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]" v-model="CompleteFrom.Solution.RefundBalance" style="width: 80px;"></el-input> 元
              </span>
              <span style="margin-left: 30px;">
                <i class="is-bold">退运费：</i>
                <el-input oninput="value=value.match(/^\d*(\.?\d{0,2})/g)[0]"
                v-model="CompleteFrom.Solution.RefundFreightAmount" style="width: 100px;"></el-input> 元
              </span>
            </span>
          </li>
          <li class="form-box" v-if="SolutionTypes === 7">
            <span class="label is-bold">补印数量：</span><span class="value">
              <span>
                <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="CompleteFrom.Solution.KindCount" style="width: 80px;"></el-input> 款
              </span>
              <span style="margin-left: 30px;">
                <i class="is-bold">每款数量：</i>
                <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="CompleteFrom.Solution.Number" style="width: 100px;"></el-input> 张/款
              </span>
            </span>
          </li>
          <li class="form-box" v-if="SolutionTypes === 7">
            <span class="label is-bold" style="min-width: 5em;"></span><span class="value">
              <FileSelectBtn class="uploadFileBox" accept='*'
              :func="readFileUniqueName" title="上传补印文件" />
              {{fileName}}
            </span>
          </li>
          <li class="form-box">
            <span class="label is-bold" style="min-width: 5em;"></span><span class="value">
              <el-checkbox v-model="CompleteFrom.IsProduceEnd">终止生产</el-checkbox>
              <br/>
              <el-checkbox v-model="CompleteFrom.Solution.CouponIsExtra" style="line-height: 20px;">额外增送优惠券</el-checkbox>
            </span>
          </li>
        </template>
        <li v-if="CompleteFrom.Solution.CouponIsExtra || SolutionTypes === 8">
          <span class="label is-bold">优惠券：</span><span class="value">
            <span @click="SelectCouponClick" style="color: #26BCF9; cursor: pointer;">选择优惠券</span>
            <el-table v-if="selectedCouponList.length" stripe border fit :data="selectedCouponList"
            style="width: 100%; margin-top: 10px" class="ft-14-table coupon-table">
              <el-table-column prop="AfterSaleCode" label="包裹号" minWidth="123" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{scope.row.Data.Amount}}元
                </template>
              </el-table-column>
              <el-table-column prop="OrderID" label="运单号" minWidth="114" show-overflow-tooltip>
                <template slot-scope="scope">
                  满{{scope.row.Data.MinPayAmount}}元使用
                </template>
              </el-table-column>
              <el-table-column prop="CustomerType" label="产品数量" minWidth="85" show-overflow-tooltip>
                <template slot-scope="scope">
                  限产品：{{ (scope.row.ProductString.split('\n') || []).join(' ') }}
                </template>
              </el-table-column>
              <el-table-column prop="CustomerType" label="金额" minWidth="57" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="selectedCouponList[scope.$index].Number"></el-input>张
                </template>
              </el-table-column>
            </el-table>
          </span>
        </li>
        <li class="line">
          <i></i>
          <span>以下内容客户不可见</span>
          <i></i>
        </li>
        <li>
          <span class="label is-bold">
            补充说明：<span class="text">(选填)</span>
          </span><span class="value">
            <el-input
              type="textarea"
              :autosize="{minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="CompleteFrom.Solution.SolutionResultRemark">
            </el-input>
          </span>
        </li>
        <li>
          <span class="label is-bold" style="min-width: 5em;">
          </span><span class="value"> <el-checkbox v-model="CompleteFrom.IsExtraPay " class="is-bold">补充额外支出：</el-checkbox> </span>
        </li>
        <template v-if="CompleteFrom.IsExtraPay">
          <li class="form-box">
            <span class="label is-bold">额外支出：</span><span class="value">
              <span>
                <el-input v-model="CompleteFrom.ExtraPayAmount" style="width: 80px;"></el-input> 元
              </span>
              <span style="margin-left: 30px;">
                <el-checkbox v-model="CompleteFrom.ExtraPayIsShow">支出给客户</el-checkbox>
                <i class="is-gray">（选中时客户可见金额和支出说明）</i>
              </span>
            </span>
          </li>
          <li>
            <span class="label is-bold">
              支出说明：<span class="text">(选填)</span>
            </span>
            <span class="value">
              <el-input v-model="CompleteFrom.ExtraPayRemark" placeholder="请输入内容" size="medium" style="margin-bottom: 10px;"></el-input>
            </span>
          </li>
        </template>
        <li>
          <span class="label is-bold" style="width: 5em;"></span>
          <span class="value">
            <span style="padding-top: 10px;">
              <el-checkbox v-model="CompleteFrom.ResponsibilityIsDivide">划分责任</el-checkbox>
              <i class="is-gray">（可以先不划分，售后完成后3日内可补充。责任确认前可修改）</i>
            </span>
          </span>
        </li>
        <template v-if="CompleteFrom.ResponsibilityIsDivide">
          <li>
            <span class="label is-bold">问题类别：</span><span class="value">
              <span @click="selectProblemTypesClick" style="color: #26BCF9; cursor: pointer;">选择类别</span> <i>
                {{ProblemTypesList.map(it => it.Name).join('、')}}
              </i>
            </span>
          </li>
          <li  class="form-box">
            <span class="label is-bold">责任占比：</span><span class="value input-box" style="display: flex; flex-wrap: wrap">
              <span style="width: 50%;">
                <el-checkbox v-model="ProportionResponsibility.Department1" style="margin-right: 20px;">业务中心</el-checkbox>
                <template v-if="ProportionResponsibility.Department1">
                  所占责任：
                  <el-input oninput="value=value.replace(/[^\d]/g,'')"
                   v-model="ProportionResponsibility.DepartmentProportion1" size="medium" style="width: 50px;"></el-input> %
                </template>
              </span>
              <span style="width: 50%;">
                <el-checkbox v-model="ProportionResponsibility.Department2" style="margin-right: 20px;">中央工厂</el-checkbox>
                <template v-if="ProportionResponsibility.Department2">
                  所占责任：
                  <el-input oninput="value=value.replace(/[^\d]/g,'')"
                   v-model="ProportionResponsibility.DepartmentProportion2" size="medium" style="width: 50px;"></el-input> %
                </template>
              </span>
              <span style="width: 50%;">
                <el-checkbox v-model="ProportionResponsibility.Department3" style="margin-right: 20px;">物流中心</el-checkbox>
                <template v-if="ProportionResponsibility.Department3">
                  所占责任：
                  <el-input oninput="value=value.replace(/[^\d]/g,'')"
                  v-model="ProportionResponsibility.DepartmentProportion3" size="medium" style="width: 50px;"></el-input> %
                </template>
              </span>
              <span style="width: 50%;">
                <el-checkbox v-model="ProportionResponsibility.Department4" style="margin-right: 20px;">配送中心</el-checkbox>
                <template v-if="ProportionResponsibility.Department4">
                  所占责任：
                  <el-input oninput="value=value.replace(/[^\d]/g,'')"
                  v-model="ProportionResponsibility.DepartmentProportion4" size="medium" style="width: 50px;"></el-input> %
                </template>
              </span>
            </span>
          </li>
        </template>
      </template>
    </ul>
    <AfterSalesProblemTypesDialog @select="ProblemTypesSelect" :ProblemTypesVisible.sync="ProblemTypesVisible"
    @close="() => ProblemTypesVisible = false" :selectKeys="ProblemTypesList"/>
    <CommonDialogComp
      width="600px"
      top='15vh'
      title="选择优惠券:"
      :visible="dialogVisible"
      cancelText='取消'
      @cancle="dialogVisible = false"
      @closed='dialogVisible = false'
      @submit="onSelectCouponClick"
      class="mp-erp-select-coupon-dialog-comp-wrap"
    >
      <div class="coupon-dialog-content">
        <p v-if="couponList.length === 0" style="letter-spacing:1px" class="is-pink is-font-size-12 tips-box">
          <i class="el-icon-warning"></i> 暂无可用优惠券！{{couponList}}</p>
        <ul v-else>
          <li v-for="it in couponList" :key="it.CouponID">
            <el-checkbox v-model="it.checked" class="mp-mini-checkbox">
              <span class="is-pink">{{it.Data.Amount}}元</span>
              <span class="MinPayAmount"> 满{{it.Data.MinPayAmount}}元使用</span>
              <i> - </i>
              <el-tooltip placement="top-start" :enterable='false'>
                <div slot="content">
                  <p v-for="(item, i) in it.ProductString.split('\n') || []" :key="item + '---' + i">
                    {{ item }}
                  </p>
                </div>
                <span class="area-span">限产品：{{ (it.ProductString.split('\n') || []).join(' ') }}</span>
              </el-tooltip>
            </el-checkbox>
          </li>
        </ul>
      </div>
      <template slot="footer">
        <span class="dialog-footer">
          <el-button type="primary" :disabled='couponList.length === 0' @click="onSelectCouponClick(false)">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </template>
    </CommonDialogComp>

    <SuspendDialogComp :visible="SuspendVisible" @cloce="SuspendVisible = false"
     @submit="SuspendSubmit"></SuspendDialogComp>

    <HandOnDialogComp :visible="HandOnVisible" @cloce="emitVisible('HandOnVisible')"
    @submit="HandOnSubmit"></HandOnDialogComp>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import FileSelectBtn from '@/packages/FileSelectComp/src/FileSelectBtn';
import CommonDialogComp from '@/packages/CommonDialogComp';
import AfterSalesProblemTypesDialog from '@/components/AfterSalesComps/AfterSalesProblemTypesDialog.vue';
import SuspendDialogComp from '@/components/AfterSalesComps/SuspendDialogComp.vue';
import HandOnDialogComp from '@/components/AfterSalesComps/HandOnDialogComp.vue';
import { breakPointUpload, getUniqueFileName } from '@/basic/BreakpointUpload';

export default {
  props: {
    PackagesList: {
      type: Object,
      default: () => (null),
    },
    appealData: {
      type: Object,
      default: () => null,
    },
    OrderID: {
      type: Number,
      default: () => 0,
    },
    consent: { // 是否同意售后 用于代客售后
      type: Boolean,
      default: false,
    },
    // 是否代客
    Source: {
      type: Boolean,
      default: false,
    },
    HandOnVisible: {
      type: Boolean,
      default: false,
    },
    AfterSaleCode: {
      type: Number,
      default: 0,
    },
  },

  components: {
    CommonDialogComp,
    AfterSalesProblemTypesDialog,
    SuspendDialogComp,
    HandOnDialogComp,
    FileSelectBtn,
  },
  computed: {
    ...mapState('common', ['userTypeList']),
    ...mapState('AfterSale', ['QuestionClassList']),
    resultRadio: {
      get() {
        if (this.CompleteFrom.IsReject === true) {
          return 3;
        }
        if (this.CompleteFrom.IsReject === false) {
          return 6;
        }
        return 1;
      },
      set(val) {
        this.CompleteFrom.IsReject = val === 3;
      },
    },
    SolutionTypes: {
      get() {
        return this.CompleteFrom.Solution.SolutionTypes[0];
      },
      set(val) {
        this.CompleteFrom.Solution.SolutionTypes = [val];
      },
    },
    fileName() {
      return this.CompleteFrom.Solution.FileName ? this.CompleteFrom.Solution.FileName : '请上传文件';
    },
  },
  data() {
    return {
      // 补印文件
      ReprintFile: null,
      // 上传进度
      ReprintFilePercentage: 0,
      SuspendVisible: false,

      ProportionResponsibility: {
        Department1: false,
        DepartmentProportion1: '',
        Department2: false,
        DepartmentProportion2: '',
        Department3: false,
        DepartmentProportion3: '',
        Department4: false,
        DepartmentProportion4: '',
      },
      dialogVisible: false,
      couponList: [],
      selectedCouponList: [],
      ProblemTypesVisible: false,
      ProblemTypesList: [],
      CompleteFrom: {
        OrderID: 0,
        IsReject: '',
        RejectReason: '',
        IsExtraPay: false,
        ExtraPayAmount: '',
        ExtraPayRemark: '',
        ExtraPayIsShow: false,
        AfterSaleCode: 0,
        SupplementalQuestionPics: [
          '',
        ],
        ResponsibilityIsDivide: false,
        AfterSaleQuestions: [
          // {
          //   FirstQuestionType: 0,
          //   SecondQuestionType: 0,
          //   Remark: '',
          //   Version: 1,
          //   QuestionTitle: '',
          // },
        ],
        AfterSaleResponsibilities: [],
        AfterSalePackages: [
          // {
          //   PackageID: 0,
          // },
        ],
        Solution: {
          SolutionTypes: [],
          KindCount: '',
          Number: '',
          UniqueName: '',
          FileName: '',
          IsFileInLan: true,
          IsNewUpFile: true,
          CouponIsExtra: false,
          Coupons: [
            // {
            //   CouponID: '00000000-0000-0000-0000-000000000000',
            //   Number: 0,
            // },
          ],
          SolutionResultRemark: '',
          RefundFreightAmount: '',
          RefundFreightType: 1,
          RefundBalance: '',
          RefundThirdParty: 0,
          RefundPrintBean: 0,
          UnpaidReducedAmount: 0,
        },
        IsProduceEnd: false,
        Source: 2,
        ChannelType: 0,
        QuestionTypes: [],
        QuestionPics: [],
      },
    };
  },
  methods: {
    ...mapActions('AfterSale', ['getOrderAfterSaleQuestionClassList']),
    // 选择上传的文件
    readFileUniqueName(file) {
      // 上传成功后，设置文件名称, 文件唯一标识 getUniqueFileName
      if (!file) return;
      const CustomerID = this.dataInfo?.Order?.CustomerID || '';
      const uniqueName = getUniqueFileName({ file, Terminal: 1, CustomerID });
      this.ReprintFile = { file, uniqueName };
      this.CompleteFrom.Solution.UniqueName = uniqueName;
      this.CompleteFrom.Solution.FileName = file.name;
      this.CompleteFrom.Solution.IsNewUpFile = true;
    },
    // 上传文件
    uploadFile(cb) {
      const { file, uniqueName } = this.ReprintFile;
      // 先上传文件
      breakPointUpload(file, uniqueName, (res) => {
        this.ReprintFilePercentage = Math.round(res);
      }).then(res => {
        if (!res.status) return;
        // 文件上传成功
        cb();
      });
    },
    onGoBackClick() {
      this.$goback();
    },
    formValidator() {
      console.log(this.SolutionTypes);
      if (this.resultRadio === '') {
        this.messageBox.failSingleError('操作失败', '请选择解决方案');
        return false;
      }
      if (this.resultRadio === 3 && !this.CompleteFrom.RejectReason) {
        this.messageBox.failSingleError('操作失败', '请输入驳回原因');
        return false;
      }
      if (this.resultRadio === 6) {
        if (this.resultRadio === 6 && !this.SolutionTypes) {
          this.messageBox.failSingleError('操作失败', '请选择解决方案');
          return false;
        }
        if (this.SolutionTypes === 2 && !this.CompleteFrom.Solution.RefundBalance) {
          this.messageBox.failSingleError('操作失败', '请输入退款金额');
          return false;
        }
        if (this.SolutionTypes === 7 && !this.CompleteFrom.Solution.KindCount) {
          this.messageBox.failSingleError('操作失败', '请输入补印数量');
          return false;
        }
        if (this.SolutionTypes === 7 && !this.CompleteFrom.Solution.Number) {
          this.messageBox.failSingleError('操作失败', '请输入每款数量');
          return false;
        }
        if (this.SolutionTypes === 7 && !this.CompleteFrom.Solution.FileName) {
          this.messageBox.failSingleError('操作失败', '请上传补印文件');
          return false;
        }
        if ((this.SolutionTypes === 8 || this.CompleteFrom.Solution.CouponIsExtra) && !this.selectedCouponList.length) {
          this.messageBox.failSingleError('操作失败', '请选择优惠券');
          return false;
        }
        if (!this.setCoupons()) {
          this.messageBox.failSingleError('操作失败', '请输入优惠券数量');
          return false;
        }
        if (this.CompleteFrom.IsExtraPay && !this.CompleteFrom.ExtraPayAmount) {
          this.messageBox.failSingleError('操作失败', '请输入额外支出');
          return false;
        }
        if (this.CompleteFrom.ResponsibilityIsDivide && !this.ProblemTypesList.length) {
          this.messageBox.failSingleError('操作失败', '请选择问题类别');
          return false;
        }
        if (this.CompleteFrom.ResponsibilityIsDivide && !this.setResponsibility()) {
          this.messageBox.failSingleError('操作失败', '责任占比总和需为100');
          return false;
        }
      }
      return true;
    },
    getQuestionClassList() {
      if (this.QuestionClassList.length === 0) {
        this.getOrderAfterSaleQuestionClassList({ searchType: 2 });
      }
    },
    // 设置划分责任的数据
    setResponsibility() {
      const Responsibilities = [];
      const setResponsibilities = (key, value) => {
        Responsibilities.push({
          Department: key,
          Proportion: value,
          ConfirmerName: '',
          ConfirmTime: '',
        });
      };
      let num = 0;
      if (this.ProportionResponsibility.Department1) {
        num += Number(this.ProportionResponsibility.DepartmentProportion1);
        setResponsibilities(1, Number(this.ProportionResponsibility.DepartmentProportion1));
      }
      if (this.ProportionResponsibility.Department2) {
        num += Number(this.ProportionResponsibility.DepartmentProportion2);
        setResponsibilities(2, Number(this.ProportionResponsibility.DepartmentProportion2));
      }
      if (this.ProportionResponsibility.Department3) {
        num += Number(this.ProportionResponsibility.DepartmentProportion3);
        setResponsibilities(3, Number(this.ProportionResponsibility.DepartmentProportion3));
      }
      if (this.ProportionResponsibility.Department4) {
        num += Number(this.ProportionResponsibility.DepartmentProportion4);
        setResponsibilities(4, Number(this.ProportionResponsibility.DepartmentProportion4));
      }
      this.CompleteFrom.AfterSaleResponsibilities = Responsibilities;
      if (num === 100) {
        return true;
      }
      return false;
    },
    setCoupons() {
      const temp = [];
      let bool = true;
      this.selectedCouponList.forEach(it => {
        if (!it.Number) {
          bool = false;
          return;
        }
        temp.push({
          CouponID: it.CouponID,
          Number: it.Number,
        });
      });
      this.CompleteFrom.Solution.Coupons = temp;
      if (bool) {
        return bool;
      }
      return bool;
    },
    emitVisible(key) {
      this.$emit('changeVisible', key);
    },
    onSuspendClick(data) {
      // if (!this.formValidator()) return;
      this.setResponsibility();
      this.setCoupons();
      if (data) {
        this.CompleteFrom.QuestionTypes = data.QuestionTypes;
        this.CompleteFrom.QuestionPics = data.QuestionPics;
      }
      this.SuspendVisible = true;
    },
    SuspendSubmit(value) { // 挂起
      this.CompleteFrom.OrderID = this.OrderID;
      const temp = { ...value, ...this.CompleteFrom };
      const cb = async () => {
        const resp = await this.api.getOrderAfterSaleHang(temp).catch(() => {});
        if (resp && resp.data.Status === 1000) {
          this.SuspendVisible = false;
          this.messageBox.successSingle('挂起成功', this.onGoBackClick, this.onGoBackClick);
        }
      };
      if (this.ReprintFile && this.CompleteFrom.Solution.IsNewUpFile) {
        this.uploadFile(cb);
      } else {
        cb();
      }
    },
    async HandOnSubmit(value) {
      const temp = { ...value };
      temp.AfterSaleCode = this.AfterSaleCode;
      const resp = await this.api.getOrderAfterSaleTransfer(temp).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        this.emitVisible();
      }
    },
    handleSelectionChange(Selection) {
      this.CompleteFrom.AfterSalePackages = Selection.map(it => ({
        PackageID: it.ID,
      }));
    },
    ProblemTypesSelect(list) {
      this.ProblemTypesList = list;
      this.CompleteFrom.AfterSaleQuestions = list.map(it => ({
        FirstQuestionType: it.ParentID,
        SecondQuestionType: it.ID,
        Remark: '',
        Version: 3,
        QuestionTitle: it.Name,
      }));
    },
    selectProblemTypesClick() {
      this.ProblemTypesVisible = true;
    },
    SelectCouponClick() {
      this.dialogVisible = true;
    },
    // 优惠劵确定
    onSelectCouponClick() {
      const list = this.couponList.filter(it => it.checked); // CouponNumber
      if (list.length === 0) {
        this.messageBox.failSingleError('操作失败', '未选中优惠券');
        return;
      }
      this.selectedCouponList = list.map(it => ({ ...it }));
      this.dialogVisible = false;
    },
    // 选择优惠卷的弹窗
    async getCouponList() {
      const resp = await this.api.getCouponList({ ProvideStatus: 1, FieldType: 1, ReceiveNumber: 1 }).catch(() => {});
      if (resp && resp.data.Status === 1000) {
        this.couponList = resp.data.Data.map(it => ({
          ...it,
          checked: false,
        }));
      }
    },
    async submit(data) {
      // console.log(this.formValidator());
      if (!this.formValidator()) return;
      this.messageBox.warnCancelBox('执行售后', '确定要提交所有数据吗？提交后不可修改！', () => {
        // this.setCoupons();
        const cb = async () => {
          if (data) {
            this.CompleteFrom.QuestionTypes = data.QuestionTypes;
            this.CompleteFrom.QuestionPics = data.QuestionPics;
          }
          const resp = await this.api.getComplete(this.CompleteFrom).catch(() => {});
          if (resp && resp.data.Status === 1000) {
            if (this.CompleteFrom.IsReject) {
              this.messageBox.successSingle('您已驳回售后', this.onGoBackClick, this.onGoBackClick);
            } else {
              this.messageBox.successSingle('售后成功', this.onGoBackClick, this.onGoBackClick);
            }
          }
        };
        if (this.ReprintFile && this.CompleteFrom.Solution.IsNewUpFile) {
          this.uploadFile(cb);
        } else {
          cb();
        }
      });
    },
    async backResponsibilities() {
      this.CompleteFrom.AfterSaleResponsibilities.forEach(it => {
        this.ProportionResponsibility[`Department${it.Department}`] = true;
        this.ProportionResponsibility[`DepartmentProportion${it.Department}`] = it.Proportion;
      });
    },
    async backCoupon() {
      console.log(this.couponList);
      this.couponList = this.couponList.map(it => {
        const temp = this.CompleteFrom.Solution.Coupons.find(Coupon => Coupon.CouponID === it.CouponID);
        return {
          ...it,
          checked: !!temp,
          Number: temp ? temp.Number : '',
        };
      });
      this.onSelectCouponClick();
    },
    async backQuestionClass() {
      this.ProblemTypesList = this.CompleteFrom.AfterSaleQuestions.map(it => {
        const lv1QuestionClass = this.QuestionClassList.find(lv1Question => lv1Question.ID === it.FirstQuestionType);
        return {
          ParentID: it.FirstQuestionType,
          ParentName: lv1QuestionClass?.Name,
          ID: it.SecondQuestionType,
          Name: lv1QuestionClass?.SonClassList.find(Son => Son.ID === it.SecondQuestionType)?.Name,
        };
      });
    },
    setSubmitData() {
      this.CompleteFrom.IsReject = this.appealData.IsReject;
      this.CompleteFrom.IsProduceEnd = this.appealData.IsProduceEnd;
      this.CompleteFrom.IsExtraPay = this.appealData.IsExtraPay;
      this.CompleteFrom.ExtraPayAmount = this.appealData.ExtraPayAmount;
      this.CompleteFrom.ExtraPayIsShow = this.appealData.ExtraPayIsShow;
      this.CompleteFrom.ExtraPayRemark = this.appealData.ExtraPayRemark;
      this.CompleteFrom.ResponsibilityIsDivide = this.appealData.ResponsibilityIsDivide;
      this.CompleteFrom.RejectReason = this.appealData.RejectReason;
      this.CompleteFrom.AfterSalePackages = this.appealData.AfterSalePackages;

      this.CompleteFrom.AfterSalePackages.forEach(it => {
        const temp = this.PackagesList.BackPackageInfos.find(Package => Package.ID === it.PackageID);
        setTimeout(() => {
          if (temp) this.$refs.selectPackages.toggleRowSelection(temp);
        }, 100);
      });

      this.CompleteFrom.AfterSaleQuestions = this.appealData.AfterSaleQuestions;
      if (this.CompleteFrom.AfterSaleQuestions.length) this.backQuestionClass();

      this.CompleteFrom.AfterSaleResponsibilities = this.appealData.AfterSaleResponsibilities;
      if (this.CompleteFrom.AfterSaleResponsibilities.length) this.backResponsibilities();

      this.CompleteFrom.Solution.SolutionTypes = this.appealData.Solution.SolutionTypes;
      this.CompleteFrom.Solution.RefundBalance = this.appealData.Solution.RefundBalance;
      this.CompleteFrom.Solution.RefundFreightAmount = this.appealData.Solution.RefundFreightAmount;
      this.CompleteFrom.Solution.KindCount = this.appealData.Solution.KindCount;
      this.CompleteFrom.Solution.Number = this.appealData.Solution.Number;
      this.CompleteFrom.Solution.CouponIsExtra = this.appealData.Solution.CouponIsExtra;
      this.CompleteFrom.Solution.SolutionResultRemark = this.appealData.Solution.SolutionResultRemark;
      this.CompleteFrom.Solution.Coupons = this.appealData.Solution.Coupons || [];
      if (this.CompleteFrom.Solution.Coupons.length) this.backCoupon();

      this.CompleteFrom.Solution.FileName = this.appealData.Solution.FileName;
    },
  },
  mounted() {
    this.CompleteFrom.AfterSaleCode = this.AfterSaleCode;
    this.CompleteFrom.OrderID = this.OrderID;
    Promise.all([this.getCouponList(), this.getQuestionClassList()]).then(() => {
      if (this.appealData && (this.appealData.Status === 25 || this.appealData.Status === 10)) {
        this.setSubmitData();
      }
    });
    if (this.consent) {
      this.resultRadio = 6;
    }
    if (this.Source) {
      this.CompleteFrom.Source = 1;
    }
  },
};
</script>

<style lang='scss'>
.after-sales-solution-from-comp {
  padding-left: 20px;
  min-width: 650px;
  width: 650px;
  box-sizing: border-box;
  padding-right: 30px;
  .el-checkbox{
    .el-checkbox__label{
      font-size: 12px;
      color: #444;
    }
  }
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
      &.line{
        display: flex;
        align-items: center;
        margin: 20px 0;
        span{
          margin: 0 10px;
        }
        i{
          flex: 1;
          border-top: 1px dashed #E5E5E5;
        }
      }
      &.form-box{
        line-height: 35px;
        .el-input, input{
          height: 35px;
        }
      }
      >.label{
        position: relative;
        >.text{
          position: absolute;
          right: 1em;
          top: 15px;
          color: #AEAEAE
        }
      }
      >.value{
        flex: 1;
        .el-table{
          .el-table__header-wrapper thead tr th .cell {
            line-height: 36px;
            font-size: 14px;
          }
          .el-table__fixed-header-wrapper thead tr th .cell {
            line-height: 36px;
            font-size: 14px;
          }
        }
        .coupon-table{
          .el-table__header{
            display: none;
          }
        }
        .uploadFileBox{
          margin-top: 0;
        }
        &.input-box{
          .el-input{
            input{
              padding: 0 10px;
            }
          }
        }
      }
    }
  }
  .mp-erp-select-coupon-dialog-comp-wrap{
    .el-dialog__body{
      padding: 20px 43px;
      padding-bottom: 0;
    }
    .coupon-dialog-content{
      height: 448px;
      li{
        margin-bottom: 20px;
        &:last-child{
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
