import { useImmerReducer } from "use-immer";
import { createTextWindow } from "../lib/createTextWindow";
interface WindowState {
    locked: boolean
    visibility: boolean
    position: { x: number, y: number }
    size: { w: number, h: number }
    style: { [x: string]: string }
    content: string
}

type Action = {
    [K in keyof WindowState]: {
        type: K,
        data: WindowState[K]
    }
}[keyof WindowState]


function windowReducer(draft:WindowState, action:Action) {
  switch (action.type) {
    case 'content':
      // TODO
      console.log("draft:", action);

      Object.assign(draft, action.data);
      break;
  }
}

export function useWindow(initState:WindowState) {
  const [windowState, dispatch] = useImmerReducer(windowReducer, initState);
  function updateWindow() {
    
  const uWindow = createTextWindow();
  // uWindow.webContents.send('ping','msg...')
  window.subw = uWindow;
  
  }
  return { windowState, updateWindow };
}
