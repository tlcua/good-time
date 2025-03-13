interface Chapter {
    title: string;
    start: number;
    end: number;
}

export interface LocaleBook {
    name: string;
    coverPath?: string;
    filePath: string;
    totalSize: number;
    readingProgress: {
        chapterIndex: number;
        chapterPs: number;
    };
    chapters: Chapter[];
}


interface LocaleBookAction {
    type: 'update' | 'delete' | 'add';
    data: LocaleBook;
}

import { useEffect } from 'react';
import { useImmerReducer } from 'use-immer';

const BookshelfDBId = 'lz-bookshelf';

const dbData = window.utools.db.get<{ bookshelf: LocaleBook[] }>(BookshelfDBId);

const bookshelf = dbData?.bookshelf ?? [];

function bookshelfReducer(draft: LocaleBook[], action: LocaleBookAction) {
    switch (action.type) {
        case 'add':
            draft.push(action.data);
            break;
        case 'update':
            Object.assign(draft.find((i) => i.filePath === action.data.filePath)!, action.data);
            break;
        case 'delete':
            draft = draft.filter(d => d.coverPath === action.data.filePath)
            break;
    }
}

export function useBookshelf() {

    const [books, dispatch] = useImmerReducer(bookshelfReducer, bookshelf);

    useEffect(() => {
        window.utools.db.put({
            _id: BookshelfDBId,
            _rev: window.utools.db.get(BookshelfDBId)?._rev,
            bookshelf: books
        })
    }, [books])
    

    function addBook(book: LocaleBook) {
        if (books.find((b) => b.filePath === book.filePath)) {
            return {
                msg: '已有该文件！'
            };
        }
        dispatch({
            type: 'add',
            data: book
        })
    }
    function removeBook(book: LocaleBook) {
        dispatch({
            type: 'delete',
            data: book,
        })
    }
    function updateBook(book: LocaleBook) {
        dispatch({
            type: 'update',
            data: book
        })
    }

    return { books, addBook, removeBook, updateBook };
}
