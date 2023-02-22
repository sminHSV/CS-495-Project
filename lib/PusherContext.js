import React from 'react'

const PusherContext = React.createContext();

export function usePusher() {
    const context = React.useContext(PusherContext);

    if (!context) {
        throw new Error(`usePusher must be used within a PusherProvider`);
    }

    return context;
}

export function PusherProvider({value, ...props}) {
    return <PusherContext.Provider value={value} {...props} />
}