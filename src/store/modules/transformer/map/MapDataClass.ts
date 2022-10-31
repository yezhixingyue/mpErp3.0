import { nextTick } from 'vue';
import { TransformerListPageDataPlainType } from '../TransformerListPageDataClass';

/**
 * 抽象类 - 映射父类
 *
 * @export
 * @abstract
 * @class MapDataClass
 * @template L
 * @template R
 * @template P
 */
export abstract class MapDataClass<L, R, P, M> {
  /**
   * 转换器ID
   *
   * @protected
   * @memberof MapDataClass
   */
  public ServerID = ''

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

  /** 当前页面数据  TransformerListPageDataClass */
  curPageData: null | TransformerListPageDataPlainType = null

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

  /**
   * 单个项目保存
   *
   * @abstract
   * @param {P} data
   * @returns {Promise<void>}
   * @memberof MapDataClass
   */
  public abstract saveItem(data: P): Promise<void>

  constructor(data: string | TransformerListPageDataPlainType | null) {
    if (typeof data === 'string') {
      this.ServerID = data;
      this.curPageData = null;
    } else if (data) {
      this.ServerID = data.ServerID;
      this.curPageData = data;
    }

    if (this.ServerID) this.getData(); // 获取数据
  }

  /** 获取全部数据： 左侧、右侧及映射数据 */
  protected async getData() {
    await nextTick();
    this.loading = true;
    const respArr = await Promise.all([this.getLeftList(), this.getRightList(), this.getMapList()]);
    this.loading = false;

    const [leftResArr, rightResArr, mapResArr] = respArr;

    this.leftDataList = leftResArr || [];
    this.rightDataList = rightResArr || [];
    this.mapDataList = mapResArr || [];

    this.loaded();
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-empty-function
  loaded() {}
}
