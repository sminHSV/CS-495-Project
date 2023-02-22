import '@/styles/globals.css'
import { PusherProvider } from '@/lib/PusherContext'
import Pusher from 'pusher-js'

const pusher = new Pusher(
  process.env.NEXT_PUBLIC_KEY, {
  cluster: 'us2',
})

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps},

 }) {
  return (
    <PusherProvider value={pusher}>
       <Component {...pageProps} />
    </PusherProvider>     
  );
}
