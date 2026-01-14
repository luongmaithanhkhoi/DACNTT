

'use client'

import Head from 'next/head'
import Script from 'next/script'
import { useProfile } from './useProfile'
import ProfileContent from './ProfileContent'

export default function ProfilePage() {
  const { data, loading, error } = useProfile()

  if (loading) {
    return <p className="text-center py-5">Đang tải thông tin...</p>
  }

  if (error || !data) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <>
      <Head>
        <title>My Profile | Job Finder</title>
      </Head>


      <ProfileContent data={data} />

      <Script src="/js/bootstrap.bundle.min.js" />
    </>
  )
}