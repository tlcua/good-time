const { ipcRenderer } = require('electron');
const fs = require('node:fs');

ipcRenderer.on('updateState', () => {
  window.reader = new LocaleReader();
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

class LocaleReader {
  /**
   * @readonly
   */
  static ReaderStoreId = 'lz-reader';
  /**
   * @readonly
   */
  static Bookshelf = 'lz-bookshelf';
  /**
   * @readonly
   */
  static TextContextEl = '.text-content';
  /**
   * @readonly
   */
  static precentEl = '.percent';

  $content = document.querySelector(LocaleReader.TextContextEl);

  $percent = document.querySelector(LocaleReader.precentEl);

  $percent_Input = this.$percent.querySelector('input');

  constructor() {
    const {
      readingBookState: { id }
    } = window.utools.db.get(LocaleReader.ReaderStoreId);

    this.books = window.utools.db.get(LocaleReader.Bookshelf);

    const readingBook = this.books.bookshelf.find((b) => b.filePath === id);
    /**
     * @type {import('../../src/hooks').LocaleBook}
     */
    this.readingBook = readingBook;

    this.content = fs.readFileSync(this.readingBook.filePath, { encoding: 'utf-8' });

    this.userConfig = {
      style: {
        color: '#48714f',
        background: '#1f1f1f',
        'font-size': '14px',
        'font-family': "'Microsoft YaHei',Arial,Helvetica,sans-serif"
      },
      size: 1000
    };
    this.init();
  }

  init() {
    this.bindEvents();

    this.applyUserStyle();

    this.updateChapterContent();

    this.updateRenderContent();

    this.updateWindowSizeAndPosition();
  }

  applyUserStyle() {
    Object.entries(this.userConfig.style).forEach(([k, v]) => document.body.style.setProperty(k, v));
  }

  bindEvents() {

    this.$percent.addEventListener('mouseenter', () => {
      this.$content.classList.remove('hidden');
    });
    this.$percent.addEventListener('mouseleave', () => {
      this.$content.classList.add('hidden');
    });



    this.$percent_Input.addEventListener('change', (e) => {
      const v = Math.max(Math.min(Number(e.target.value), 100), 0) * 0.01;
      this.readingBook.readingProgress = this.calcPositionByPercent(v);
      this.updateChapterContent();
      this.updateRenderContent();
    });

    this.$percent_Input.addEventListener('keydown', (e) => e.stopPropagation());
    window.addEventListener('keydown', (e) => {
      const [nextKey, prevKey] = ['Space', 'ArrowLeft'];
      switch (e.code) {
        case nextKey:
          this.handleNextProgress();
          this.updateRenderContent();
          this.debouncedUpdateReadingBookDBData();
          break;
        case prevKey:
          this.handlePrevProgress();
          this.updateRenderContent();
          this.debouncedUpdateReadingBookDBData();
          break;
      }
    });
  }

  chapterContent = '';
  updateChapterContent() {
    const chapter = this.readingBook.chapters[this.readingBook.readingProgress.chapterIndex];
    this.chapterContent = this.content.slice(chapter.start, chapter.end);
    // TODO 应用过滤 & 替换规则
  }

  updateRenderContent() {
    this.updateConTent(
      this.chapterContent.slice(
        this.readingBook.readingProgress.chapterPs,
        this.readingBook.readingProgress.chapterPs + this.userConfig.size + 1
      )
    );
  }

  updateReadingBookDBData() {
    this.books._rev = window.utools.db.get(LocaleReader.Bookshelf)._rev;
    window.utools.db.put(this.books);
  }

  debouncedUpdateReadingBookDBData = debounce(() => {
    this.updateReadingBookDBData();
  });

  updateConTent(val) {
    this.$content.innerText = val;
    this.$percent_Input.value = this.calcPercentByPosition();
  }

  calcPositionByPercent(percent) {
    const pos = Math.floor(this.readingBook.totalSize * percent);
    const chapterIndex = this.readingBook.chapters.findIndex((c) => pos >= c.start && pos <= c.end);
    const chapter = this.readingBook.chapters[chapterIndex];
    let chapterPs = Math.floor((pos - chapter.start) / this.userConfig.size) * this.userConfig.size;
    return {
      chapterIndex,
      chapterPs
    };
  }

  calcPercentByPosition() {
    const chapter = this.readingBook.chapters[this.readingBook.readingProgress.chapterIndex];
    return Math.min(
      ((chapter.start + this.readingBook.readingProgress.chapterPs + this.userConfig.size) /
        this.readingBook.totalSize) *
        100,
      100
    ).toFixed(2);
  }

  handleNextProgress() {
    if (this.readingBook.readingProgress.chapterPs + this.userConfig.size > this.chapterContent.length) {
      // 超出
      if (this.readingBook.chapters.length > this.readingBook.readingProgress.chapterIndex + 1) {
        // 还有下一章
        this.readingBook.readingProgress.chapterIndex++;
        this.readingBook.readingProgress.chapterPs = 0;
        this.updateChapterContent();
      } else {
        // TODO
        console.log('结束');
      }
    } else {
      this.readingBook.readingProgress.chapterPs += this.userConfig.size;
    }
  }

  handlePrevProgress() {
    if (this.readingBook.readingProgress.chapterPs === 0) {
      // 跳转上一章
      if (this.readingBook.readingProgress.chapterIndex === 0) {
        // TODO 已经是第一章
        console.log('已经是第一章');
      } else {
        this.readingBook.readingProgress.chapterIndex--;
        this.readingBook.readingProgress.chapterPs =
          this.chapterContent.length - (this.chapterContent.length % this.userConfig.size);
        this.updateChapterContent();
      }
    } else {
      // 本章内
      this.readingBook.readingProgress.chapterPs = Math.max(
        this.readingBook.readingProgress.chapterPs - this.userConfig.size,
        0
      );
    }
  }

  timerForWindowUpdate = null;
  updateWindowSizeAndPosition() {
    let latest = {
      w: window.outerWidth,
      h: window.outerHeight,
      x: window.screenLeft,
      y: window.screenTop
    };

    if (this.timerForWindowUpdate) {
      clearInterval(this.timerForWindowUpdate);
      this.timerForWindowUpdate = null;
    }

    this.timerForWindowUpdate = setInterval(() => {
      if (
        latest.w !== window.outerWidth ||
        latest.h !== window.outerHeight ||
        latest.x !== window.screenLeft ||
        latest.y !== window.screenTop
      ) {
        // 发生变化
        console.log('窗口变化！');
        latest = {
          w: window.outerWidth,
          h: window.outerHeight,
          x: window.screenLeft,
          y: window.screenTop
        };
        const dbData = window.utools.db.get(LocaleReader.ReaderStoreId);
        let etemp = {
          ...dbData,
          readingBookState: {
            ...dbData.readingBookState,
            ...latest
          }
        };
        window.utools.db.put(etemp);
      }
    }, 1500);
  }
}
