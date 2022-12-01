<template>
  <section class="mp-erp-print-breadth-class-manage-page-wrap">
    <main>
      <p class="menu">
        <el-button type="primary" @click="onSaveClick(null)">添加分类</el-button>
      </p>
      <ul class="list">
        <li class="list-item" v-for="it in BreadthCLassList" :key="it.ID">
          <span>{{it.Name}}</span>
          <div>
            <span @click="onSaveClick(it)"><i></i>编辑</span>
            <span @click="onRemoveClick(it)"><i></i>删除</span>
          </div>
        </li>
        <li v-if="BreadthCLassList.length === 0" class="tip">分类为空，快点击上方按钮添加吧</li>
      </ul>
      <BreadthClassSaveDialog :visible.sync='visible' :curData='saveData' @submit='onSubmit' />
    </main>
    <footer>
      <el-button @click="onGoBackClick">返回</el-button>
    </footer>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import BreadthClassSaveDialog from '@/components/PrintBreadth/BreadthClassSaveDialog.vue';

export default {
  name: 'PrintFormatClassManagePage',
  components: {
    BreadthClassSaveDialog,
  },
  computed: {
    ...mapState('basicSet', ['BreadthCLassList']),
  },
  data() {
    return {
      visible: false,
      saveData: null,
    };
  },
  methods: {
    onGoBackClick() {
      this.$router.replace('/PrintFormatList');
    },
    onSaveClick(data) {
      this.saveData = data || null;
      this.visible = true;
    },
    async onSubmit(data) {
      const resp = await this.api.getBreadthClassSave(data).catch(() => {});
      if (resp && resp.status === 200 && resp.data.Status === 1000) {
        const isEdit = !!(data.ID || data.ID === 0);
        const msg = isEdit ? '编辑成功' : '添加成功';
        const callback = () => {
          this.$store.commit('basicSet/setBreadthClassSave', { isEdit, data, ID: resp.data.Data });
          this.visible = false;
        };
        this.messageBox.successSingle(msg, callback, callback);
      }
    },
    onRemoveClick(data) {
      if (!data) return;
      this.messageBox.warnCancelBox('确定删除该分类吗', `分类名称：[ ${data.Name} ]`, () => {
        this.$store.dispatch('basicSet/getBreadthClassRemove', data.ID);
      });
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-print-breadth-class-manage-page-wrap {
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-left: 6px;
  > main {
    flex: 1;
    background-color: #fff;
    padding-left: 20px;
    max-height: calc(100% - 75px);
    > p.menu {
      padding: 40px 0;
      > button {
        border-radius: 5px;
        width: 125px;
        height: 35px;
        padding: 0;
      }
    }
    > ul.list {
      width: 750px;
      height: calc(100% - 150px);
      overflow-y: auto;
      margin-top: 4px;
      > li.list-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
        height: 44px;
        align-items: center;
        box-sizing: border-box;
        padding-top: 8px;
        > span {
          font-size: 14px;
          color: #585858;
          padding-left: 16px;
        }
        > div {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-right: 16px;
          > span {
            color: #a2a2a2;
            transition: color 0.05s ease-in-out;
            cursor: pointer;
            margin: 0 10px;
            display: flex;
            align-items: center;
            user-select: none;
            font-size: 12px;
            &:hover {
              color: #444;
            }
            > i {
              width: 16px;
              height: 16px;
              background: url(../../../assets/images/Compile.png) no-repeat center center/14px 14px;
              margin-right: 4px;
            }
            &:last-of-type > i {
              background: url(../../../assets/images/del.png) no-repeat center center/12px 16px;
            }
          }
        }
      }
      > .tip {
        color: #989898;
        font-size: 12px;
        > i {
          font-size: 16px;
        }
      }
    }
  }
  > footer {
    flex: none;
    height: 75px;
    background-color: #fff;
    font-size: 13px;
    text-align: left;
    padding-left: 270px;
    > button {
      border-color: #26bcf9;
      color: #26bcf9;
      width: 120px;
      height: 35px;
      border-radius: 3px;
      padding: 0;
      &:active {
        border-color: #428dfa;
        color: #428dfa;
      }
    }
  }
}
</style>
