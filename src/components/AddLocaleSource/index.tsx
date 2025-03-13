import { useBookshelf } from "../../hooks/useBookshelf";
import { message } from 'antd';
export function AddLocaleSource({ bookshelf }: { bookshelf: ReturnType<typeof useBookshelf> }) {
    const [messageApi, contextHolder] = message.useMessage();
    function handleOpenDialog() {
        const file = window.utools.showOpenDialog({
            filters: [
                {
                    name: "文本文件",
                    extensions: ["txt"],
                },
            ],
            properties: ["openFile"],
        });
        if (file?.length) {
            const content = window.services.readFile(file[0]);
            const chapters = window.services.getChapters(content);
            const addResult = bookshelf.addBook({
                coverPath: "",
                filePath: file[0],
                name: file[0].match(/([\u4e00-\u9fa5]|\w|\s)+(?=.txt)/)?.[0] ?? "无",
                totalSize: content.length,
                chapters,
                readingProgress: {
                    chapterIndex: 0,
                    chapterPs: 0
                }
            });
            if (addResult?.msg) {
                messageApi.warning(addResult?.msg);
            }
        } else {
            console.log("user canceled !");
        }
    }

    return (
        <>
            { contextHolder }
            <div className="text-title-500 flex gap-2 items-center cursor-pointer" onClick={handleOpenDialog}>
                <i className=" !text-[24px] iconfont lazy-electronics "></i>
                <span className="hover:text-2xl">添加</span>
            </div>
        </>

    );
}
