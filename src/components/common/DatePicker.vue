<template>
  <el-popover
           placement="bottom" v-model="visible" popper-class="order-time-select" trigger="click">
            <div class="select-block-wrap">
              <div class="block">
                <span>开始日期:</span>
                <el-date-picker
                  v-model="beginTime" value-format="yyyy-MM-dd" type="date" placeholder="选择开始日期">
                </el-date-picker>
              </div>
              <div class="totext-box">至</div>
              <div class="block">
                <span>结束日期:</span>
                <el-date-picker
                  v-model="endTime" value-format="yyyy-MM-dd" type="date" placeholder="选择结束日期"
                ></el-date-picker>
              </div>
            </div>
            <div class="select-btn-wrap">
              <normalBtn title="确定"  @click.native="onSelectTimeSubmit" />
            </div>
            <span slot="reference">
              <span v-if="!key" style="line-height:14px;vertical-align:10%;">
                自定义时间
                <i>
                  <img  style="vertical-align:text-middle;"
                   src="@/assets/images/timeselect.png" alt />
                </i>
              </span>
              <span v-else style="font-size:13px;line-height:13px;vertical-align:10%;">
                {{begin}}
                <span style="font-size:12px;margin:0 2px;vertical-align:0%;">至</span>
                {{end}}
                <i><img class="date-img" src="@/assets/images/timeselect.png" alt /></i>
              </span>
            </span>
          </el-popover>
</template>

<script>
import normalBtn from '@/components/common/normalBtn.vue';

export default {
  data() {
    return {
      beginTime: '',
      endTime: '',
      begin: '',
      end: '',
      key: false,
    //   visible: false, // 传递
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    normalBtn,
  },
  methods: {
    onSelectTimeSubmit() {
      if (!this.endTime || !this.beginTime) {
        this.visible = false;
        this.key = false;
        return;
      }
      if (this.endTime < this.beginTime) {
        this.messageBox.failSingleError('注意', '[ 结束日期不能小于开始日期 ]');
        return;
      }
      const obj = { First: '', Second: '' };
      const beginTime = `${this.beginTime}T00:00:00.000Z`;
      const endTime = `${this.endTime}T23:59:59.997Z`;
      obj.First = beginTime;
      obj.Second = endTime;
      const bool = JSON.stringify(this.objForOrderList.PlaceDate) === JSON.stringify(obj);
      if (!bool) {
        this.setSelectTime(['timeSelect', 5, obj]);
        this.getTableData();
      }
      this.begin = this.beginTime;
      this.end = this.endTime;
      this.key = true;
      this.visible = false;
    },
  },
};
</script>

<style>

</style>
