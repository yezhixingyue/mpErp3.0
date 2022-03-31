<template>
  <CommonDialogComp
    width="880px"
    top='11vh'
    :title="title"
    :visible.sync="visible"
    @submit="onSubmit"
    @cancle="onCancle"
    @open='onOpen'
    @closed='onClosed'
    class="mp-erp-comps-server-after-sale-question-change-dialog-comp-wrap"
  >
    <ul v-if="QuestionList" class="list">
      <li v-for="(it,index) in QuestionList" :key="it.key || it.ID" class="item">
        <span class="title">问题：</span>
        <!-- <el-select v-model="it.ID" placeholder="请选择" size="small">
          <el-option
            v-for="item in QuestionTypeList"
            :key="item.ID"
            :label="item.Title"
            :value="item.ID">
          </el-option>
        </el-select> -->
        <el-cascader
          v-model="it.ID"
          :options="options"
          :show-all-levels="false"
          :props="{ expandTrigger: 'hover', label: 'Name', value: 'ID' }" size="small"
        />
        <el-input size="small" v-model.trim="it.Remark" placeholder="在此输入备注信息" maxlength="200" show-word-limit></el-input>
        <el-select v-model="it.Department.ID" placeholder="责任部门" size="small">
          <el-option
            v-for="item in DepartmentList"
            :key="item.ID"
            :label="item.Title"
            :value="item.ID">
          </el-option>
        </el-select>
        <div class="menus">
          <span @click="onAddClick">
            <img src="@/assets/images/add.png" alt />添加</span>
          <span @click="onRemoveClick(index)" v-if="QuestionList.length > 1">
            <img src="@/assets/images/del.png" alt />删除</span>
          <span v-else class="disabled">
            <img src="@/assets/images/del-disabled.png" alt />删除</span>
        </div>
      </li>
    </ul>
  </CommonDialogComp>
</template>

<script>
import CommonDialogComp from '@/packages/CommonDialogComp';
import { mapState, mapGetters } from 'vuex';

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
  },
  components: {
    CommonDialogComp,
  },
  computed: {
    ...mapState('common', ['DepartmentList']),
    ...mapState('service', ['QuestionTypeList']),
    ...mapGetters('service', ['QuestionTypeLevelList']),
    options() {
      return this.QuestionTypeLevelList;
    },
  },
  data() {
    return {
      title: '问题修改',
      QuestionList: [],
    };
  },
  methods: {
    onSubmit() {
      if (!this.curData || !this.QuestionList || this.QuestionList.length === 0) return;
      // 校验
      const i = this.QuestionList.findIndex(it => (!it.ID && it.ID.length !== 2) || !it.Remark || (!it.Department.ID && it.Department.ID !== 0));
      if (i > -1) {
        this.messageBox.failSingleError('保存失败', `第${i + 1}行数据不完整， 请检查并补充完整`);
        return;
      }
      const QuestionList = this.QuestionList.map(it => {
        const { ID } = it;
        const _ID = ID[1];
        const t = this.QuestionTypeList.find(_it => _it.ID === _ID);
        const Title = t ? t.Name : '';
        return { ...it, Title, ID: _ID };
      });
      const _temp = {
        ID: this.curData.ID,
        QuestionList,
      };
      this.getServiceQuestionChange(_temp);
    },
    onCancle() { // 取消  关闭弹窗
      this.$emit('update:visible', false);
    },
    onOpen() { // 打开时初始化数据
      this.$nextTick(this.initEditData);
    },
    onClosed() { // 关闭 重置表单
      this.QuestionList = [];
    },
    async initEditData() { // 数据初始化方法
      if (this.curData) {
        await this.$store.dispatch('service/getQuestionTypeList');
        this.getServiceDetail(this.curData.ID);
        this.$store.dispatch('common/getAfterSalesDepartmentList');
      }
    },
    async getServiceDetail(id) {
      const resp = await this.api.getServiceDetail(id).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const { QuestionList } = resp.data.Data;
        const idTransformer = _id => {
          const t = this.QuestionTypeList.find(_it => _it.ID === _id);
          return t && t.ParentID !== -1 ? [t.ParentID, _id] : _id;
        };
        this.QuestionList = QuestionList.map(it => ({
          ...it,
          key: Math.random().toString(36).slice(-8),
          ID: idTransformer(it.ID),
        }));
      }
    },
    onAddClick() {
      const item = {
        Title: '',
        Remark: '',
        ID: '',
        Department: {
          ID: '',
          Name: '',
        },
        key: Math.random().toString(36).slice(-8),
      };
      this.QuestionList.push(item);
      this.$nextTick(() => {
        const oWrap = document.querySelector('.mp-erp-comps-server-after-sale-question-change-dialog-comp-wrap .el-dialog__body');
        this.$utils.animateScroll(oWrap.scrollTop, oWrap.scrollHeight, (num) => { oWrap.scrollTop = num; });
      });
    },
    onRemoveClick(i) {
      this.QuestionList.splice(i, 1);
    },
    async getServiceQuestionChange(data) {
      const resp = await this.api.getServiceQuestionChange(data).catch(() => {});
      if (resp && resp.data && resp.data.Status === 1000) {
        const cb = () => {
          this.onCancle();
        };
        this.messageBox.successSingle('保存成功', cb, cb);
      }
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-comps-server-after-sale-question-change-dialog-comp-wrap {

  .el-dialog__body {
    padding-left: 30px;
    margin-top:30px;
    padding-bottom: 52px;
    height: 470px;
    overflow-y: overlay;
    > .list {
      > .item {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        > .title {
          font-size: 14px;
          color: #585858;
          font-weight: 700;
          line-height: 28px;
          margin-right: 4px;
        }
        > .el-cascader {
          width: 140px;
          flex: none;
          margin-right: 10px;
          > .el-input {
            display: flex;
            align-items: center;
            .el-input__inner {
              border: none;
              border-bottom: 1px solid #eee;
              font-size: 12px;
              color: #585858;
              border-radius: 0;
              &::placeholder {
                color: #ccc;
              }
            }
          }
        }
        > .el-select{
          width: 120px;
          flex: none;
          margin-right: 18px;
          .el-input__inner {
            border: none;
            border-bottom: 1px solid #eee;
            font-size: 12px;
            color: #585858;
            border-radius: 0;
            &::placeholder {
              color: #ccc;
            }
          }
          &:first-of-type {
            .el-input__inner {
              &::placeholder {
                color: #888;
              }
            }
          }
        }
        > .el-input {
          margin-right: 18px;
          width: 320px;
          .el-input__inner {
            font-size: 12px;
            color: #989898;
            padding-right: 63px;
            &::placeholder {
              color: #ccc;
            }
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
    }
  }
}
.el-cascader-menu__wrap {
  height: 360px;
}
</style>
