import { Dropdown, MenuProps, Popconfirm } from "antd";
import { Book as BookIns } from "../../hooks/useBookshelf";
import { useState } from "react";
// import { TextWinState } from "../../hooks/useTextWindow";
export function Book(props: { book: BookIns; onRemove: () => void, onOpen: () => void, }) {
    const { book,  onRemove,onOpen } = props;
    const [open, setOpen] = useState(false);
    const items: MenuProps["items"] = [
        {
            key: "1",
            label: book.name,
            disabled: true,
        },
        {
            type: "divider",
        },
        {
            key: "2",
            label: '更换封面',
        },
        {
            key: "3",
            label: <span className="text-[#fb2c36]">删除</span>,
            onClick: () => setOpen(true),
        },
    ];



    return (
        <Popconfirm title="确认删除?" open={open} onConfirm={onRemove} onCancel={() => setOpen(false)} okText="是" cancelText="否">
            <Dropdown menu={{ items }} trigger={["contextMenu"]}>
                <div className="w-[100px] h-[140px] bg-[#c0bfbd] rounded-md flex justify-center items-center cursor-pointer relative book shadow-[0_4px_6px_-1px_#0000001a,0_2px_4px_-2px_#0000001a]"
                    onClick={onOpen}
                >
                    {book.coverPath ? (
                        <img src={book.coverPath} alt="cover" />
                    ) : (
                        <div className="text-center leading-[25px] text-title" style={{ fontSize: `${Math.max(12, 28 - book.name.length * 2)}px` }}>
                            {book.name}
                        </div>
                    )}
                </div>
            </Dropdown>
        </Popconfirm>
    );
}
