import '@/styles/globals.css'
import { PusherProvider } from '@/lib/PusherContext'
import Pusher from 'pusher-js'
import { useEffect, useState } from 'react'

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps},
 }) {
  const [pusher, setPusher] = useState();
  useEffect(() => {
    setPusher(new Pusher(
      process.env.NEXT_PUBLIC_KEY, {
      cluster: 'us2',
    }));
  }, [])

  if (pusher) {
    return (
      <PusherProvider value={pusher}>
         <Component {...pageProps} />
      </PusherProvider>     
    );
  }
}
