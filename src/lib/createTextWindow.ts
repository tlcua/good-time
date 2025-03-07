export function createTextWindow() {
  try {
    const ubWindow = utools.createBrowserWindow(
      "textWindow/index.html",
      {
        useContentSize: true,
        skipTaskbar: true,
        width: 300,
        height: 200,
        x: 200,
        y: 200,
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        backgroundColor: '#1f1f1f',
        hasShadow: false,
        webPreferences: {
          preload: "textWindow/preload.js",
          zoomFactor: 0
        },
      },
      () => {
        // 显示
        ubWindow.show();
        // 置顶
        //   ubWindow.setAlwaysOnTop(true);
        // 窗口全屏
        //   ubWindow.setFullScreen(true);
        // 向子窗口发送消息
        ubWindow.webContents.send("updateState", "");
        ubWindow.webContents.openDevTools();
      }
    );
    return ubWindow;
  } catch (error) {
    console.log('error:', error);
  }
}