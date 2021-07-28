<template>
  <section class="mp-erp-express-manage-list-page-wrap">
    <header>
      <div>
        <el-button type="primary" @click="onExpressDialogOpen(null)">添加物流快递</el-button>
        <el-dialog
          title="添加物流快递"
          :visible.sync="showDialog"
          :modal='false'
          width="650px"
          top='20vh'
          v-dialogDrag
          class="mp-img-style-header new-dialog-styles mp-erp-express-add-dialog-wrap"
          :before-close="handleAreaDialogClose">
          <section>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
              <el-form-item label="名称:" prop="Name">
                <el-input v-model="ruleForm.Name" maxlength="12" show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="分类:" prop="Classify">
                <el-radio-group v-model="ruleForm.Classify">
                  <el-radio label="自建"></el-radio>
                  <el-radio label="物流"></el-radio>
                  <el-radio label="快递"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="是否启用:" prop="Enable">
                <el-switch v-model="ruleForm.Enable"></el-switch>
              </el-form-item>
            </el-form>
          </section>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm" class="is-blue-button">保存</el-button>
            <el-button @click="handleAreaDialogClose">取消</el-button>
          </span>
        </el-dialog>
      </div>
    </header>
    <main>
      <ExpressManageListTableComp @exitSorting='setSortingClose' ref="SortTable" :dataList='tableData' :sorting='sorting' />
    </main>
    <footer>
      <template v-if="!sorting">
        <el-button @click="onSortBtnClick" class="cancel-blue-btn">排序</el-button>
      </template>
      <template v-else>
        <el-button @click="onSubmitSortClick" type="primary">保存</el-button>
        <el-button @click="setSortingClose" class="cancel-blue-btn">取消</el-button>
      </template>
    </footer>
  </section>
</template>

<script>
import ExpressManageListTableComp from '@/components/ExpressManageComps/ExpressManageListTableComp.vue';

export default {
  name: 'ExpressListPage',
  components: {
    ExpressManageListTableComp,
  },
  data() {
    return {
      showDialog: false,
      ruleForm: {
        Name: '',
        Classify: '',
        Enable: true,
        ID: '',
      },
      rules: {
        Name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 12, message: '长度在 1 到 12 个字符', trigger: 'blur' },
        ],
        Classify: [
          { required: true, message: '请选择分类', trigger: 'change' },
        ],
      },
      sorting: false,
      tableData: [
        {
          date: '2016-05-02',
          name: '京东物流[外]',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '中通快递[外]',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '名片之家[外]',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '顺丰快递物流[外]',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
    };
  },
  methods: {
    handleAreaDialogClose() {
      this.$refs.ruleForm.resetFields();
      this.showDialog = false;
    },
    onExpressDialogOpen(data) {
      this.ruleForm = data ? { ...data } : { Name: '', Classify: '', Enable: true, ID: '' };
      this.showDialog = true;
    },
    submitForm() {
      if (!this.showDialog) return;
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log('验证通过,可以保存', this.ruleForm);
        }
      });
    },
    onSortBtnClick() {
      if (!this.tableData || this.tableData.length === 0) return;
      this.sorting = true;
    },
    onSubmitSortClick() {
      console.log('onSubmitSortClick', this.$refs.SortTable.handleSortSubmit());
    },
    setSortingClose() {
      // 此处执行原始表格数据还原 已不需要 只执行关闭
      this.sorting = false;
    },
  },
};
</script>
<style lang='scss'>
.mp-erp-express-manage-list-page-wrap {
  display: flex;
  flex-direction: column;
  > header {
    background-color: #f5f5f5;
    height: 90px;
    width: 100%;
    flex: none;
    > div {
      width: 100%;
      height: 80px;
      background-color: #fff;
      display: flex;
      align-items: center;
      padding-left: 26px;
      box-sizing: border-box;
      > button {
        border-radius: 2px;
        width: 130px;
        height: 35px;
        padding: 0;
      }
      .mp-erp-express-add-dialog-wrap {
        .el-dialog__body {
          > section {
            width: 420px;
            padding-bottom: 36px;
            padding-top: 25px;
            padding-left: 36px;
            .el-form-item {
              height: 30px;
              .el-form-item__label {
                height: 30px;
                line-height: 30px;
                color: #888E99;
                padding-right: 15px;
              }
              .el-form-item__content {
                height: 30px;
                line-height: 30px;
                color: #585858;
                .el-input {
                  height: 30px;
                  line-height: 30px;
                  .el-input__inner {
                    height: 30px;
                    line-height: 28px;
                  }
                  .el-input__suffix {
                    top: 2px;
                  }
                }
                .el-radio-group {
                  .el-radio__label {
                    color: #585858;
                  }
                }
              }
            }
          }
        }
        .el-dialog__footer {
          text-align: center;
          padding-bottom: 40px;
          button {
            width: 120px;
            height: 30px;
            padding: 0;
            & + button {
              margin-left: 30px;
            }
          }
        }
      }
    }
  }
  > main {
    flex: 1;
  }
  > footer {
    flex: none;
    text-align: center;
    padding-bottom: 80px;
    padding-top: 25px;
    button.el-button {
      width: 120px;
      height: 35px;
      border-radius: 2px;
      padding: 0;
      & + button.el-button {
        margin-left: 30px;
      }
    }
  }
}
</style>
