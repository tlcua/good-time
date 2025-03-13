interface UserConfig {
    lockWindow: boolean,
    style?: Partial<CSSStyleDeclaration>,
    origin: string,
    maxSize:number
}

const ConfigStoreId = 'lazy-userconfig'


import { useMemo, useState } from "react";


export function useUserConfig() {

    const storeConfig = useMemo<UserConfig>(() => {

        const dbData = window.utools.db.get<{ userConfig: UserConfig }>(ConfigStoreId);

        return dbData?.userConfig ?? {
            lockWindow: false,
            maxSize: 100,
            origin: ''
        };
    }, [])

    const [config, setConfig] = useState(storeConfig);

    function updateLockState(state: boolean) {
        setConfig({
            ...config,
            lockWindow: state
        })
    }

    return {
        config, updateLockState
    }
}