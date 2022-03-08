import { mount, createLocalVue } from '@vue/test-utils';
import LogisticManageListPage from '@/views/LogisticManage/LogisticManageListPage.vue';
import ElementUI from 'element-ui';
import { dialogDraghandleObj } from '../../../src/assets/js/utils/dialogDrag';

const localVue = createLocalVue();
localVue.use(ElementUI);
localVue.directive('dialogDrag', dialogDraghandleObj);

describe('LogisticManageListPage', () => {
  it('testVisible', () => { // 测试弹窗状态
    const wrapper = mount(LogisticManageListPage, {
      data() {
        return {
          visible: false,
        };
      },
      localVue,
    });
    expect(wrapper.vm.visible).toBe(false);
    const button = wrapper.find('.el-button');
    expect(button.exists()).toBe(true);
    button.trigger('click');
    expect(wrapper.vm.visible).toBe(true);
  });

  it('testSorting', () => { // 测试排序状态
    const wrapper = mount(LogisticManageListPage, {
      data() {
        return {
          sorting: false,
          tableData: [123],
        };
      },
      localVue,
    });
    expect(wrapper.vm.sorting).toBe(false);
    const button = wrapper.find('.cancel-blue-btn');
    expect(button.exists()).toBe(true);
    button.trigger('click');
    expect(wrapper.vm.sorting).toBe(true);
  });
});
