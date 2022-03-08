import { mount, createLocalVue } from '@vue/test-utils';
import LogisticItemSaveDialog from '@/components/LogisticManageComps/LogisticItemSaveDialog';
import ElementUI from 'element-ui';
import { dialogDraghandleObj } from '../../../src/assets/js/utils/dialogDrag';

const localVue = createLocalVue();
localVue.use(ElementUI);
localVue.directive('dialogDrag', dialogDraghandleObj);

describe('LogisticItemSaveDialog', () => {
  it('testInitFormData', async () => {
    const wrapper = mount(LogisticItemSaveDialog, {
      propsData: {
        visible: false,
      },
      localVue,
    });
    expect(wrapper.find('.demo-ruleForm').exists()).toBe(false);
    expect(wrapper.vm.visible).toBe(false);
    expect(wrapper.vm.ruleForm).toBe(null);
    expect(wrapper.isVisible()).toBe(false);
    await wrapper.setProps({ visible: true });
    expect(wrapper.vm.visible).toBe(true);
    expect(wrapper.isVisible()).toBe(true);
    const oForm = wrapper.find('.demo-ruleForm');
    expect(oForm.exists()).toBe(true);
  });
});
