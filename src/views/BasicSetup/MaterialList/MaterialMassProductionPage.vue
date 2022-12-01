<template>
  <section v-if="curMaterialType" class="mp-erp-material-mass-production-page-wrap">
    <header>
      <p>
        <span>当前物料类型：</span>
        <span>{{curMaterialType.Name}}</span>
      </p>
      <el-button type="primary" @click="onCreateClick">生成规则</el-button>
    </header>
    <main>
      <MaterialListMassProductionDialog :visible.sync='visible' :curMaterialType='curMaterialType' @submit="onDialogSubmit" />
      <ul class="list">
        <li v-for="(it,i) in ElementList" :key="it.key" class="list-item" :class="it.repeat?'repeat':''" :title="it.repeat?'标红为重复项，请删除至一项':''">
          <span>{{getItemName(it)}}</span>
          <div @click="onItemRemove(i)">
            <i></i>
            <span>删除</span>
          </div>
        </li>
      </ul>
    </main>
    <footer>
      <el-button type="primary" @click="onSubmit" :disabled='ElementList.length === 0' class="blue-full-color-btn-styles is-blue-button">保存</el-button>
      <el-button class="goback" @click="onGoback('')">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import MaterialListMassProductionDialog from '@/components/Material/MaterialList/MaterialListMassProductionDialog.vue';

export default {
  name: 'MaterialMassProductionPage',
  components: {
    MaterialListMassProductionDialog,
  },
  computed: {
    ...mapState('basicSet', ['MaterialTypeList']),
  },
  data() {
    return {
      curMaterialType: null,
      visible: false,
      ElementList: [],
    };
  },
  methods: {
    getInitData() {
      if (!this.MaterialTypeList) return;
      const { type } = this.$route.params;
      const t = this.MaterialTypeList.find(it => it.ID === type);
      if (t) {
        this.curMaterialType = t;
      } else {
        this.$message.error('未获取到物料类型信息，请刷新重试');
      }
    },
    getItemName({ Second }) {
      if (!Second || !Array.isArray(Second) || Second.length === 0) return '';
      // console.log(Second, Second.map(it => it.Third).join(' '));
      return Second.map(it => it.Third).join(' ');
    },
    onItemRemove(i) {
      const [t] = this.ElementList.splice(i, 1);
      if (t.repeat) {
        this.ElementList = this.ElementList.map(it => ({ ...it, repeat: false }));
        this.itemRepeatChecker();
      }
    },
    async getMaterialSave(data) {
      const resp = await this.api.getMaterialSave(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const cb = () => {
          this.onGoback('?init=true');
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
    onSubmit() {
      const t = this.ElementList.find(it => it.repeat);
      if (t) {
        this.messageBox.failSingleError('操作失败', '存在重复项，请先清除');
        return;
      }
      const temp = {
        TypeID: this.curMaterialType.ID,
        ElementList: this.ElementList.map(it => ({ First: '', Second: it.Second.map(_it => ({ First: _it.First, Second: _it.Second })) })),
      };
      this.getMaterialSave(temp);
    },
    onGoback(str) {
      this.ElementList = [];
      this.curMaterialType = null;
      this.visible = false;
      this.$router.replace(`/MaterialList${str}`);
    },
    onCreateClick() {
      this.visible = true;
    },
    itemRepeatChecker() { // 重复项判断
      if (this.ElementList.length === 0) return;
      this.ElementList.forEach((it, index) => {
        const { Second, repeat } = it;
        if (!repeat) {
          this.ElementList.forEach((_it, i) => {
            if (i > index) {
              let isRepeat = true;
              for (let _index = 0; _index < Second.length; _index += 1) {
                const nowProp = Second[_index];
                const testProp = _it.Second[_index];
                if (nowProp.Second !== testProp.Second && nowProp.First === testProp.First) {
                  isRepeat = false;
                  return;
                }
              }
              if (isRepeat) {
                const nowItem = it;
                const testItem = _it;
                nowItem.repeat = true;
                testItem.repeat = true;
              }
            }
          });
        }
      });
    },
    onDialogSubmit({ type, ElementList }) {
      // console.log(ElementList, this.ElementList);
      if (type === 'append') {
        this.ElementList.push(...ElementList);
        if (this.ElementList.length > ElementList.length) {
          // 触发重复判断
          this.ElementList = this.ElementList.map(it => ({ ...it, repeat: false }));
          this.itemRepeatChecker();
        }
      }
      if (type === 'refresh') {
        this.ElementList = ElementList;
      }
    },
  },
  mounted() {
    this.getInitData();
  },
  activated() {
    this.getInitData();
  },
};
</script>
<style lang='scss'>
.mp-erp-material-mass-production-page-wrap {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 6px;
  > header {
    padding-top: 30px;
    padding-left: 20px;
    font-size: 15px;
    font-weight: bold;
    color: #21CAE3;
    background-color: #fff;
    flex: none;
    > p {
      padding-bottom: 45px;
    }
    > button {
      width: 125px;
      height: 35px;
      padding: 0;
      border-radius: 5px;
    }
  }
  > main {
    flex: 1;
    background-color: #fff;
    padding-left: 20px;
    padding-top: 40px;
    > .list {
      > .list-item {
        display: flex;
        color: #585858;
        font-size: 14px;
        height: 36px;
        width: 718px;
        border-bottom: 1px solid #eee;
        align-items: center;
        padding: 8px 16px 0;
        justify-content: space-between;
        > div {
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          user-select: none;
          > i {
            width: 16px;
            height: 16px;
            background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
            margin-right: 4px;
          }
          > span {
            color: #a2a2a2;
          }
          &:hover {
            > span {
              color: #585858;
            }
          }
        }
        &.repeat {
          border-color: #ff3769;
          color: #ff3769;
        }
      }
    }
  }
  > footer {
    flex: none;
    height: 45px;
    background-color: #fff;
    font-size: 13px;
    padding: 15px 20px;
    padding-left: 215px;
    padding-bottom: 25px;
    > button.el-button {
      width: 120px;
      height: 35px !important;
      padding: 0;
      border-radius: 3px;
      & + button.el-button {
        margin-left: 30px;
      }
      &.blue-full-color-btn-styles.is-disabled {
        background-color: #ccc;
      }
    }
  }
}
</style>
