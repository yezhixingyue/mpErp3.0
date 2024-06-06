import { Loading } from 'element-ui';
// import 'element-plus/es/components/loading/style/css';

export class LoadingHandler {
  private count = 0

  private loadingInstance: ReturnType<(typeof Loading)['service']> | null = null

  display() {
    this.count += 1;
    this.loadingInstance = Loading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(255, 255, 255, 0.3)',
      customClass: 'mp-general-loading-box',
    });
  }

  hidden() {
    this.count -= 1;
    if (this.count < 0) this.count = 0;
    if (this.count === 0 && this.loadingInstance) this.loadingInstance.close();
  }

  hiddenByForce() {
    this.count = 0;
    if (this.loadingInstance) this.loadingInstance.close();
  }
}
