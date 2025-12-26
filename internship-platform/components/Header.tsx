export default function Header() {
  return (
    <div className="header-wrap">
      <div className="container">
        <div className="row">
          {/* Logo */}
          <div className="col-lg-3 col-md-3 navbar-light">
            <div className="logo">
              <a href="/">
                <img src="/images/logo.png" alt="Logo" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="col-lg-5 col-md-9">
            <div className="navigationwrape">
              <div className="navbar navbar-expand-lg navbar-default navbar-light">
                <div className="navbar-collapse collapse">
                  <ul className="nav navbar-nav">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about-us">About Us</a></li>
                    <li><a href="/job-listing">Jobs</a></li>
                    <li><a href="/blog">Blog</a></li>
                    <li><a href="/contact-us">Contact</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right buttons */}
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
                  <a href="/register">Register</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
