export interface Book {
    name: string,
    uniqueId: string,
    coverPath?: string,
    filePath: string,
    ps: number,
}
import {  useMemo, useState } from "react";

const BookshelfDBId = 'lz-bookshelf';

export function useBookshelf() {

    const dbData = useMemo(() => {
        return window.utools.db.get<{ bookshelf: Book[] }>(BookshelfDBId);
    }, []);


    const [books, setBooks] = useState(dbData?.bookshelf ?? []);

    function addBook(book: Book) {        
        if(books.find(b => b.filePath === book.filePath)) {
            alert('已有项目路径内容');
            return;
        };
        setBooks([...books, book]);
        window.utools.db.put({
            _id: BookshelfDBId,
            _rev: dbData?._rev,
            bookshelf: [...books, book]
        });
    }
    function removeBook(uniqueId: string) {
        const temp = books.filter(book => book.uniqueId !== uniqueId);
        setBooks(temp);
        window.utools.db.put({
            _id: BookshelfDBId,
            bookshelf: temp
        });
    }
    function getBook(uniqueId: string) {
        return books.find(book => book.uniqueId === uniqueId);
    }

    // function updateReadingBook(uniqueId:string){
    //     utools.dbStorage.setItem('readingBook',uniqueId);
    // }

    return { books, addBook, removeBook, getBook };
}