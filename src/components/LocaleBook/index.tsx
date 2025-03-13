import { Dropdown, MenuProps, Modal, Popconfirm, List } from 'antd';
import { LocaleBook as LocaleBookType } from '../../hooks';
import { useState } from 'react';

export function LocaleBook(props: {
  book: LocaleBookType;
  onRemove: () => void;
  onOpen: () => void;
  onUpdate: (book: LocaleBookType) => void;
}) {
  const { book, onRemove, onOpen, onUpdate } = props;
  const pageSize = 5;
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openChapterList, setOpenChapterList] = useState(false);
  const defaultCurrent = Math.floor(book.readingProgress.chapterIndex / 5) + 1;
  const [current, setCurrent] = useState(defaultCurrent);
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: book.name,
      disabled: true
    },
    {
      type: 'divider'
    },
    {
      key: '2',
      label: '章节列表',
      onClick: () => setOpenChapterList(true)
    },
    {
      key: '3',
      label: '更换封面'
    },
    {
      key: '4',
      label: <span className="text-[#fb2c36]">删除</span>,
      onClick: () => setOpenConfirm(true)
    }
  ];

  return (
    <>
      <Popconfirm
        title="确认删除?"
        open={openConfirm}
        onConfirm={onRemove}
        onCancel={() => setOpenConfirm(false)}
        okText="是"
        cancelText="否"
      >
        <Dropdown menu={{ items }} trigger={['contextMenu']} overlayStyle={{ maxWidth: '180px', minWidth: '100px' }}>
          <div
            className="w-[100px] h-[140px] p-1 bg-primary-300 rounded-md flex justify-center items-center cursor-pointer relative book shadow-[0_4px_6px_-1px_#0000001a,0_2px_4px_-2px_#0000001a]"
            onClick={onOpen}
          >
            {book.coverPath ? (
              <img src={book.coverPath} alt="cover" />
            ) : (
              <div
                className="text-center leading-[25px] text-title-500"
                style={{ fontSize: `${Math.max(12, 30 - book.name.length * 2)}px` }}
              >
                {book.name}
              </div>
            )}
          </div>
        </Dropdown>
      </Popconfirm>
      <Modal title={book.name} open={openChapterList} footer={null} onCancel={() => setOpenChapterList(false)}>
        <List
          pagination={{
            position: 'bottom',
            align: 'center',
            showSizeChanger: false,
            pageSize,
            defaultCurrent,
            onChange: (cur) => setCurrent(cur)
          }}
          dataSource={book.chapters}
          renderItem={(item, i) => (
            <List.Item
              className="cursor-pointer"
              onClick={() => {
                
                if ((current - 1) * pageSize + i !== book.readingProgress.chapterIndex) {
                  // 修改阅读目录 通知更新数据库
                  onUpdate({
                    ...book,
                    readingProgress: {
                      chapterIndex: (current - 1) * pageSize + i,
                      chapterPs: 0
                    }
                  });
                }
                //创建阅读窗口
                onOpen();
                setOpenChapterList(false);
              }}
            >
              <List.Item.Meta
                title={
                  (current - 1) * pageSize + i === book.readingProgress.chapterIndex ? (
                    <strong>{'>>' + item.title + '<<'}</strong>
                  ) : (
                    item.title
                  )
                }
              />
            </List.Item>
          )}
        ></List>
      </Modal>
    </>
  );
}
