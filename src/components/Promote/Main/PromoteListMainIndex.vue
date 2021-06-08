<template>
  <section>
    <promote-main-table />
    <footer>
        <count-comp
         :count='count'
         :watchPage='promoteListRequestObj.Page'
         :handlePageChange='handlePageChange'
          />
    </footer>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import CountComp from '@/components/common/Count.vue';
import PromoteMainTable from './PromoteListMainTable.vue';

export default {
  components: {
    CountComp,
    PromoteMainTable,
  },
  computed: {
    ...mapState('promoteStore', ['count', 'promoteListRequestObj']),
  },
  methods: {
    ...mapActions('promoteStore', ['getPromoteList']),
    ...mapActions('common', ['getAllProductNames']),
    handlePageChange(page) {
      this.getPromoteList(page);
    },
  },
  mounted() {
    if (this.count === 0) {
      this.getPromoteList();
    }
    this.getAllProductNames();
  //  console.log(this.promoteListRequestObj.Page);
  },
};
</script>

<style>

</style>
