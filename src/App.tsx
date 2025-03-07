import "./index.css";
// import { useEffect, useState } from "react";
import { Button, ConfigProvider } from "antd";
import bg from "./assets/bcpic.png";
// import { useWindow } from "./hooks/useWindowState";
import { Book as BookComponent, AddLocalSource } from "./components";
import { useBookshelf, Book } from "./hooks/useBookshelf";
import { useTextWindow } from "./hooks/useTextWindow";

export default function APP({ enterAction }: { [x: string]: string }) {
  const bookshelf = useBookshelf();
  const textWinState = useTextWindow();
  console.log('enterAction:', enterAction);

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBorderColor: "#C5C5C5",
            defaultActiveBorderColor: "#C5C5C5",
            defaultHoverBorderColor: "#C5C5C5",
            defaultColor: "#19537D",
          },
        },
      }}
    >
      <main
        style={{
          backgroundImage: `url(${bg})`,
        }}
        className="h-[100vh] p-4 min-h-[400px]"
      >
        <header className="bg-main rounded-xl flex justify-between items-center px-10 py-2 hidden">
          <h1 className="text-center text-[20px] text-title ">书架</h1>
          <div className="flex gap-1">
            <Button onClick={textWinState.destroyTextWindow}> 关闭移动窗口 </Button>
            <Button> 锁定移动窗口 </Button>
            <Button> 配置书源 </Button>
          </div>
        </header>
        <div className="my-4 bg-main p-4 h-[calc(100%-4rem)] flex gap-4  rounded-xl">
          {bookshelf.books.map((book: Book) => (
            <BookComponent
              key={book.uniqueId}
              book={book}
              onOpen={() => textWinState.createTextWindow(book.uniqueId)}
              onRemove={() => bookshelf.removeBook(book.uniqueId)}
            />
          ))}

          <div className="w-[120px] h-[140px] bg-[#fff] rounded-md flex justify-center gap-y-4 items-center shadow-[0_4px_6px_-1px_#0000001a,0_2px_4px_-2px_#0000001a] flex-col">
            <AddLocalSource bookshelf={bookshelf} />
            {/* <AddLocalSource /> */}
          </div>
        </div>
      </main>
    </ConfigProvider>
  );
}
