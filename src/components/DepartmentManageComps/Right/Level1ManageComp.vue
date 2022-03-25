<template>
  <ul class="mp-erp-basic-set-up-sell-area-set-up-page-right-content-level1-manage-wrap department-manage" ref="oWrap">
    <li v-for="(it, i) in localList" :key="it.ID || it.key">
      <div class="operate-row">
        <el-input v-model="it.ClassName" maxlength="10" size="small" placeholder="在此输入区域名称" :disabled='it.Index === 999' />
        <menu>
          <menuitem @click="onAddClick">
            <img src="@/assets/images/add.png" alt="">
            <span>添加</span>
          </menuitem>
          <menuitem :class="{'is-disabled': childrenLingth(it.ID)}" @click="onRemoveClick(it, i)">
            <img src="@/assets/images/del.png" alt="" v-if="!childrenLingth(it.ID)">
            <img src="@/assets/images/del-disabled.png" alt="" v-else>
            <span>删除</span>
          </menuitem>
        </menu>
        <el-button type="text" @click="zoningButton(it,i)">划分责任区域及产品</el-button>
      </div>
      <el-tooltip class="item" effect="dark" placement="bottom-start">
        <!-- <el-button>上左</el-button> -->
        <div class="text-row">
          关联区域：
          <span v-for="(item, index) in it.SellAreaList" :key="index+'SellArea'">{{getSellAreaText(item)}} &nbsp; </span>
          关联产品：
          <span v-for="(item, index) in it.ProductClassList" :key="index+'ProductClass'">{{getProductClassText(item)}} &nbsp; </span>
          关联客户类型：
          <span v-for="(item, index) in it.CustomerTypeList" :key="index+'CustomerType'">{{getCustomerTypeText(item)}} &nbsp; </span>
        </div>
        <div slot="content" class="text-row">
          关联区域：
          <span v-for="(item, index) in it.SellAreaList" :key="index+'SellArea'">{{getSellAreaText(item)}} &nbsp; </span><br/>
          关联产品：
          <span v-for="(item, index) in it.ProductClassList" :key="index+'ProductClass'">{{getProductClassText(item)}} &nbsp; </span><br/>
          关联客户类型：
          <span v-for="(item, index) in it.CustomerTypeList" :key="index+'CustomerType'">{{getCustomerTypeText(item)}} &nbsp; </span>
        </div>
      </el-tooltip>
    </li>

    <CommonDialogComp
    title="划分责任区域及产品"
    :visible.sync="dialogTableVisible"
    submitText="确定"
    @cancle="onCancleClick"
    @open="onOpen"
    @closed="onClosed"
    @submit="onSubmitClick">
      <div class="dialog-body">
        <div class="department-name">部门：<span>{{editData.ClassName}}</span></div>
        <div class="select-box">

          <div class="item">
            <div class="left">责任区域：</div>
            <div class="right">
              <ul>
                <li v-for="(SellAreaItem, index) in editData.SellAreaList" :key="SellAreaItem.RegionalID + index">
                  <!-- 大区 -->
                  <el-select @change="FirstGradeAreaChange(index)" v-model="SellAreaItem.RegionalID" size="mini"  placeholder="请选择">
                    <el-option
                      label="所有大区"
                      :value="-666">
                    </el-option>
                    <el-option
                      v-for="(FirstGradeAreaItem) in FirstGradeArea" :key="FirstGradeAreaItem.ID"
                      :label="FirstGradeAreaItem.ClassName"
                      :value="FirstGradeAreaItem.ID">
                    </el-option>
                  </el-select>
                  <!-- 市区 -->
                  <el-select @change="SecondLevelAreaChange(index)" v-model="SellAreaItem.CityID" size="mini"  placeholder="请选择">
                    <el-option
                      v-for="(SecondLevelAreaItem) in SecondLevelArea(index)" :key="SecondLevelAreaItem.ID"
                      :label="SecondLevelAreaItem.ClassName"
                      :value="SecondLevelAreaItem.ID">
                    </el-option>
                  </el-select>
                  <!-- 县区 -->
                  <el-select v-model="SellAreaItem.CountyID" size="mini"  placeholder="请选择">

                    <el-option
                       v-for="(threeLevelAreaItem) in threeLevelArea(index)" :key="threeLevelAreaItem.ID"
                      :label="threeLevelAreaItem.ClassName"
                      :value="threeLevelAreaItem.ID">
                    </el-option>
                  </el-select>
                  <AddAndDel
                    :index="index"
                    :disabled="editData.SellAreaList.length<2"
                    @addClick="onAddSellAreaClick"
                    @delClick="onDelSellAreaClick" />
                  <!-- <menu>
                    <menuitem @click="onAddSellAreaClick">
                      <img src="@/assets/images/add.png" alt="">
                      <span>添加</span>
                    </menuitem>
                    <menuitem @click="onDelSellAreaClick(index)" :class="{'is-disabled':editData.SellAreaList.length<2}">
                      <img src="@/assets/images/del.png" alt="" v-if="editData.SellAreaList.length>1">
                      <img src="@/assets/images/del-disabled.png" alt="" v-else>
                      <span>删除</span>
                    </menuitem>
                  </menu> -->
                </li>
              </ul>
            </div>
          </div>

          <div class="item">
            <div class="left">产品分类：</div>
            <div class="right">
              <ul>
                <li v-for="(ProductClassItem,index) in editData.ProductClassList" :key="index">
                  <!-- 大类 -->
                  <el-select @change="FirstGradeProductClassChange(index)" v-model="ProductClassItem.First" size="mini" placeholder="请选择">
                    <el-option
                      label="所有分类"
                      :value="-666">
                    </el-option>
                    <el-option
                      v-for="(irstGradeProductItem) in FirstGradeProductClass" :key="irstGradeProductItem.ID"
                      :label="irstGradeProductItem.ClassName"
                      :value="irstGradeProductItem.ID">
                    </el-option>
                  </el-select>
                  <!-- 二类 -->
                  <el-select v-model="ProductClassItem.Second" size="mini"  placeholder="请选择">
                    <el-option
                      v-for="(SecondProductClassItem) in SecondProductClass(index)" :key="SecondProductClassItem.ID"
                      :label="SecondProductClassItem.ClassName"
                      :value="SecondProductClassItem.ID">
                    </el-option>
                  </el-select>
                  <AddAndDel
                    :index="index"
                    :disabled="editData.ProductClassList.length<2"
                    @addClick="onAddProductClassClick"
                    @delClick="onDelProductClassClick" />
                </li>
              </ul>
            </div>
          </div>

          <div class="item">
            <div class="left">用户类型：</div>
            <div class="right">
              <ul>
                <li v-for="(CustomerTypeItem,index) in editData.CustomerTypeList" :key="index">
                  <!-- 用户类型 userTypeLis-->
                  <el-select v-model="CustomerTypeItem.CategoryID" size="mini"  placeholder="请选择">
                    <el-option
                      label="所有类型"
                      :value="-666">
                    </el-option>
                    <el-option
                      v-for="(userTypeLisItem) in CustomerTypeList" :key="userTypeLisItem.CategoryID + index"
                      :label="userTypeLisItem.CategoryName"
                      :value="userTypeLisItem.CategoryID">
                    </el-option>
                  </el-select>
                  <AddAndDel
                    :index="index"
                    :disabled="editData.CustomerTypeList.length<2"
                    @addClick="onAddUserTypeClick"
                    @delClick="onDelUserTypeClick" />
                </li>
              </ul>
            </div>
          </div>


        </div>
      </div>
      <!-- <div class="dialog-footer">
        <el-button @click="handleSubmit" size="mini">确定</el-button>
      </div> -->
    </CommonDialogComp>

  </ul>
