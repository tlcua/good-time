import { useBookshelf } from "../../hooks/useBookshelf";
export function AddLocalSource({ bookshelf }: { bookshelf: ReturnType<typeof useBookshelf> }) {

    console.log('bookshelf:', bookshelf);

    function handleOpenDialog() {
        const file = window.utools.showOpenDialog({
            filters: [{
                name: '文本文件',
                extensions: ['txt']
            }],
            properties: ['openFile']
        });
        if (file?.length) {
            const content = window.services.readFile(file[0]);
            console.log('content:', content);
            bookshelf.addBook({
                'coverPath': '',
                'filePath': file[0],
                'name': file[0].match(/([\u4e00-\u9fa5]|\w| )+(?=.txt)/)?.[0] ?? '无',
                'ps': 0,
                'uniqueId': 'lazy' + Date.now().toString()
            })
        } else {
            console.log('user canceled !')
        }



    }

    return <div className="text-title flex gap-2 items-center cursor-pointer"
        onClick={handleOpenDialog}
    >
        <i className=" !text-[24px] iconfont lazy-electronics "></i>
        <span className="hover:text-2xl">添加</span>
    </div>
}