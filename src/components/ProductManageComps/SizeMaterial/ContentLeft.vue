<template>
  <section class="mp-erp-product-page-material-size-comp-left-conten-wrap">
    <header>
      <el-button type="primary" size="small" @click="onMaterialSaveClick(null)">+添加物料</el-button>
      <span class="title">物料提示名称：</span>
      <template v-if="!isTitleEditing">
        <span class="value">{{this.MaterialDisplayName}}</span>
        <span class="blue-span menu" @click="onTitleEditClick">编辑名称</span>
      </template>
      <template v-else>
        <el-input size="mini" v-model.trim="title" maxlength="10" show-word-limit @keyup.enter.native="onTitleSaveClick"></el-input>
        <span class="blue-span menu" @click="onTitleSaveClick">保存</span>
        <span class="red-span menu" @click="isTitleEditing = false">取消</span>
        <span class="tip">（可回车保存）</span>
      </template>
    </header>
    <main>
      <MaterialSelectDialog :visible.sync='MaterialSaveVisible' v-model="MaterialSelectDialogSetData"
         :MaterialLocalList='MaterialLocalList' :dataList="MaterialAllList" :typeList='MaterialTypeList' />
      <ul class="material-list">
        <li v-for="it in MaterialLocalList" :key="it.ID">
          <p>{{it.Name}}</p>
          <div class="sub-list">
            <span v-for="sub in it.ShowList" :key="sub.Name">{{sub.Name}}（{{sub.List.length}}种） </span>
          </div>
          <div class="menu">
            <span @click="onMaterialSaveClick(it)"> <i class="edit"></i> 编辑</span>
            <span @click="onMaterialRemoveClick(it)"> <i></i> 删除</span>
          </div>
        </li>
      </ul>
      <p class="sort"><span @click="MaterialSortVisible = true" class="blue-span" v-if="MaterialLocalList.length > 1">一级组合排序</span></p>
      <MaterialSortDialog :visible.sync='MaterialSortVisible' v-model="MaterialSortListData" />
      <div class="material-hidden-list" v-if="MaterialList.length > 0">
        <p>
          <span class="mp-common-title-wrap">客户界面隐藏</span>
          <span class="blue-span" @click="MaterialHiddentVisible=true">设置隐藏</span>
        </p>
      </div>
      <MaterialHiddenDrawer :visible.sync='MaterialHiddentVisible' v-model="MaterialHiddentListData" />
      <ul class="material-list">
        <li v-for="it in MaterialIsHiddenList" :key="it.ID">
          <p>{{it.Name}}</p>
          <div class="sub-list">
            <span v-for="sub in it.ShowList" :key="sub.Name">{{sub.Name}}（{{sub.List.length}}种） </span>
          </div>
        </li>
      </ul>
    </main>
  </section>
</template>

<script>
import { normalNameReg } from '@/assets/js/utils/regexp';
import { getFirstOptionName } from '@/assets/js/TypeClass/MaterialSizeClass';
import { mapState } from 'vuex';
import MaterialSelectDialog from './MaterialSelectDialog.vue';
import MaterialSortDialog from './MaterialSortDialog.vue';
import MaterialHiddenDrawer from './MaterialHiddenDrawer.vue';

