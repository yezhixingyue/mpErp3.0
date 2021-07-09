<template>
  <section class="mp-erp-product-list-page-product-file-set-page-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <ContionCommonComp ref="oLeftCondition" :PropertyList='ProductFilePropertyList' :curEditData='curEditFileData'>
        <span>文件类目：</span>
        <ul class="file-list">
          <li v-for="it in FileDataList" :key="it.ID">
            <el-checkbox :value='checkedFileIDs.includes(it.ID)' @change="selectChange(it)">{{it.Name}}</el-checkbox>
            <el-checkbox v-if="checkedFileIDs.includes(it.ID)" :value='getIsRequiredByID(it.ID)' @change="requiredChange(it.ID)">必须上传</el-checkbox>
          </li>
        </ul>
      </ContionCommonComp>
    </main>
    <footer>
      <el-button @click="onSubmitClick" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ContionCommonComp from '@/components/common/FormulaAndConditionComps/ContionCommonComp.vue';

export default {
  name: 'ProductFileSetPage',
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      checkedFileList: [], // 普通工厂列表
    };
  },
  components: {
    ContionCommonComp,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductModuleKeyIDList', 'ProductFilePropertyList', 'curEditFileData']),
    ...mapState('common', ['FileDataList']),
    curProduct() {
      if (!this.ProductID) return null;
      return this.ProductManageList.find(it => it.ID === this.ProductID);
    },
    curPart() {
      if (!this.PartID || !this.curProduct) return null;
      return this.curProduct.PartList.find(it => it.ID === this.PartID);
    },
    checkedFileIDs() {
      if (!Array.isArray(this.checkedFileList) || this.checkedFileList.length === 0) return [];
      return this.checkedFileList.map(it => it.File.ID);
    },
  },
  methods: {
    getPositionID() {
      if (!this.$route.params) {
        this.onGoBackClick();
        return;
      }
      const { ProductID, PartID, name, type } = this.$route.params;
      if (!ProductID || !PartID || !name || !type) {
        this.onGoBackClick();
        return;
      }
      this.ProductID = ProductID;
      this.PartID = PartID !== 'null' ? PartID : '';
      this.ProductName = name;
      this.titleType = type;
    },
    selectChange(it) { // 文件勾选或取消勾选
      const i = this.checkedFileList.findIndex(_it => _it.File.ID === it.ID);
      if (i > -1) this.checkedFileList.splice(i, 1);
      else this.checkedFileList.push({ File: it, IsRequired: false });
    },
    getIsRequiredByID(id) {
      const t = this.checkedFileList.find(_it => _it.File.ID === id);
      return t ? t.IsRequired : false;
    },
    requiredChange(id) {
      const t = this.checkedFileList.find(_it => _it.File.ID === id);
      if (t) t.IsRequired = !t.IsRequired;
    },
    onGoBackClick() {
      this.$router.replace(`/ProductFileList/${this.ProductID}/${this.PartID ? this.PartID : 'null'}/${this.ProductName}/${this.titleType}/${Date.now()}`);
      // this.$router.go(-1);
      // this.$goback();
    },
    onSubmitClick() { // 点击保存
      const condition = this.$refs.oLeftCondition.getConditonResult();
      if (!condition) return;
      if (!this.checkedFileList || this.checkedFileList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请勾选想要设置的文件类目');
        return;
      }
      const { ID, Priority, Constraint } = condition;
      const FileList = this.checkedFileList;
      if (!FileList) return;
      const temp = { ID, Priority, Constraint, FileList, ProductID: this.ProductID };
      this.ProductFileSubmitHandler(temp);
    },
    async ProductFileSubmitHandler(data) {
      const resp = await this.api.getProductFileSave(data).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const isEdit = data.ID || data.ID === 0;
        const cb = () => {
          this.$store.commit('productManage/setProductFileSave', [{ ...data, ID: resp.data.Data }, isEdit]);
          this.onGoBackClick();
        };
        const title = isEdit ? '编辑成功' : '添加成功';
        this.messageBox.successSingle(title, cb, cb);
      }
    },
  },
  mounted() {
    this.getPositionID();
    this.$store.dispatch('common/getFileInfoList');
    if (!this.curEditFileData) return;
    const { FileList } = this.curEditFileData;
    if (!Array.isArray(FileList) || FileList.length === 0) return;
    this.checkedFileList = JSON.parse(JSON.stringify(FileList));
  },
};
</script>
<style lang='scss'>
.mp-erp-product-list-page-product-file-set-page-wrap {
  padding-left: 20px;
  padding-right: 6px;
  height: 100%;
  padding-bottom: 25px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  > header {
    padding: 30px 0;
    padding-bottom: 20px;
    line-height: 15px;
    box-sizing: border-box;
    // height: 15px;
    font-size: 15px;
    color: #21CAE3;
    font-weight: bold;
    flex: none;
    > p {
      padding-top: 45px;
      > button {
        font-size: 14px;
      }
    }
  }
  > main {
    flex: 1;
    padding-top: 15px;
    .right-content-main-wrap {
      display: flex;
      > span {
        color: #888E99;
        font-size: 14px;
        margin-right: 10px;
        padding-top: 10px;
      }
      .file-list {
        > li {
          padding: 9px 0;
          display: flex;
          align-items: center;
          > .el-checkbox {
            display: flex;
            align-items: center;
            > .el-checkbox__label {
              color: #585858;
              font-size: 12px;
            }
            &:first-of-type {
              width: 120px;
              overflow: hidden;
              vertical-align: middle;
              margin-right: 0;
              > .el-checkbox__label {
                max-width: 85px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
        }
      }
    }
  }
  > footer {
    text-align: center;
    padding: 25px;
    padding-top: 40px;
    flex: none;
    > button {
      width: 120px;
      height: 35px;
      border: 1px solid #26BCF9;
      border-radius: 3px;
      padding: 0;
      &:last-of-type {
        color: #26BCF9;
        margin-left: 30px;
      }
    }
  }
}
</style>
