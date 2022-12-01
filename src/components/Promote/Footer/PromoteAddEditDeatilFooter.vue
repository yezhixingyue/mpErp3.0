<template>
  <div class="promote-add-edit-detail-footer-wrap">
    <normal-btn-full
      v-if="type !== 'detail' && Permission.PermissionList.PermissionPromote.Obj.Setup"
      class="save-btn"
      title="保存"
      @click.native="handleSubmit"
     />
    <normal-btn class="return-btn" @click.native="onReturnClick" title="返回" />
  </div>
</template>

<script>
import normalBtnFull from '@/components/common/normalBtnFull.vue';
import normalBtn from '@/components/common/normalBtn.vue';
import { mapMutations, mapActions, mapState } from 'vuex';

export default {
  components: {
    normalBtnFull,
    normalBtn,
  },
  data() {
    return {
      type: '',
    };
  },
  computed: {
    ...mapState('common', ['Permission']),
  },
  methods: {
    ...mapMutations('promoteStore', ['setPromoteStaffList']),
    ...mapActions('promoteStore', ['getPromoteList']),
    onReturnClick() {
      this.$router.push('/promoteList');
    },
    handleSubmit() {
      this.$store.dispatch('promoteStore/savePromote', [() => {
        this.onReturnClick();
        this.getPromoteList();
        this.setPromoteStaffList(null);
      }, this.type]);
    },
  },
  mounted() {
    this.type = this.$route.params.type;
  },
};
</script>

<style lang='scss'>
.promote-add-edit-detail-footer-wrap {
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  > .save-btn, > .return-btn {
    margin: 0;
    width: 120px;
    height: 30px;
    border-radius: 2px;
  }
  > .save-btn {
    background: linear-gradient(to right, #26bcf9, #35dff9);
    border: none;
  }
  > .return-btn {
    margin-left: 50px;
  }
}
</style>