export default {
  props: {
    curProduct: {
      type: Object,
      default: null,
    },
    curPart: {
      type: Object,
      default: null,
    },
    MaterialList: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    MaterialSelectDialog,
    MaterialSortDialog,
    MaterialHiddenDrawer,
  },
  data() {
    return {
      // 下面为物料提示名称有关
      title: '',
      isTitleEditing: false,
      // 下面为物料添加与编辑保存有关
      MaterialSaveVisible: false,
      curEditMaterialData: null,
      MaterialSortVisible: false,
      // 下面为物料客户界面隐藏设置有关
      MaterialHiddentVisible: false,
    };
  },
  computed: {
    ...mapState('basicSet', ['MaterialTypeList']),
    ...mapState('common', ['MaterialAllList']),
    MaterialDisplayName() {
      if (!this.curProduct) return '';
      return this.curPart ? this.curPart.MaterialDisplayName : this.curProduct.MaterialDisplayName;
    },
    MaterialSelectDialogSetData: {
      get() {
        return this.curEditMaterialData;
      },
      set([dataList, TypeID, isEdit]) {
        this.$emit('MaterialSaveSubmit', [TypeID, dataList, isEdit]);
      },
    },
    MaterialLocalList() {
      if (!this.MaterialList || !Array.isArray(this.MaterialList) || this.MaterialList.length === 0) return [];
      let list = [];
      this.MaterialList.forEach(it => {
        const { ID, Name, UnionShowList, ElementList } = it.Type;
        const { lv1Title, itemContent } = getFirstOptionName(UnionShowList, ElementList);
        const t = list.find(_it => _it.ID === ID);
        const item = { ...it, FirstName: lv1Title, itemContent };
        if (!t) list.push({ ID, Name, List: [item] });
        else t.List.push(item);
      });
      list = list.map(it => {
        const _list = [];
        it.List.forEach(sub => {
          const t = _list.find(_it => sub.FirstName === _it.Name);
          if (t) t.List.push(sub);
          else _list.push({ Name: sub.FirstName, List: [sub] });
        });
        return { ...it, ShowList: _list };
      });
      return list;
    },
    MaterialIsHiddenList() {
      const list = this.MaterialLocalList.map(lv1 => ({
        ...lv1,
        ShowList: lv1.ShowList.map(lv2 => ({
          ...lv2,
          List: lv2.List.filter(it => it.HiddenToCustomer),
        })).filter(lv2 => lv2.List.length > 0),
      })).filter(lv1 => lv1.ShowList.length > 0);
      return list;
    },
    MaterialSortListData: {
      get() {
        if (!this.MaterialLocalList || !Array.isArray(this.MaterialLocalList) || this.MaterialLocalList.length === 0) return [];
        return this.MaterialLocalList.map(({ ID, Name }) => ({ ID, Name }));
      },
      set(val) {
        if (!val || val.length === 0) return;
        this.$emit('MaterialSortSubmit', val);
      },
    },
    MaterialHiddentListData: {
      get() {
        return this.MaterialLocalList;
      },
      set(val) {
        if (val.length === this.MaterialList.length) {
          this.messageBox.failSingle('不能全选，应至少保留一种物料类型');
          return;
        }
        this.$emit('MaterialSetHiddenSubmit', val);
      },
    },
  },
  methods: {
    initData() {
      // if (!this.MaterialTypeList || !Array.isArray(this.MaterialTypeList) || this.MaterialTypeList.length === 0) {
      //   this.$store.dispatch('basicSet/getMaterialTypeList');
      // }
      this.$store.dispatch('basicSet/getMaterialTypeList');
      this.$store.dispatch('common/getMaterialAllList');
    },
    onTitleEditClick() { // 点击编辑物料提示名称
      this.title = this.MaterialDisplayName;
      this.isTitleEditing = true;
    },
    async onTitleSaveClick() { // 保存物料提示名称
      if (this.title === this.MaterialDisplayName) {
        this.messageBox.failSingle('物料提示名称未发生变化');
        return;
      }
      if (!this.title) {
        this.messageBox.failSingle('请输入物料提示名称');
        return;
      }
      if (!normalNameReg.test(this.title)) {
        this.messageBox.failSingle('名称仅支持中文、英文(全角/半角)、+-_(全角/半角)、数字等');
        return;
      }
      const cb = () => { this.isTitleEditing = false; };
      const ProductID = this.curProduct.ID;
      const PartID = this.curPart ? this.curPart.ID : '';
      this.$store.dispatch('productManage/getMaterialDisplayNameChange', [ProductID, PartID, this.title, cb]);
    },
    onMaterialSaveClick(data) { // 点击物料按钮添加
      if (!this.MaterialTypeList || this.MaterialTypeList.length === 0) {
        this.messageBox.failSingle('尚无物料相关设置，请先到物料管理里面进行设置');
        return;
      }
      this.curEditMaterialData = data;
      this.MaterialSaveVisible = true;
    },
    onMaterialRemoveClick(data) {
      this.messageBox.warnCancelBox('确定删除该类物料吗?', `物料种类：[ ${data.Name} ]`, () => {
        this.$emit('MaterialTypeRemove', data);
      });
    },
  },
  mounted() {
    this.initData();
  },
};
</script>
<style lang='scss'>
.mp-erp-product-page-material-size-comp-left-conten-wrap {
  min-width: 520px;
  > header {
    font-size: 13px;
    display: flex;
    align-items: center;
    .el-input {
      width: 200px;
      flex: none;
    }
    > span {
      color: #585858;
      flex: none;
      white-space: nowrap;
      &.title {
        color: #888E99;
        margin-left: 22px;
      }
      &.value {
        font-weight: 700;
        margin-right: 15px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      &.menu {
        font-size: 12px;
      }
      &.blue-span {
        margin: 0 10px;
      }
      &.tip {
        font-size: 12px;
        color: #cbcbcb;
        margin-left: 8px;
      }
    }
    > button {
      width: 110px;
    }
  }
  > main {
    > .material-list {
      padding-right: 45px;
      padding-top: 35px;
      > li {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 15px 0;
        align-items: center;
        > p {
          flex: none;
          width: 110px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 22px;
          font-size: 14px;
          color: #444444;
        }
        > .sub-list {
          font-size: 12px;
          width: calc(100% - 110px - 40px - 130px);
          flex: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #999999;
          padding-right: 20px;
        }
        > .menu {
          font-size: 12px;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          > span {
            display: flex;
            align-items: center;
            white-space: nowrap;
            width: 50%;
            justify-content: flex-end;
            color: #a2a2a2;
            cursor: pointer;
            transition: color 0.1s ease-in-out;
            > i {
              display: inline-block;
              width: 16px;
              height: 16px;
              margin-right: 4px;
              vertical-align: middle;
              background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
              &.edit {
                background: url(../../../assets/images/Compile.png) no-repeat center center/14px 14px;
              }
            }
            &:hover {
              color: #444;
            }
          }
        }
      }
      &:last-of-type {
        padding-bottom: 20px;
      }
    }
    > p.sort {
      padding: 16px 0 80px 0;
      font-size: 14px;
    }
    > .material-hidden-list {
      font-size: 14px;
      > p {
        white-space: nowrap;
        .mp-common-title-wrap {
          color: #444;
          margin-right: 25px;
        }
      }
    }
  }
}
</style>
