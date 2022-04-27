import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import Link from 'next/link'
import Loader from '../components/Loader'

import toast from 'react-hot-toast'

export default function Home() {
  return (
    <div>
      <Loader show />
      <Link href="/roy">
        <a>Roy's profile</a>
      </Link>
      <button onClick={() => toast.success('hello toast!')}>
        Toast Me
      </button>
    </div>
  )
}
