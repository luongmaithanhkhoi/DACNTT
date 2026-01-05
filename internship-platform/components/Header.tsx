import Link from "next/link";
import Head from "next/head";
import NavbarLinks from "./NavbarLinks";
import LogoutButton from '@/components/LogoutButton';
export default function Header() {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags */}
        <title>Job Finder</title>
        {/* Fav Icon */}
        <link rel="shortcut icon" href="favicon.ico" />
        {/* Bootstrap */}
        <link href="/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/css/owl.carousel.css" rel="stylesheet" />
        <link href="/css/font-awesome.css" rel="stylesheet" />
        <link href="/css/style.css" rel="stylesheet" />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Alice"
          rel="stylesheet"
        />
      </Head>
      <div className="header-wrap">
        <div className="container">
          {/*row start*/}
          <div className="row">
            {/*col-lg-3 start*/}
            <div className="col-lg-3 col-md-3 navbar-light">
              <div className="logo-wrap">
                <div className="logo">
                  <Link href="/">
                    <img src="images/TDTU.png" alt="TDTU" />
                  </Link>
                </div>

                <div className="logo-text">
                  <Link href="/">KHOA CÔNG NGHỆ THÔNG TIN</Link>
                </div>
              </div>

              <button
                type="button"
                className="navbar-toggle"
                data-toggle="collapse"
                data-target="#navbarScroll"
              >
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            {/*col-lg-3 end*/}
            {/*col-lg-7 end*/}
            <div className="col-lg-5 col-md-9">
              {/*Navegation start*/}
              <div className="navigationwrape">
                <div
                  className="navbar navbar-expand-lg navbar-default navbar-light"
                  role="navigation"
                >
                  <div className="navbar-header"> </div>
                  {/* <div className="navbar-collapse collapse" id="navbarScroll">
                    <ul
                      className="nav navbar-nav"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 24,
                      }}
                    >
                      <li>
                        {" "}
                        <Link href="/" className="active">
                          {" "}
                          Trang Chủ
                        </Link>
                      </li>
                      <li>
                        {" "}
                        <Link href="/job-listing"> Tuyển Dụng </Link>
                      </li>
                      <li>
                        {" "}
                        <Link href="blog.html"> Tin Tức</Link>
                      </li>
                    </ul>
                  </div> */}
                  <NavbarLinks />

                  <div className="clearfix" />
                </div>
              </div>
              {/*Navegation start*/}
            </div>
            {/*col-lg-3 end*/}
            {/*col-lg-2 start*/}
            <div className="col-lg-4 col-md-12">
              <div className="header-right">
                <div className="post-btn">
                  <a href="/post-job">Post a Job</a>
                </div>
                <div className="user-wrap">
                  <div className="login-btn">
                    <a href="/login">Login</a>
                  </div>
                  <div className="register-btn">
                    <LogoutButton />
                  </div>
              
                  <div className="clearfix" />
                </div>
                <div className="d-flex align-items-center gap-3">
                {/* <Link href="/profile" className="btn btn-outline-primary">
                  Profile
                </Link> */}
               
              </div>
                <div className="clearfix" />
              </div>
            </div>
            {/*col-lg-2 end*/}
          </div>
          {/*row end*/}
        </div>
      </div>
    </>
  );
}
