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
                 Địa chỉ: Phòng C004, Số 19 Nguyễn Hữu Thọ, phường Tân Hưng, TP. Hồ Chi Minh
              </p>
              <div className="read-btn">
               <p>Điện thoại: (028) 37755046</p>
              </div>
            </div>

            <div className="col-lg-8 col-md-12">
              <div className="row">
                <div className="col-lg-4 col-md-4">
                  <h3>Quick Links</h3>
                  <ul className="footer-links">
                    <li>
                      <a href="/about-us">Giới thiệu</a>
                    </li>
                    <li>
                      <a href="/blog">Giáo dục</a>
                    </li>
                    <li>
                      <a href="/register">Hợp tác</a>
                    </li>
                    <li>
                      <a href="/contact-us">Tuyển sinh</a>
                    </li>
                  </ul>
                </div>





                <div className="col-lg-4 col-md-4">
                  <h3>Khoa công nghệ thông tin</h3>
                  <ul className="footer-links">
                    <li>
                      <a href="#">Tin tức - sự kiện</a>
                    </li>
                    <li>
                      <a href="#">Cơ hội việc làm</a>
                    </li>
                    <li>
                      <a href="#">Câu lạc bộ ICON</a>
                    </li>
                    <li>
                      <a href="#">Tập Sự Nghề Nghiệp</a>
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
