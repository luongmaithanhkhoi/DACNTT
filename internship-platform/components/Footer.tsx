export default function Footer() {
  return (
    <>
      <div className="footer-wrap">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-12">
              <div className="logo-wrap">
                <div className="logo">
                  <a href="#">
                    <img src="/images/TDTU.png" alt="TDTU" />
                  </a>
                </div>

                <div className="logo-text">
                  <a href="#">KHOA CÔNG NGHỆ THÔNG TIN</a>
                </div>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse consectetur quis risus sit amet aliquam.
              </p>
              <div className="read-btn">
                <a href="#">Read More</a>
              </div>
            </div>

            <div className="col-lg-8 col-md-12">
              <div className="row">
                <div className="col-lg-4 col-md-4">
                  <h3>Quick Links</h3>
                  <ul className="footer-links">
                    <li>
                      <a href="/about-us">About Us</a>
                    </li>
                    <li>
                      <a href="/blog">Blog</a>
                    </li>
                    <li>
                      <a href="/register">Register</a>
                    </li>
                    <li>
                      <a href="/contact-us">Contact Us</a>
                    </li>
                  </ul>
                </div>

                <div className="col-lg-4 col-md-4">
                  <h3>Jobs</h3>
                  <ul className="footer-links">
                    <li>
                      <a href="#">New York</a>
                    </li>
                    <li>
                      <a href="#">London</a>
                    </li>
                    <li>
                      <a href="#">Washington</a>
                    </li>
                  </ul>
                </div>

                <div className="col-lg-4 col-md-4">
                  <h3>Categories</h3>
                  <ul className="footer-links">
                    <li>
                      <a href="#">IT Jobs</a>
                    </li>
                    <li>
                      <a href="#">Education</a>
                    </li>
                    <li>
                      <a href="#">Engineering</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
