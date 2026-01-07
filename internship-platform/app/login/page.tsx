
import Head from 'next/head'
import Script from 'next/script'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | Job Finder</title>
      </Head>

      <div className="inner-heading">
        <div className="container">
          <h3>Login</h3>
        </div>
      </div>

      <div className="inner-content loginWrp">
        <div className="container">
          <div className="row">
            <div className="col-lg-3" />
            <div className="col-lg-6">
              <LoginForm />
            </div>
            <div className="col-lg-3" />
          </div>
        </div>
      </div>

      <Script src="/js/jquery-2.1.4.min.js" />
      <Script src="/js/bootstrap.bundle.min.js" />
    </>
  )
}