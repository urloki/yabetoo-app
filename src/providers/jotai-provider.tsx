'use client'
import React from 'react';
import {Provider} from 'jotai'

function JotaiProvider({children} : {children: React.ReactNode}) {
    return (
        <Provider>
            {children}
        </Provider>
    )
}

export default JotaiProvider;