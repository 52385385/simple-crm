import type { AppProps } from 'next/app'
import { CustomerProvider } from '../api/context/customerContext'
import NavBar from '../components/NavBar'

function SimpleCMS({ Component, pageProps }: AppProps) {
    return (
        <CustomerProvider>
            <NavBar />
            <Component {...pageProps} />
        </CustomerProvider>
    )
}

export default SimpleCMS
