const StateStoreId = 'lz-readingBook';

export interface ReadingBookState {
    id: null;
    w: number;
    h: number;
    x: number;
    y: number;
}

export function useTextWindow() {

    let textWindow: BrowserWindow.WindowInstance | null = null;




    function createTextWindow(bookId: string) {
        const dbData = window.utools.db.get<{ readingBookState: ReadingBookState }>(StateStoreId);

        const readingBookState: ReadingBookState = dbData?.readingBookState ?? {
            id: null,
            w: 300,
            h: 100,
            x: 1100,
            y: 500,
        }

        console.log('readingBookState:',readingBookState);
        

        window.utools.db.put({
            _id: StateStoreId,
            _rev: dbData?._rev,
            readingBookState: {
                ...readingBookState,
                id: bookId
            }
        })

        destroyTextWindow();
        window.xxx = textWindow = window.utools.createBrowserWindow('textWindow/index.html', {
            show: false,
            useContentSize: true,
            skipTaskbar: true,
            alwaysOnTop: true,
            frame: false,
            width: readingBookState.w,
            height: readingBookState.h,
            x: readingBookState.x,
            y: readingBookState.y,
            transparent: true,
            backgroundColor: '#f00',
            hasShadow: false,
            webPreferences: {
                preload: 'textWindow/preload.js',
                zoomFactor: 1

            }
        }, () => {
            callTextWindowUpdate();
            textWindow?.show();
        })

    }
    function destroyTextWindow() {
        if (textWindow) {
            if (!textWindow.isDestroyed()) {
                textWindow.destroy();
            }
            textWindow = null;
        }
    }
    function callTextWindowUpdate() {
        textWindow?.webContents.send('updateState');
        textWindow?.webContents.openDevTools();

    }
    return {
        createTextWindow,
        destroyTextWindow,
        callTextWindowUpdate
    }
}

export type TextWinState = ReturnType<typeof useTextWindow>;