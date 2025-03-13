/// <reference types="vite/client" />
/// <reference types="utools-api-types" />

interface Window {
    services: {
        readFile: (path:string) => string,
        writeTextFile: (content: string) => void,
        writeImageFile: (base64Url: string) => void,
        getChapters(content: string):  {
            title: string;
            start: number;
            end: number;
        }[]
    };
}

declare const window: Window;