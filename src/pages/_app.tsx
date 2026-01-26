import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import OpenReplayTracker from '@/components/OpenReplayTracker'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <OpenReplayTracker />
            <Component {...pageProps} />
        </>
    )
}
