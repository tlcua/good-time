// 在新建窗口的 preload.js 中接收父窗口传递过来的数据
const { ipcRenderer } = require("electron");
ipcRenderer.on("updateState", () => {
  const updateEvent = new Event("updateState");
  window.dispatchEvent(updateEvent);
});

function debounce(cb, delay = 1000) {
  let timer = null;
  return function (e) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      cb(e);
      timer = null;
    }, delay);
  };
}

function updateWindowSizeAndPosition() {
  const dbData = window.utools.db.get("lz-readingBook");
  
  let latest = {
    w: window.outerWidth,
    h: window.outerHeight,
    x: window.screenLeft,
    y: window.screenTop,
  };

  setInterval(() => {
    if (latest.w !== window.outerWidth || latest.h !== window.outerHeight || latest.x !== window.screenLeft || latest.y !== window.screenTop) {
      // 发生变化
      console.log("窗口变化！");
      latest = {
        w: window.outerWidth,
        h: window.outerHeight,
        x: window.screenLeft,
        y: window.screenTop,
      };
      let etemp = {
        ...dbData,
        readingBookState: {
          ...dbData.readingBookState,
          ...latest,
        },
      }
      console.log('etemp:',etemp);
      
      window.utools.db.put(etemp);
    }
  }, 1500);
}

// window.addEventListener(
//   "resize",
//   debounced_updateWindowSizeAndPosition
// );
// window.addEventListener('move',
//   debounced_updateWindowSizeAndPosition
// )

function getReadBookState() {
  const {
    readingBookState: { id },
  } = window.utools.db.get("lz-readingBook");

  const books = window.utools.db.get("lz-bookshelf");

  const readingBook = books.bookshelf.find(b => b.uniqueId === id);
}

function getUserState() { }

window.addEventListener("updateState", () => {
  getReadBookState();
  getUserState();
  updateWindowSizeAndPosition();
});
