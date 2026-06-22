import { MpMessage } from '../utils/MpMessage';

declare const $: {
  connection: TConnection
};

type TConnection = {
  hub: {
    url: string
    qs: {
      userId: string
    }
    start: () => {
      done(callback: () => void);
      fail(callback: (err: unknown) => void);
    }
    stop: () => void
    disconnected(callback: () => void)
  }
  notifyHub: {
    client: {
      receiveNotification: null | ((msg: string) => void)
    }
  }
}

class SignalRService {
  notifyHub: null | TConnection['notifyHub']

  userId = ''

  basicUrl = process.env.NODE_ENV === 'production' ? '' : 'http://192.168.17.66:8050'

  constructor() {
    this.notifyHub = null;
  }

  private async joinScript() {
    const createLinks = (url: string) => {
      const t = document.head.querySelector(`script[src="${url}"]`);
      if (t) return true;

      return new Promise((resolve) => {
        const link = document.createElement('script');

        link.src = url;
        link.type = 'text/javascript';

        link.onload = () => {
          resolve(true);
        };

        link.onerror = () => {
          resolve(false);
        };

        document.head.appendChild(link);
      }) as Promise<boolean>;
    };

    if ((await createLinks(`${this.basicUrl}/Scripts/jquery-3.6.4.min.js`))
     && (await createLinks(`${this.basicUrl}/Scripts/jquery.signalR-2.4.3.min.js`))
     && (await createLinks(`${this.basicUrl}/signalr/hubs`))) {
      return true;
    }

    return false;
  }

  private initHub() {
    if (!this.userId) return;

    $.connection.hub.url = `${this.basicUrl}/signalr`;

    $.connection.hub.qs = {
      userId: this.userId,
    };

    this.notifyHub = $.connection.notifyHub;

    this.notifyHub.client.receiveNotification = (msg) => {
      window.dispatchEvent(
        new CustomEvent(
          'notification',
          { detail: msg },
        ),
      );
    };
  }

  private connection() {
    $.connection.hub.start()
      .done(() => {
        console.log('SignalR连接成功');
      })
      .fail(err => {
        console.log('连接失败:', err);

        setTimeout(() => {
          this.connection();
        }, 5000);
      });
  }

  private async watchReconnection() {
    $.connection.hub.disconnected(() => {
      console.log('连接断开');

      setTimeout(() => {
        console.log('尝试重连');

        this.connection();
      }, 5000);
    });
  }

  private starting = false;

  async start(userId: string) {
    if (!userId || this.starting) return;

    this.starting = true;

    this.userId = userId;

    try {
      const bool = await this.joinScript();
      if (!bool) {
        throw new Error('加载script文件失败');
      }

      this.initHub();

      this.watchReconnection();
      this.connection();
    } catch (error) {
      console.error(error);
      MpMessage.error('通知模块初始化失败', '请刷新重试');
      this.starting = false;
    }
  }

  async stop() {
    if (!this.starting) return;

    try {
      await $.connection.hub.stop();
      console.log('SignalR连接已停止');
    } catch (error) {
      console.error('停止连接时出错:', error);
    } finally {
      this.starting = false;
      this.notifyHub = null;
      this.userId = '';
    }
  }
}

export const signalR = new SignalRService();
