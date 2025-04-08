<template>
  <section class="mp-erp-product-list-page-product-file-set-page-wrap">
    <header>
      <span>当前{{titleType}}：</span>
      <span>{{ProductName}}</span>
    </header>
    <main>
      <ContionCommonComp ref="oLeftCondition" :PropertyList='ProductFilePropertyList' :curEditData='curEditFileData'
      :adAreaList="adAreaList" :areaList="areaList" :allAdAreaTreeList="allAdAreaTreeList"
        :allProductClassify="allProductClassify" :allProductAndLevelList="allProductAndLevelList" :allAreaTreeList="allAreaTreeList">
        <div class="file-list-wrap mp-scroll-wrap">
          <span>文件类目：</span>
          <ul class="file-list">
            <li v-for="it in FileDataList" :key="it.ID">
              <el-checkbox :value='checkedFileIDs.includes(it.ID)' @change="selectChange(it)">{{it.InternalName}}{{it.IsPrintFile?'（印刷文件）':''}}</el-checkbox>
              <el-checkbox v-if="checkedFileIDs.includes(it.ID)" :value='getIsRequiredByID(it.ID)' @change="requiredChange(it.ID)">必须上传</el-checkbox>
              <div class="max-size-box" v-if="checkedFileIDs.includes(it.ID)">
                <span title="多文件时，指全部文件总大小限制">文件最大限制：</span>
                <el-input placeholder="1 - 3000" size="mini" maxlength="4"
                :value='getMaxSizeValByID(it.ID)' @input="onMaxSizeChange($event, it.ID)"></el-input>
                <span>M</span>
              </div>
            </li>
            <li v-if="!loadingFileList && FileDataList.length === 0">
              <span class="is-gray is-font-size-12" style="line-height:16px">暂无文件类目列表，请到文件类目中添加</span>
            </li>
          </ul>
        </div>
      </ContionCommonComp>
    </main>
    <footer>
      <el-button @click="onSubmitClick" type="primary">保存</el-button>
      <el-button @click="onGoBackClick"><i class="el-icon-d-arrow-left"></i> 返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { ContionCommonComp } from '@/components/common/mpzj-sell-lib/lib';

export default {
  name: 'ProductFileSetPage',
  data() {
    return {
      ProductID: '',
      PartID: '',
      ProductName: '',
      titleType: '', // 产品 | 部件
      checkedFileList: [], // 普通工厂列表
      loadingFileList: true,
    };
  },
  components: {
    ContionCommonComp,
  },
  computed: {
    ...mapState('productManage', ['ProductManageList', 'ProductFilePropertyList', 'curEditFileData']),
    ...mapState('common', ['adAreaList', 'areaList', 'FileDataList']),
    ...mapGetters('common', ['allAdAreaTreeList', 'allProductClassify', 'allProductAndLevelList', 'allAreaTreeList']),
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
      return this.checkedFileList.map(it => it.ID);
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
      const i = this.checkedFileList.findIndex(_it => _it.ID === it.ID);
      if (i > -1) this.checkedFileList.splice(i, 1);
      else if (it.IsPrintFile) {
        this.checkedFileList = this.checkedFileList.filter(_it => !_it.IsPrintFile);
        this.checkedFileList.push({ ...it, IsRequired: false, MaxSize: '' });
      } else {
        this.checkedFileList.push({ ...it, IsRequired: false, MaxSize: '' });
      }
    },
    getIsRequiredByID(id) {
      const t = this.checkedFileList.find(_it => _it.ID === id);
      return t ? t.IsRequired : false;
    },
    requiredChange(id) {
      const t = this.checkedFileList.find(_it => _it.ID === id);
      if (t) t.IsRequired = !t.IsRequired;
    },
    getMaxSizeValByID(id) {
      const t = this.checkedFileList.find(_it => _it.ID === id);
      return t ? t.MaxSize : '';
    },
    onMaxSizeChange(e, id) {
      const t = this.checkedFileList.find(_it => _it.ID === id);
      if (t) t.MaxSize = e;
    },
    onGoBackClick() {
      this.$goback();
    },
    onSubmitClick() { // 点击保存
      const condition = this.$refs.oLeftCondition.getConditonResult();
      if (!condition) return;
      if (!this.checkedFileList || this.checkedFileList.length === 0) {
        this.messageBox.failSingleError('保存失败', '请勾选想要设置的文件类目');
        return;
      }
      const t = this.checkedFileList.find(it => !it.MaxSize || !this.$utils.getValueIsOrNotNumber(it.MaxSize, true) || it.MaxSize < 1 || it.MaxSize > 3000);
      if (t) {
        this.messageBox.failSingleError('保存失败', '最大限制不正确，必填，且应为1 - 3000整数类型');
        return;
      }
      const { ID, Priority, Constraint } = condition;
      const FileList = this.checkedFileList;
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
    async getFileInfoList() {
      await this.$store.dispatch('common/getFileInfoList');
      this.loadingFileList = false;
    },
  },
  mounted() {
    this.getPositionID();
    this.getFileInfoList();
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
    overflow: hidden;
    padding-top: 15px;
    .right-content {
      height: 100%;
      display: flex;
      flex-direction: column;

      > header {
        flex: none;
      }
    }
    .file-list-wrap {
      display: flex;
      height: 100%;
      overflow: auto;
      margin-right: 30px;
      > span {
        color: #888E99;
        font-size: 14px;
        margin-right: 10px;
        padding-top: 15px;
        white-space: nowrap;
      }
    }
    .right-content-main-wrap {
      height: 100%;
      flex: 1;
      overflow: hidden;
      .file-list {
        > li {
          padding: 9px 0;
          display: flex;
          align-items: center;
          height: 28px;
          > .el-checkbox {
            display: flex;
            align-items: center;
            > .el-checkbox__label {
              color: #585858;
              font-size: 12px;
              margin-top: -2px;
            }
            &:first-of-type {
              width: 280px;
              overflow: hidden;
              vertical-align: middle;
              margin-right: 0;
              > .el-checkbox__label {
                max-width: 280px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          > .max-size-box {
            display: flex;
            align-items: center;
            margin-left: 30px;
            > span {
              white-space: nowrap;
              font-size: 12px;
              color: #585858;
            }
            > .el-input {
              width: 86px;
              margin-left: 2px;
              margin-right: 6px;
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
