<template>
  <CommonDialogComp
    width="540px"
    top='15vh'
    title="设置元素"
    :visible="visible"
    :loading="loading"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    v-if="itemData"
    class="mp-erp-comps-pruduct-module-product-element-map-set-dialog-comp-wrap"
  >
    <ul v-if="!loading" class="list">
      <li v-for="(it, i) in List" :key="it.First + '-' + i" class="item" :class="{num: it.isNumber}">
        <span class="label">{{it.label}}:</span>
        <el-select v-model="it.Second" placeholder="请选择" size="small" :style="`width: ${it.width};`">
          <el-option
            v-for="item in it.OptionList"
            :key="item.ID || item.Name"
            :disabled='(selectedElementIDs.includes(item.ID) && it.Second !== item.ID) || (!it.needFormula && item.isFormula)'
            :label="item.Name"
            :value="item.ID">
          </el-option>
        </el-select>

        <div class="tip" v-if="it.isNumber && curData">
          <span>*注：</span>
          <span>数量单位请务必统一为“张”，否则将影响部件生产数量部件印刷份数=部件张数x印面÷审稿送出文件页数</span>
          <span class="img-box">
            <img src="@/assets/images/warning-triangle.png" alt="">
          </span>
        </div>
      </li>
    </ul>
    <p class="tips-box">
      <i class="el-icon-warning"></i>注：数量、款数设置为“无”时默认为1；重量设置为“无”时默认为0
    </p>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import { mapState } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    curData: {
      type: Object,
      default: null,
    },
    itemData: {
      type: Object,
      default: null,
    },
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    ...mapState('productManage', ['ProductElementTypeList']),
    selectedElementIDs() {
      // return this.List.map(it => it.Second).filter(it => it);
      return [];
    },
    OptionList() {
      return this.ElementData.List;
    },
  },
  data() {
    return {
      PartID: '',
      ElementData: { // 下拉列表数据
        PositionID: '',
        List: [],

      },
      loading: false,
      List: [], // 要保存的数据列表
    };
  },
  methods: {
    onSubmit() {
      const list2 = this.List.map(it => it.Second).filter(it => it !== null);
      if (list2.length < this.ProductElementTypeList.filter(it => !it.onlyProduct || !this.curData).length) {
        this.messageBox.failSingleError('保存失败', '元素设置值不能为空!');
        return;
      }
      const list = this.List.map(it => it.Second).filter(it => it);
      if (list.length > 1) {
        const len1 = list.length;
        const len2 = new Set(list).size;
        if (len1 > len2) {
          this.messageBox.failSingleError('保存失败', '元素设置值不能重复!');
          return;
        }
      }
      const temp = {
        ProductID: this.itemData.ID,
        PartID: this.PartID,
        List: this.List,
      };
      this.$emit('submit', temp);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.PartID = '';
      this.List = [];
    },
    async initEditData() { // 数据初始化方法
      if (this.curData) this.PartID = this.curData.ID; // 部件ID，

      // 获取下拉列表数据
      const PostionID = this.PartID || this.itemData.ID;
      // if (this.ElementData.PositionID !== PostionID) { // 是否缓存  暂不缓存
      this.ElementData.PositionID = PostionID;
      const [ElementList, FormulaList] = await this.getDataList();
      // }
      // 设置元素对应列表数据
      this.List = this.ProductElementTypeList.filter(it => !it.onlyProduct || !this.curData).map(it => {
        const TypeList = this.curData ? this.curData.TypeList : this.itemData.TypeList;
        let Second = null;
        if (TypeList) {
          const t = TypeList.find(_it => _it.First === it.ID);
          if (t) Second = t.Second || '';
        }
        const OptionList = [{ ID: '', Name: '无' }];
        // const OptionList = [];
        if (it.needElement) OptionList.push(...ElementList);
        if (it.needFormula) OptionList.push(...FormulaList);
        return {
          Second,
          First: it.ID,
          label: it.Name,
          needFormula: it.needFormula,
          needElement: it.needElement,
          OptionList,
          width: it.width,
          isNumber: it.isNumber || false,
        };
      });
    },
    async getDataList() { // 获取元素及公式列表
      this.loading = true;
      const [ElementList, FormulaList] = await Promise.all([this.getElementList(), this.getFormulaList()]);
      this.loading = false;
      const _ElementList = ElementList
        .filter(it => (it.Type === 1 && it.NumbericAttribute?.AllowDecimal === false)
          || (it.Type === 2 && it.OptionAttribute?.OptionList?.length > 0));
      this.ElementData.List = [..._ElementList, ...FormulaList];
      return [_ElementList, FormulaList];
    },
    async getElementList() { // getElementGroupList
      const [resp, groupResp] = await Promise.all([
        this.api.getElementList({ positionID: this.ElementData.PositionID }, true).catch(() => {}),
        this.api.getElementGroupList(this.ElementData.PositionID, true).catch(() => {}),
      ]);
      const list = [];
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        list.push(...resp.data.Data.filter(it => !it.Group));
      }
      if (groupResp && groupResp.status === 200 && groupResp.data.Status === 1000 && groupResp.data.Data && groupResp.data.Data.length > 0) {
        const _list = groupResp.data.Data.filter(it => it.UseTimes && it.UseTimes.MinValue === 1 && it.UseTimes.MaxValue === 1);
        _list.forEach(it => {
          if (it.ElementList?.length > 0) {
            // const alreayIDs = list.map(_it => _it.ID || _it.Name);
            list.push(...it.ElementList.map(_it => ({ ..._it, Name: `${it.Name}:${_it.Name}` })));
          }
        });
      }
      this.ElementData.PositionID = '';
      return list;
    },
    async getFormulaList() {
      // if (this.curData) return []; // 此时设置的为部件，为部件时不设置重量，不需要数据，所以直接返回空数组
      const temp = {
        ProductID: this.itemData.ID,
        UseModule: this.curData && this.curData.UseTimes.MaxValue > 1 ? 2 : 1,
      };

      const resp = await this.api.getFormulaList(temp, true).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        return resp.data.Data.filter(it => (temp.UseModule === 2 ? it.PartID === this.curData?.ID : !it.PartID) && !it.GroupID)
          .map(it => ({ ...it, Name: `公式：${it.Name}`, isFormula: true }));
      }
      this.ElementData.PositionID = '';
      return [];
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-pruduct-module-product-element-map-set-dialog-comp-wrap {

  .el-dialog__body {
    min-height: 185px;
    padding-left: 2px;
    padding-top: 15px;
    padding-bottom: 0;
    > ul.list {
      display: flex;
      flex-wrap: wrap;
      margin-left: 50px;
      > li.item {
        margin-bottom: 15px;
        margin-right: 5px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        > span {
          margin-right: 7px;
          color: #00151E;
          font-size: 12px;
          color: #444444;
          font-weight: bold;
          width: 48px;
          text-align: right;
          line-height: 20px;
        }
        .el-select {
          width: 160px;

          .el-input__inner, .el-input__icon {
            line-height: 28px;
            height: 28px;
          }

          .el-input__inner {
            color: #444444;
          }
        }

        &.num {
          .el-select {
            .el-input__inner, .el-input__icon {
              line-height: 35px;
              height: 35px;
            }
            .el-input__inner {
              color:#00151E;
            }
          }

          > span {
            color: #00151E;
          }
        }

        .tip {
          line-height: 16px;
          color: #FF3769;
          font-size: 11px;
          font-weight: bold;
          font-family: Microsoft YaHei UI, Microsoft YaHei UI;
          background: #FFF1F4;
          border-radius: 2px;
          display: flex;
          margin-left: 55px;
          margin-top: 5px;
          width: 380px;
          padding: 7px 0;
          box-sizing: border-box;

          span:first-of-type {
            flex: none;
            width: 40px;
            text-align: right;
          }

          .img-box {
            width: 55px;
            flex: none;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            margin-right: 6px;
          }
        }
      }
    }
    > .tips-box {
      margin-top: 10px;
      margin-left: 88px;
      font-size: 11px;
      width: 360px;
      padding-left: 10px;
      font-family: Microsoft YaHei UI, Microsoft YaHei UI;
      color: #F1A30C;
      background: #FEF9EF;
      > i {
        margin-right: 6px;
      }
    }
  }
}
</style>
