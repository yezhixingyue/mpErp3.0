export default class {
  Constraint = null

  IsIncludeIncreasedProduct = false

  ProductClassList = []

  key = Math.random().toString(16).slice(-10)

  constructor(data) {
    if (data) {
      const { Constraint, IsIncludeIncreasedProduct, ProductClassList } = data;
      this.Constraint = Constraint || null;
      this.IsIncludeIncreasedProduct = IsIncludeIncreasedProduct || false;
      this.ProductClassList = ProductClassList || [];
    }
  }
}
