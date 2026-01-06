

'use client'

import Head from 'next/head'
import Script from 'next/script'


export default function ProfilePage() {


  return (
    <>
      <Head>
        <title>My Profile | Job Finder</title>
      </Head>

      <div className="inner-heading">
        <div className="container">
          <h1>My Profile</h1>
        </div>
      </div>

    

      <Script src="/js/bootstrap.bundle.min.js" />
    </>
  )
}