</template>

<script>
import { mapState } from 'vuex';
import CommonDialogComp from '@/components/common/NewComps/CommonDialogComp';
import AddAndDel from './addAndDelbutton';

export default {
  props: {
    level1List: {
      type: Array,
      default: () => [],
    },
    departmentList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogTableVisible: false,
      localList: [],

      // 正在修改的部门
      editData: {},
      editDataIndex: null,
      // 被删除的id列表
      removeIds: [],
    };
  },
  components: {
    AddAndDel,
    CommonDialogComp,
  },
  computed: {
    ...mapState('common', ['areaList']),
    ...mapState('common', ['ProductMultipleClassifyList']),
    ...mapState('department', ['userTypeList']),
    ...mapState('department', ['departmentParentID']),
    childrenLingth() {
      return (id) => this.departmentList.filter((item) => item.ParentID === id).length;
    },
    // 一级区域
    FirstGradeArea() {
      return this.areaList.filter(item => item.ParentID === -1);
    },
    // 二级区域
    SecondLevelArea() {
      return (index) => {
        const returnArr = [];
        const ParentID = this.editData.SellAreaList[index].RegionalID;
        // 选择了大区
        if (this.areaList.filter(item => item.ID === ParentID).length) {
          returnArr.push({
            ClassName: `所有${this.areaList.filter(item => item.ID === ParentID)[0].ClassName}`,
            ID: -666,
          });
        } else {
          returnArr.push({
            ClassName: '所有市区',
            ID: -666,
          });
        }
        return [...returnArr, ...this.areaList.filter(item => item.ParentID === ParentID)];
      };
    },
    // 三级区域
    threeLevelArea() {
      return (index) => {
        const returnArr = [];
        const ParentID = this.editData.SellAreaList[index].CityID;
        // 选择了大区
        if (this.areaList.filter(item => item.ID === ParentID).length) {
          returnArr.push({
            ClassName: `所有${this.areaList.filter(item => item.ID === ParentID)[0].ClassName}`,
            ID: -666,
          });
        } else {
          returnArr.push({
            ClassName: '所有县区',
            ID: -666,
          });
        }
        return [...returnArr, ...this.areaList.filter(item => item.ParentID === ParentID)];
      };
    },

    // 一级分类
    FirstGradeProductClass() {
      return this.ProductMultipleClassifyList[0] ? this.ProductMultipleClassifyList[0].List.filter(item => item.ParentID === -1) : [];
    },
    // 二级分类
    SecondProductClass() {
      return (index) => {
        const ProductMultipleClassifyList = this.ProductMultipleClassifyList[0] ? this.ProductMultipleClassifyList[0].List : [];
        const returnArr = [];
        const ParentID = this.editData.ProductClassList[index].First;
        // 选择了大区
        if (ProductMultipleClassifyList.filter(item => item.ID === ParentID).length) {
          returnArr.push({
            ClassName: `所有${ProductMultipleClassifyList.filter(item => item.ID === this.editData.ProductClassList[index].First)[0].ClassName}`,
            ID: -666,
          });
        } else {
          returnArr.push({
            ClassName: '所有分类',
            ID: -666,
          });
        }
        return [...returnArr, ...ProductMultipleClassifyList.filter(item => item.ParentID === ParentID)];
      };
    },
    // 用户类型
    CustomerTypeList() {
      return this.userTypeList.filter((item) => item.Type === 1);
    },
  },
  methods: {
    getIsOrNotChange() { // 是否发生变化 （切换时使用）
      const list = this.localList.filter(it => it.ClassName);
      return JSON.stringify(list) !== JSON.stringify(this.level1List);
    },
    createAAreaItem() {
      const temp = {
        ClassName: '',
        ID: '',
        Index: this.localList.length,
        Level: 1,
        ParentID: this.departmentParentID,
        Type: 1,
        canRemove: true,
        CustomerTypeList: [],
        ProductClassList: [],
        SellAreaList: [],
        key: Math.random().toString(16).slice(-10),
      };
      return temp;
    },
    async onAddClick() { // 添加一行
      this.localList.push(this.createAAreaItem());
      await this.$nextTick();
      if (this.$refs.oWrap) this.$refs.oWrap.scrollTop = 10000;
    },
    // 区域添加
    onAddSellAreaClick() { // 添加一行
      this.editData.SellAreaList.push({
        CityID: -666,
        CityName: '',
        CountyID: -666,
        CountyName: '',
        RegionalID: -666,
        RegionalName: '',
      });
    },
    // 区域删除
    onDelSellAreaClick(index) {
      this.editData.SellAreaList.splice(index, 1);
    },
    // 产品分类添加
    onAddProductClassClick() {
      this.editData.ProductClassList.push({
        First: -666,
        Second: -666,
      });
    },
    // 产品分类删除
    onDelProductClassClick(index) {
      this.editData.ProductClassList.splice(index, 1);
    },

    onAddUserTypeClick() {
      this.editData.CustomerTypeList.push({
        AllowRemove: false,
        CategoryID: -666,
        CategoryName: '',
        Type: 0,
        Value: 0,
      });
    },
    onDelUserTypeClick(index) {
      this.editData.CustomerTypeList.splice(index, 1);
    },

    onRemoveClick(it, i) { // 删除一行
      if (this.childrenLingth(it.ID)) return;
      if (!it.ID) { // 没有ID时可以直接删除
        this.localList.splice(i, 1);
        return;
      }
      this.messageBox.warnCancelBox('确定删除该部门吗', `部门名称：[ ${it.ClassName || '未设置'} ]`, () => {
        this.removeIds.push(it.ID);
        this.localList.splice(i, 1);
      });
    },
    handleSubmit() {
      // 用户类型
      this.editData.CustomerTypeList.forEach((element, index) => {
        const filtrate = this.userTypeList.filter((item) => item.Type === 1 && item.CategoryID === element.CategoryID);
        this.editData.CustomerTypeList[index].CategoryName = filtrate.length ? filtrate[0].CategoryName : '';
      });
      // 产品分类
      // this.editData.ProductClassList.forEach((element, index) => {
      //   console.log(element);
      //   const ProductMultipleClassifyList = this.ProductMultipleClassifyList[0].List;
      //   const filtrate = ProductMultipleClassifyList.filter((item) => item.ID === element.First);
      //   console.log(filtrate);
      //   this.editData.ProductClassList[index].ClassName = filtrate.length ? filtrate[0].ClassName : null;
      // });
      this.editData.SellAreaList.forEach((element, index) => {
        const filtrateCity = this.areaList.filter((item) => item.ID === element.CityID);
        const filtrateCounty = this.areaList.filter((item) => item.ID === element.CountyID);
        const filtrateRegional = this.areaList.filter((item) => item.ID === element.RegionalID);
        this.editData.SellAreaList[index].CityName = filtrateCity.length ? filtrateCity[0].ClassName : '';
        this.editData.SellAreaList[index].CountyName = filtrateCounty.length ? filtrateCounty[0].ClassName : '';
        this.editData.SellAreaList[index].RegionalName = filtrateRegional.length ? filtrateRegional[0].ClassName : '';
      });
      this.localList.splice(this.editDataIndex, 1, this.editData);
      this.dialogTableVisible = false;
    },
    onCancleClick() {
      this.dialogTableVisible = false;
    },
    onOpen() {},
    onClosed() {},
    onSubmitClick() {
      this.handleSubmit();
    },
    save() {
      if (!this.getIsOrNotChange()) { // 此处判断右侧数据是否需要保存 -- 确认提示
        this.messageBox.failSingleError('保存失败', '数据未发生变化');
        return null;
      }
      const returnData = this.localList.filter((item) => item.ClassName !== '');
      const clearRemoveIds = () => {
        this.removeIds = [];
      };
      return { returnData, removeIds: this.removeIds, callback: clearRemoveIds };
    },
    // 划分区域按钮
    zoningButton(item, index) {
      this.dialogTableVisible = true;
      this.editData = JSON.parse(JSON.stringify(item));
      this.editDataIndex = index;
      if (!item.CustomerTypeList || !item.CustomerTypeList.length) this.onAddUserTypeClick();
      if (!item.ProductClassList || !item.ProductClassList.length) this.onAddProductClassClick();
      if (!item.SellAreaList || !item.SellAreaList.length) this.onAddSellAreaClick();
    },
    // 获取各个选择项
    getSelectData() {
      // 获取地区
      this.$store.dispatch('common/getAreaList');
      // 获取分类
      this.$store.dispatch('common/getProductClassifyData', { key: 6 });
      // 获取用户类型
      this.$store.dispatch('department/getUserTypeList');
    },
    // 一级责任区域：
    FirstGradeAreaChange(index) {
      this.editData.SellAreaList[index].CountyID = -666;
      this.editData.SellAreaList[index].CityID = -666;
    },
    // 二级责任区域：
    SecondLevelAreaChange(index) {
      this.editData.SellAreaList[index].CountyID = -666;
    },

    // 一级分类切换
    FirstGradeProductClassChange(index) {
      this.editData.ProductClassList[index].Second = -666;
    },

    // 根据ID获取区域的名字
    useIdGetSellAreaClassName(ID) {
      const filterList = this.areaList.filter(item => item.ID === ID);
      return filterList.length ? filterList[0].ClassName : '';
    },
    // 区域文字
    getSellAreaText(item) {
      let returnText = '';
      if (item.RegionalID) returnText += this.useIdGetSellAreaClassName(item.RegionalID);
      if (item.CityID) returnText += this.useIdGetSellAreaClassName(item.CityID);
      if (item.CountyID) returnText += this.useIdGetSellAreaClassName(item.CountyID);

      // if (item.CityName) returnText += item.CityName;
      // if (item.CountyName) returnText += item.CountyName;
      // if (item.RegionalName) returnText += item.RegionalName;
      return returnText === '' || returnText === 'null' ? '所有大区' : returnText;
    },
    // 分类文字
    getProductClassText(item) {
      const ProductMultipleClassifyList = this.ProductMultipleClassifyList[0] ? this.ProductMultipleClassifyList[0].List : [];
      const filtrateFirst = ProductMultipleClassifyList.filter((element) => element.ID === item.First);
      const filtrateSecond = ProductMultipleClassifyList.filter((element) => element.ID === item.Second);
      let returnText = '';
      if (item.First !== -666) returnText += filtrateFirst.length ? filtrateFirst[0].ClassName : '';
      if (item.Second !== -666) returnText += filtrateSecond.length ? filtrateSecond[0].ClassName : '';
      return returnText === '' || returnText === 'null' ? '所有分类' : returnText;
    },
    useIdGetCustomerTypeName(ID) {
      const filterList = this.CustomerTypeList.filter(item => item.CategoryID === ID);
      return filterList.length ? filterList[0].CategoryName : '';
    },
    // 客户类型
    getCustomerTypeText(item) {
      let returnText = '';
      if (item.CategoryID !== -666) returnText += this.useIdGetCustomerTypeName(item.CategoryID);
      return returnText === '' || returnText === 'null' ? '所有类型' : returnText;
    },
  },
  mounted() {
    this.localList = JSON.parse(JSON.stringify(this.level1List)) || [];
    this.localList.push(this.createAAreaItem());
    this.getSelectData();
  },
  watch: {
    level1List(newVal) {
      this.localList = JSON.parse(JSON.stringify(newVal)) || [];
      this.localList.push(this.createAAreaItem());
    },
    departmentParentID() {
      this.removeIds = [];
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-basic-set-up-sell-area-set-up-page-right-content-level1-manage-wrap {
  max-height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
  &.department-manage{

    >li{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
  menu {
    display: flex;
    align-items: center;
    color: #a2a2a2;
    > menuitem {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0 20px;
      height: 28px;
      user-select: none;
      > img {
        margin-right: 10px;
      }
      & + menuitem {
        border-left: 1px solid #eee;
      }
      &:not(.is-disabled):hover {
        color: #585858;
      }
    }
  }
  > li {
    margin-bottom: 12px;
    > .operate-row {
      display: flex;
      align-items: center;
      justify-content: left;
      > .el-input {
        width: 240px;
        > input {
          border-left: none;
          border-right: none;
          border-top: none;
          padding: 0;
        }
        &.is-disabled .el-input__inner {
          background-color: #fcfcfc;
        }
      }

      > .el-button:hover{
        color: red;
      }
    }
    > .text-row{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      line-height: 1em;
      color: #999;
      font-size: 14px;
      margin-top: 5px;
      font-weight: 700;
      width: 600px;
      >span{
        font-weight: 400;
        margin-right: 10px;
      }
    }
  }
  .el-dialog__header{
    background-color: #efefef;
  }
  .el-dialog{
    max-width: 900px;
    min-width: 850px;
  }
  .dialog-body{
    // background-color: red;
    > .department-name{
      border-bottom: 1px solid #26bcf9;
      padding-bottom: 5px;
    }

    > .select-box{
      padding: 1.5em;
      height: 400px;
      overflow:auto;
      > .item{
        display: flex;
        margin-bottom: 10px;
        > .left{
          line-height:30px;
        }
        > .right{
          > ul{
            > li{
              height:30px;
              display: flex;
              > .el-select{
                width: 150px;
                margin-right: 10px;
                border-bottom: 1px solid #ccc;
                input{
                  border: none;
                }
              }
            }
          }
        }
      }
    }

  }
}
</style>
