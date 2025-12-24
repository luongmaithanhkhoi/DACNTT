import Head from "next/head";
import Script from "next/script";

export default function Home() {
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
      {/*header start*/}
     
      {/*header start end*/}
      {/* Revolution slider start */}
      <div className="tp-banner-container">
        <div className="tp-banner">
          <ul>
            <li
              data-slotamount={7}
              data-transition="fade"
              data-masterspeed={1000}
              data-saveperformance="on"
            >
              {" "}
              <img
                alt=""
                src="images/dummy.png"
                data-lazyload="images/banner.jpg"
              />
              <div
                className="caption lft large-title tp-resizeme slidertext2"
                data-x="center"
                data-y={160}
                data-speed={600}
                data-start={1000}
              >
                {" "}
                Lorem ipsum dolor
              </div>
              <div
                className="caption lfl large-title tp-resizeme slidertext1"
                data-x="center"
                data-y={190}
                data-speed={600}
                data-start={1600}
              >
                Looking For a Job?
              </div>
              <div
                className="caption lfb large-title tp-resizeme slidertext4"
                data-x="center"
                data-y={280}
                data-speed={600}
                data-start={2200}
              >
                <a href="#" className="slidebtn">
                  Find A Job Now{" "}
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                </a>
              </div>
            </li>
            <li
              data-slotamount={7}
              data-transition="fade"
              data-masterspeed={1000}
              data-saveperformance="on"
            >
              {" "}
              <img
                alt=""
                src="images/dummy.png"
                data-lazyload="images/banner2.jpg"
              />
              <div
                className="caption lft large-title tp-resizeme slidertext2"
                data-x="center"
                data-y={140}
                data-speed={600}
                data-start={1000}
              >
                {" "}
                Lorem ipsum dolor
              </div>
              <div
                className="caption lfl large-title tp-resizeme slidertext1"
                data-x="center"
                data-y={170}
                data-speed={600}
                data-start={1600}
              >
                Looking For a Job?
              </div>
              <div
                className="caption lfb large-title tp-resizeme slidertext4"
                data-x="center"
                data-y={260}
                data-speed={600}
                data-start={2200}
              >
                <a href="#" className="slidebtn">
                  Find A Job Now{" "}
                  <i className="fa fa-arrow-right" aria-hidden="true" />
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/* Revolution slider end */}
      {/*slider start*/}
      <div className="slider-wrap slidrWrp">
        <div className="container">
          <div className="sliderTxt">
            <div className="form-wrap">
              <form>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="input-group">
                      <input
                        type="text"
                        name=" job title"
                        placeholder="Job title, skills, or company"
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-group">
                      <select name="location" className="dropdown">
                        <option>Location... </option>
                        <option value="new-york">New York</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="input-group">
                      <select name="category" className="form-control">
                        <option>Category... </option>
                        <option value={1}>Web Designer</option>
                        <option value={2}>Web Developer</option>
                        <option value={3}>SEO Expert</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="input-btn">
                      <input
                        type="submit"
                        className="sbutn"
                        defaultValue="Search"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/*slider end*/}
      {/*Browse Job Start*/}
      <div className="browse-wrap">
        <div className="container">
          <div className="heading-title">
            Browse <span>Jobs</span>
          </div>
          <ul className="row">
            <li className="col-lg-3 col-md-6 ">
              <div className="jobsWrp">
                <div className="job-icon">
                  <i className="fa fa-laptop" aria-hidden="true" />
                </div>
                <div className="jobTitle">
                  <a href="#">IT Engineer</a>
                </div>
              </div>
            </li>
            <li className="col-lg-3 col-md-6 ">
              <div className="jobsWrp">
                <div className="job-icon">
                  <i className="fa fa-suitcase" aria-hidden="true" />
                </div>
                <div className="jobTitle">
                  <a href="#">Management</a>
                </div>
              </div>
            </li>
            <li className="col-lg-3 col-md-6 ">
              <div className="jobsWrp">
                <div className="job-icon">
                  <i className="fa fa-tachometer" aria-hidden="true" />
                </div>
                <div className="jobTitle">
                  <a href="#">Digital &amp; Creative</a>
                </div>
              </div>
            </li>
            <li className="col-lg-3 col-md-6 ">
              <div className="jobsWrp">
                <div className="job-icon">
                  <i className="fa fa-money" aria-hidden="true" />
                </div>
                <div className="jobTitle">
                  <a href="#">Accounting</a>
                </div>
              </div>
            </li>
            <li className="col-lg-3 col-md-6 ">
              <div className="jobsWrp">
                <div className="job-icon">
                  <i className="fa fa-line-chart" aria-hidden="true" />
                </div>
                <div className="jobTitle">
                  <a href="#">Sales &amp; marketing</a>
                </div>
              </div>
            </li>
            <li className="col-lg-3 col-md-6 ">
              <div className="jobsWrp">
                <div className="job-icon">
                  <i className="fa fa-gavel" aria-hidden="true" />
                </div>
                <div className="jobTitle">
                  <a href="#">Legal Job</a>
                </div>
              </div>
            </li>
            <li className="col-lg-3 col-md-6 ">
              <div className="jobsWrp">
                <div className="job-icon">
                  <i className="fa fa-university" aria-hidden="true" />
                </div>
                <div className="jobTitle">
                  <a href="#">Banking</a>
                </div>
              </div>
            </li>
            <li className="col-lg-3 col-md-6 ">
              <div className="jobsWrp">
                <div className="job-icon">
                  <i className="fa fa-paint-brush" aria-hidden="true" />
                </div>
                <div className="jobTitle">
                  <a href="#">Design &amp; Art</a>
                </div>
              </div>
            </li>
          </ul>
          <div className="read-btn">
            <a href="#">View All Categories</a>
          </div>
        </div>
      </div>
      {/*Browse Job End*/}
      {/*featured jobs*/}
      <div className="featured-wrap">
        <div className="container">
          <div className="heading-title">
            Featured <span>Jobs</span>
          </div>
          <div className="headTxt">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
            viverra nulla. Fusce at rhoncus diam, quis convallis ligula. Cras et
            ligula aliquet, ultrices leo non, scelerisque justo. Nunc a vehicula
            augue.
          </div>
          <ul className="row">
            <li className="col-lg-6 col-md-6">
              <div className="listWrpService">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-xs-3">
                    <div className="listImg">
                      <img src="images/feature01.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-xs-9">
                    <h3>
                      <a href="#">Marketing Graphic Design / 2D Artist</a>
                    </h3>
                    <p>Design Communication Studio</p>
                    <ul className="featureInfo">
                      <li>
                        <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                        Atlanta, GA
                      </li>
                      <li>
                        <i className="fa fa-calendar" aria-hidden="true" /> Dec
                        30, 2015 - Feb 20, 2016{" "}
                      </li>
                    </ul>
                    <div className="time-btn">Part Time</div>
                    <div className="click-btn">
                      <a href="#">Apply Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-6 col-md-6">
              <div className="listWrpService">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-xs-3">
                    <div className="listImg">
                      <img src="images/feature02.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-xs-9">
                    <h3>
                      <a href="#">Technical Database Engineer</a>
                    </h3>
                    <p>Design Communication Studio</p>
                    <ul className="featureInfo">
                      <li>
                        <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                        Atlanta, GA
                      </li>
                      <li>
                        <i className="fa fa-calendar" aria-hidden="true" /> Dec
                        30, 2015 - Feb 20, 2016{" "}
                      </li>
                    </ul>
                    <div className="time-btn">Freelance</div>
                    <div className="click-btn">
                      <a href="#">Apply Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-6 col-md-6">
              <div className="listWrpService">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-xs-3">
                    <div className="listImg">
                      <img src="images/feature03.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-xs-9">
                    <h3>
                      <a href="#">Senior UI &amp; UX Designer</a>
                    </h3>
                    <p>Design Communication Studio</p>
                    <ul className="featureInfo">
                      <li>
                        <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                        Atlanta, GA
                      </li>
                      <li>
                        <i className="fa fa-calendar" aria-hidden="true" /> Dec
                        30, 2015 - Feb 20, 2016{" "}
                      </li>
                    </ul>
                    <div className="time-btn">Intership</div>
                    <div className="click-btn">
                      <a href="#">Apply Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-6 col-md-6">
              <div className="listWrpService">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-xs-3">
                    <div className="listImg">
                      <img src="images/feature04.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-xs-9">
                    <h3>
                      <a href="#">Marketing Graphic Design / 2D Artist</a>
                    </h3>
                    <p>Design Communication Studio</p>
                    <ul className="featureInfo">
                      <li>
                        <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                        Atlanta, GA
                      </li>
                      <li>
                        <i className="fa fa-calendar" aria-hidden="true" /> Dec
                        30, 2015 - Feb 20, 2016{" "}
                      </li>
                    </ul>
                    <div className="time-btn">Part Time</div>
                    <div className="click-btn">
                      <a href="#">Apply Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-6 col-md-6">
              <div className="listWrpService">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-xs-3">
                    <div className="listImg">
                      <img src="images/feature02.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-xs-9">
                    <h3>
                      <a href="#">Marketing Graphic Design / 2D Artist</a>
                    </h3>
                    <p>Design Communication Studio</p>
                    <ul className="featureInfo">
                      <li>
                        <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                        Atlanta, GA
                      </li>
                      <li>
                        <i className="fa fa-calendar" aria-hidden="true" /> Dec
                        30, 2015 - Feb 20, 2016{" "}
                      </li>
                    </ul>
                    <div className="time-btn">Part Time</div>
                    <div className="click-btn">
                      <a href="#">Apply Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-6 col-md-6">
              <div className="listWrpService">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-xs-3">
                    <div className="listImg">
                      <img src="images/feature01.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-xs-9">
                    <h3>
                      <a href="#">Technical Database Engineer</a>
                    </h3>
                    <p>Design Communication Studio</p>
                    <ul className="featureInfo">
                      <li>
                        <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                        Atlanta, GA
                      </li>
                      <li>
                        <i className="fa fa-calendar" aria-hidden="true" /> Dec
                        30, 2015 - Feb 20, 2016{" "}
                      </li>
                    </ul>
                    <div className="time-btn">Part Time</div>
                    <div className="click-btn">
                      <a href="#">Apply Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-6 col-md-6">
              <div className="listWrpService">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-xs-3">
                    <div className="listImg">
                      <img src="images/feature04.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-xs-9">
                    <h3>
                      <a href="#">Web Designer</a>
                    </h3>
                    <p>Design Communication Studio</p>
                    <ul className="featureInfo">
                      <li>
                        <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                        Atlanta, GA
                      </li>
                      <li>
                        <i className="fa fa-calendar" aria-hidden="true" /> Dec
                        30, 2015 - Feb 20, 2016{" "}
                      </li>
                    </ul>
                    <div className="time-btn">Contract</div>
                    <div className="click-btn">
                      <a href="#">Apply Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-6 col-md-6">
              <div className="listWrpService">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-xs-3">
                    <div className="listImg">
                      <img src="images/feature03.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-xs-9">
                    <h3>
                      <a href="#">Marketing Graphic Design / 2D Artist</a>
                    </h3>
                    <p>Design Communication Studio</p>
                    <ul className="featureInfo">
                      <li>
                        <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                        Atlanta, GA
                      </li>
                      <li>
                        <i className="fa fa-calendar" aria-hidden="true" /> Dec
                        30, 2015 - Feb 20, 2016{" "}
                      </li>
                    </ul>
                    <div className="time-btn">Part Time</div>
                    <div className="click-btn">
                      <a href="#">Apply Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-6 col-md-6">
              <div className="listWrpService">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-xs-3">
                    <div className="listImg">
                      <img src="images/feature01.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-xs-9">
                    <h3>
                      <a href="#">SEO Expert</a>
                    </h3>
                    <p>Design Communication Studio</p>
                    <ul className="featureInfo">
                      <li>
                        <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                        Atlanta, GA
                      </li>
                      <li>
                        <i className="fa fa-calendar" aria-hidden="true" /> Dec
                        30, 2015 - Feb 20, 2016{" "}
                      </li>
                    </ul>
                    <div className="time-btn">Freelacne</div>
                    <div className="click-btn">
                      <a href="#">Apply Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-6 col-md-6">
              <div className="listWrpService">
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-xs-3">
                    <div className="listImg">
                      <img src="images/feature02.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-9 col-md-9 col-xs-9">
                    <h3>
                      <a href="#">Senior UI &amp; UX Designer</a>
                    </h3>
                    <p>Design Communication Studio</p>
                    <ul className="featureInfo">
                      <li>
                        <i className="fa fa-map-marker" aria-hidden="true" />{" "}
                        Atlanta, GA
                      </li>
                      <li>
                        <i className="fa fa-calendar" aria-hidden="true" /> Dec
                        30, 2015 - Feb 20, 2016{" "}
                      </li>
                    </ul>
                    <div className="time-btn">Part Time</div>
                    <div className="click-btn">
                      <a href="#">Apply Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div className="read-btn">
            <a href="#">View All Featured Jobs</a>
          </div>
        </div>
      </div>
      {/*feature end*/}
      {/*How it works start*/}
      <div className="works-wrap">
        <div className="container">
          <div className="heading-title">
            How it <span>works</span>
          </div>
          <div className="headTxt">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
            viverra nulla. Fusce at rhoncus diam, quis convallis ligula. Cras et
            ligula aliquet, ultrices leo non, scelerisque justo. Nunc a vehicula
            augue.
          </div>
          <ul className="row works-service">
            <li className="col-lg-4">
              <div className="worksIcon">
                <i className="fa fa-files-o" aria-hidden="true" />
              </div>
              <h3>Create Your Resume</h3>
              <p>
                Eiusmod tempor incidiunt labore velit dolore magna aliqu sed
                eniminim veniam quis nostrud exercition eullamco laborisaa
              </p>
            </li>
            <li className="col-lg-4">
              <div className="worksIcon">
                <i className="fa fa-paper-plane" aria-hidden="true" />
              </div>
              <h3>Apply for Your Jobs</h3>
              <p>
                Eiusmod tempor incidiunt labore velit dolore magna aliqu sed
                eniminim veniam quis nostrud exercition eullamco laborisaa
              </p>
            </li>
            <li className="col-lg-4">
              <div className="worksIcon">
                <i className="fa fa-check-square-o" aria-hidden="true" />
              </div>
              <h3>Hired Now</h3>
              <p>
                Eiusmod tempor incidiunt labore velit dolore magna aliqu sed
                eniminim veniam quis nostrud exercition eullamco laborisaa
              </p>
            </li>
          </ul>
        </div>
      </div>
      {/*business end*/}
      {/*Testimonials start*/}
      <div className="testimonials-wrap">
        <div className="container">
          <div className="heading-wrap">
            <div className="heading-title">Testimonials</div>
          </div>
          <ul className="owl-carousel testimonials">
            <li className="item">
              <div className="testi-info">
                <div className="clientInfo">
                  <div className="client-image">
                    <img src="images/client.jpg" alt="" />
                  </div>
                  <div className="name">
                    Kety York <span>Lorem Ispum</span>
                  </div>
                  <div className="clearfix" />
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  quis augue ultricies, molestie nisl mollis, efficitur velit.
                  Nunc urna ligula, malesuada nec condimentum eu, tincidunt sit
                  amet purus.
                </p>
              </div>
            </li>
            <li className="item">
              <div className="testi-info">
                <div className="clientInfo">
                  <div className="client-image">
                    <img src="images/client2.jpg" alt="" />
                  </div>
                  <div className="name">
                    John Doe <span>Lorem Ispum</span>
                  </div>
                  <div className="clearfix" />
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  quis augue ultricies, molestie nisl mollis, efficitur velit.
                  Nunc urna ligula, malesuada nec condimentum eu, tincidunt sit
                  amet purus.
                </p>
              </div>
            </li>
            <li className="item">
              <div className="testi-info">
                <div className="clientInfo">
                  <div className="client-image">
                    <img src="images/client.jpg" alt="" />
                  </div>
                  <div className="name">
                    Kety York <span>Lorem Ispum</span>
                  </div>
                  <div className="clearfix" />
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  quis augue ultricies, molestie nisl mollis, efficitur velit.
                  Nunc urna ligula, malesuada nec condimentum eu, tincidunt sit
                  amet purus.
                </p>
              </div>
            </li>
            <li className="item">
              <div className="testi-info">
                <div className="clientInfo">
                  <div className="client-image">
                    <img src="images/client2.jpg" alt="" />
                  </div>
                  <div className="name">
                    John Doe <span>Lorem Ispum</span>
                  </div>
                  <div className="clearfix" />
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  quis augue ultricies, molestie nisl mollis, efficitur velit.
                  Nunc urna ligula, malesuada nec condimentum eu, tincidunt sit
                  amet purus.
                </p>
              </div>
            </li>
            <li className="item">
              <div className="testi-info">
                <div className="clientInfo">
                  <div className="client-image">
                    <img src="images/client.jpg" alt="" />
                  </div>
                  <div className="name">
                    Kety York <span>Lorem Ispum</span>
                  </div>
                  <div className="clearfix" />
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  quis augue ultricies, molestie nisl mollis, efficitur velit.
                  Nunc urna ligula, malesuada nec condimentum eu, tincidunt sit
                  amet purus.
                </p>
              </div>
            </li>
            <li className="item">
              <div className="testi-info">
                <div className="clientInfo">
                  <div className="client-image">
                    <img src="images/client2.jpg" alt="" />
                  </div>
                  <div className="name">
                    John Doe <span>Lorem Ispum</span>
                  </div>
                  <div className="clearfix" />
                </div>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
                  quis augue ultricies, molestie nisl mollis, efficitur velit.
                  Nunc urna ligula, malesuada nec condimentum eu, tincidunt sit
                  amet purus.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/*Testimonials end*/}
      {/*Blog start*/}
      <div className="blog-wrap">
        <div className="container">
          <div className="heading-title">
            Latest <span>Blogs</span>
          </div>
          <div className="headTxt">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
            viverra nulla. Fusce at rhoncus diam, quis convallis ligula. Cras et
            ligula aliquet, ultrices leo non, scelerisque justo. Nunc a vehicula
            augue.
          </div>
          <ul className="row blogGrid">
            <li className="col-lg-4">
              <div className="blog-inter">
                <div className="postimg">
                  {" "}
                  <img src="images/blog/1.jpg" alt="Blog Title" />
                  <div className="date"> 17 SEP</div>
                </div>
                <div className="post-header">
                  <h4>
                    <a href="#">Duis ultricies aliquet mauris</a>
                  </h4>
                  <div className="postmeta">
                    By : <span>Luck Walker </span> Category :{" "}
                    <a href="#">Movers, Shifting </a>
                  </div>
                </div>
                <div className="postmeta">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris eu nulla eget nisl dapibus...
                  </p>
                  <div className="view-btn">
                    <a href="#">Read More</a>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-4">
              <div className="blog-inter">
                <div className="postimg">
                  {" "}
                  <img src="images/blog/2.jpg" alt="Blog Title" />
                  <div className="date"> 17 SEP</div>
                </div>
                <div className="post-header">
                  <h4>
                    <a href="#">Duis ultricies aliquet mauris</a>
                  </h4>
                  <div className="postmeta">
                    By : <span>Luck Walker </span> Category :{" "}
                    <a href="#">Movers, Shifting </a>
                  </div>
                </div>
                <div className="postmeta">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris eu nulla eget nisl dapibus...
                  </p>
                  <div className="view-btn">
                    <a href="#">Read More</a>
                  </div>
                </div>
              </div>
            </li>
            <li className="col-lg-4">
              <div className="blog-inter">
                <div className="postimg">
                  {" "}
                  <img src="images/blog/4.jpg" alt="Blog Title" />
                  <div className="date"> 17 SEP</div>
                </div>
                <div className="post-header">
                  <h4>
                    <a href="#">Duis ultricies aliquet mauris</a>
                  </h4>
                  <div className="postmeta">
                    By : <span>Luck Walker </span> Category :{" "}
                    <a href="#">Movers, Shifting </a>
                  </div>
                </div>
                <div className="postmeta">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Mauris eu nulla eget nisl dapibus...
                  </p>
                  <div className="view-btn">
                    <a href="#">Read More</a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      {/*Blog end*/}
      {/*app start*/}
      <div className="app-wrap">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-md-6 pull-right">
              {/*app info Start*/}
              <h1>Get Job App for your mobile</h1>
              <p>
                Aliquam vestibulum cursus felis. In iaculis iaculis sapien ac
                condimentum. Vestibulum congue posuere lacus, id tincidunt nisi
                porta sit amet. Suspendisse et sapien varius, pellentesque dui
                non, semper orci. Curabitur blandit, diam ut ornare ultricies.
              </p>
              <div className="appbtn">
                <div className="row">
                  <div className="col-lg-5 col-md-6 ">
                    <a href="#.">
                      <img src="images/apple.png" alt="" />
                    </a>
                  </div>
                  <div className="col-lg-5 col-md-6 ">
                    <a href="#.">
                      <img src="images/andriod.png" alt="" />
                    </a>
                  </div>
                </div>
              </div>
              {/*app info end*/}
            </div>
            <div className="col-lg-5 col-md-6">
              {/*app image Start*/}
              <div className="appimg">
                <img src="images/app-mobile.png" alt="Your alt text here" />
              </div>
              {/*app image end*/}
            </div>
          </div>
        </div>
      </div>
      {/*app end*/}
    </>
  );
}
