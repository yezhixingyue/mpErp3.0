<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  render() {
    const propertyName = this.value.Property && this.value.Property.Type !== 255
      ? this.value.Property.Name
      : '';

    const handleInput = (val) => {
      this.$emit('change', { ...this.value, Value: val.trim() });
    };
    const handleSelect = () => {
      this.$emit('select', this.value.key);
    };

    const showInput = !this.value.Property || (this.value.Property && this.value.Property.Type === 255);
    const valueClass = showInput ? 'showInput value' : 'value';

    return (
      <li>
        <span class="label">{this.value.label}：</span>
        <span class={valueClass}>{ propertyName }</span>
        {
          showInput && <el-input size="small" maxlength="9" value={this.value.Value} on-input={handleInput} />
        }
        <span class="blue-span" onClick={handleSelect}>设置</span>
      </li>
    );
  },
};
</script>
