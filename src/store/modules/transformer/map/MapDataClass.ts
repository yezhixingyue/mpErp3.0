export abstract class MapDataClass<L, R, M> {
  /**
   * 转换器ID
   *
   * @protected
   * @memberof MapDataClass
   */
  protected ServerID = ''

  /**
   * 左侧列表数据
   *
   * @type {L[]}
   * @memberof MapDataClass
   */
  leftDataList: L[] = []

  /**
   * 右侧列表数据
   *
   * @type {R[]}
   * @memberof MapDataClass
   */
  rightDataList: R[] = []

  /**
   * 映射信息列表数据
   *
   * @type {M[]}
   * @memberof MapDataClass
   */
  mapDataList: M[] = []

  loading = false

  /**
   * 获取左侧数据的方法-子类实现
   *
   * @protected
   * @abstract
   * @returns {(Promise<null | L[]>)}
   * @memberof MapDataClass
   */
  protected abstract getLeftList(): Promise<null | L[]>

  /**
   * 获取右侧数据的方法-子类实现
   *
   * @protected
   * @abstract
   * @returns {(Promise<null | R[]>)}
   * @memberof MapDataClass
   */
  protected abstract getRightList(): Promise<null | R[]>

  /**
   * 获取映射数据的方法-子类实现
   *
   * @protected
   * @abstract
   * @returns {(Promise<null | M[]>)}
   * @memberof MapDataClass
   */
  protected abstract getMapList(): Promise<null | M[]>

  constructor(ServerID: string) {
    this.ServerID = ServerID;
    console.log('1. MapDataClass 抽象类 constructor ');
    this.getData(); // 获取数据
  }

  /** 获取全部数据： 左侧、右侧及映射数据 */
  protected async getData() {
    this.loading = true;
    const respArr = await Promise.all([this.getLeftList(), this.getRightList(), this.getMapList()]);
    this.loading = false;

    const [leftResArr, rightResArr, mapResArr] = respArr;

    this.leftDataList = leftResArr || [];
    this.rightDataList = rightResArr || [];
    this.mapDataList = mapResArr || [];

    this.combine();
  }

  /** 合并左侧、右侧及映射数据为合并数据 */
  protected combine() {
    console.log('combine 合并结果', this.leftDataList, this.rightDataList, this.mapDataList);
  }

  // 3组数据组合方法 -- 后续看是在此处实现 还是在子类中实现
}
