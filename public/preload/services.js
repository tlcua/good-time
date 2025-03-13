const fs = require('node:fs');
const path = require('node:path');
const { ipcRenderer } = require('electron');

// 通过 window 对象向渲染进程注入 nodejs 能力
window.services = {
  // 读文件
  readFile(file) {
    return fs.readFileSync(file, { encoding: 'utf-8' });
  },
  // 文本写入到下载目录
  writeTextFile(text) {
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.txt');
    fs.writeFileSync(filePath, text, { encoding: 'utf-8' });
    return filePath;
  },
  // 图片写入到下载目录
  writeImageFile(base64Url) {
    const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(base64Url);
    if (!matchs) return;
    const filePath = path.join(window.utools.getPath('downloads'), Date.now().toString() + '.' + matchs[1]);
    fs.writeFileSync(filePath, base64Url.substring(matchs[0].length), {
      encoding: 'base64'
    });
    return filePath;
  },

  /**
   *
   * @param {string} content
   * @returns {{[x:string]:{title:string,start:number,end:number,totalSize:number}}}
   */
  getChapters(content) {
    const totalSize = content.length;
    // 提取文本章节内容
    const reg =
      /(正文){0,1}(第)([零〇一二三四五六七八九十壹贰叁肆伍陆柒捌玖拾两百千万a-zA-Z0-9]{1,7})[章节卷篇回](\s?)/g;
    const chapters = content.match(reg);    
    const chaptersList = [];
    if (chapters && chapters.length) {
      let lastIndex = 0;
      for (let i = 0; i < chapters.length; i++) {
        const start = content.indexOf(chapters[i], lastIndex);
        const end = i === chapters.length - 1 ? totalSize : content.indexOf(chapters[i + 1],lastIndex);
        chaptersList.push({
          title: chapters[i],
          start,
          end
        });
        lastIndex = end;
      }
    } else {
      chaptersList.push({
        title: '全文',
        start: 0,
        end: totalSize,
        totalSize
      });
    }
    return chaptersList;
  }
};
