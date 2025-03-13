import './index.css';
// import { useEffect, useState } from "react";
import { Button, ConfigProvider, Modal } from 'antd';
// import { useWindow } from "./hooks/useWindowState";
import { LocaleBook as BookComponent, AddLocaleSource, UserConfigPanel } from './components';
import { useBookshelf, WindowState, useUserConfig, LocaleBook } from './hooks';
import { useState } from 'react';

export default function APP({ enterAction }: { [x: string]: string }) {
  console.log('enterAction:', enterAction);

  const bookshelf = useBookshelf();
  const { destroyTextWindow, toggleWindowLocked, createTextWindow, resetWindowPosition } = WindowState;
  const { config: userConfig, updateLockState } = useUserConfig();
  const [openModal, setOpenModal] = useState(false);

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBorderColor: 'var(--color-border)',
            defaultActiveBorderColor: 'var(--color-border)',
            defaultHoverBorderColor: 'var(--color-border)',
            defaultColor: 'var(--color-title-600)',
            defaultHoverColor: 'var(--color-title-500)',
            defaultActiveColor: 'var(--color-title-500)'
          },
          Pagination: {
            itemActiveColorDisabled: 'var(--color-border)',
            colorBorder: 'var(--color-border)',
            colorBgBase: 'var(--color-border)',
            colorBorderBg: 'var(--color-border)',
            colorPrimary: 'var(--color-title-600)',
            colorPrimaryBorder: 'var(--color-title-600)',
            colorPrimaryBorderHover: 'var(--color-title-600)',
            colorPrimaryHover: 'var(--color-title-500)'
          },
          Modal: {
            titleColor: 'var(--color-title-600)',
            colorIcon:'var(--color-title-600)',
            colorIconHover:'var(--color-title-600)',
          },
          List: {},
          Form:{
            labelColor:'var(--color-title-600)',
            
          },
          Input:{
            colorBorder:'var(--color-border)',
            activeBorderColor:'var(--color-border)',
            hoverBorderColor:'var(--color-border)',
            activeShadow:`0 0 0 1px var(--color-border)`
          }
          
        }
      }}
    >
      <main className="h-[100vh] p-4 min-h-[400px] bg-primary-300">
        <header className="bg-primary-100 rounded-xl flex justify-between items-center px-8 py-2 ">
          <h1 className="text-center text-[20px] text-title-500 ">书架</h1>
          <div className="flex gap-1">
            <Button onClick={destroyTextWindow}> 关闭移动窗口 </Button>
            <Button
              onClick={() => {
                updateLockState(!userConfig.lockWindow);
                toggleWindowLocked(!userConfig.lockWindow);
              }}
            >
              {userConfig.lockWindow ? '解锁' : '锁定'}窗口移动
            </Button>
            <Button onClick={resetWindowPosition}> 重置窗口位置 </Button>
            <Button> 配置书源 </Button>
            <div className="ml-2 pl-2 pr-2 -mr-2 flex items-center cursor-pointer" onClick={() => setOpenModal(true)}>
              <i className="iconfont lazy-setting text-title-500 text-2xl"></i>
            </div>
          </div>
        </header>
        <div className="my-4 bg-primary-100 p-4 h-[calc(100%-4rem)] flex gap-4  rounded-xl">
          {bookshelf.books.map((book) => (
            <BookComponent
              key={book.filePath}
              book={book}
              onOpen={() => createTextWindow(book.filePath)}
              onRemove={() => bookshelf.removeBook(book)}
              onUpdate={(book: LocaleBook) => bookshelf.updateBook(book)}
            />
          ))}
          <div className="w-[120px] h-[140px] bg-[#fff] rounded-md flex justify-center gap-y-4 items-center shadow-[0_4px_6px_-1px_#0000001a,0_2px_4px_-2px_#0000001a] flex-col">
            <AddLocaleSource bookshelf={bookshelf} />
            {/* <AddLocaleSource /> */}
          </div>
        </div>
        <Modal title="设置" open={openModal} onCancel={() => setOpenModal(false)} footer={null} width={'calc(100vw - 60px)'}>
          <UserConfigPanel />
        </Modal>
      </main>
    </ConfigProvider>
  );
}
