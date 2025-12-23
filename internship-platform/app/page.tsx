"use client";

import Head from "next/head";
import Script from "next/script";
import LocationAutocomplete from "./components/LocationAutocomplete";
import { useState } from "react";

export default function Home() {
  const [locationId, setLocationId] = useState("");
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
      <div className="header-wrap">
        <div className="container">
          {/*row start*/}
          <div className="row">
            {/*col-lg-3 start*/}
            <div className="col-lg-3 col-md-3 navbar-light">
              <div className="logo">
                <a href="index.html">
                  <img src="images/logo.png" alt="" />
                </a>
              </div>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarScroll"
                aria-controls="navbarScroll"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
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
                  <div className="navbar-collapse collapse" id="navbarScroll">
                    <ul className="nav navbar-nav">
                      <li className="dropdown">
                        {" "}
                        <a href="index.html" className="active">
                          {" "}
                          Home <span className="caret" />
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            {" "}
                            <a href="index.html"> Home with image </a>
                          </li>
                          <li>
                            {" "}
                            <a href="index2.html"> Home with slider </a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        {" "}
                        <a href="about-us.html"> About Us</a>
                      </li>
                      <li className="dropdown">
                        {" "}
                        <a href="#">
                          {" "}
                          Pages <span className="caret" />
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            {" "}
                            <a href="about-us.html"> About Us </a>
                          </li>
                          <li>
                            {" "}
                            <a href="job-listing.html"> Job Listing </a>
                          </li>
                          <li>
                            {" "}
                            <a href="job-details.html"> Job Details </a>
                          </li>
                          <li>
                            {" "}
                            <a href="candidates-listing.html">
                              {" "}
                              Jobseeker Listing{" "}
                            </a>
                          </li>
                          <li>
                            {" "}
                            <a href="candidates-details.html">
                              {" "}
                              Jobseeker Details{" "}
                            </a>
                          </li>
                          <li>
                            {" "}
                            <a href="login.html"> Login </a>
                          </li>
                          <li>
                            {" "}
                            <a href="register.html"> Register </a>
                          </li>
                          <li>
                            {" "}
                            <a href="post-job.html"> Job Post </a>
                          </li>
                          <li>
                            {" "}
                            <a href="pricing.html"> Packages </a>
                          </li>
                          <li>
                            {" "}
                            <a href="testimonials.html"> Testimonials </a>
                          </li>
                          <li>
                            {" "}
                            <a href="faqs.html"> FAQ </a>
                          </li>
                          <li>
                            {" "}
                            <a href="404.html"> 404 Page </a>
                          </li>
                          <li>
                            {" "}
                            <a href="typoghrapy.html"> Typoghrapy </a>
                          </li>
                        </ul>
                      </li>
                      <li className="dropdown">
                        {" "}
                        <a href="blog.html">
                          {" "}
                          Blog <span className="caret" />
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            {" "}
                            <a href="blog-grid.html"> Blog Grid sidebar</a>
                          </li>
                          <li>
                            {" "}
                            <a href="blog.html"> Blog List sidebar</a>
                          </li>
                          <li>
                            {" "}
                            <a href="blog-grid-full-width.html">
                              {" "}
                              Blog full width{" "}
                            </a>
                          </li>
                          <li>
                            {" "}
                            <a href="blog-details.html">
                              {" "}
                              Blog Details with sidebar{" "}
                            </a>
                          </li>
                          <li>
                            {" "}
                            <a href="blog-details-full-width.html">
                              {" "}
                              Blog Details{" "}
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        {" "}
                        <a href="contact-us.html"> Contact us </a>
                      </li>
                    </ul>
                  </div>
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
                  <a href="post-job.html">Post a Job</a>
                </div>
                <div className="user-wrap">
                  <div className="login-btn">
                    <a href="login.html">Login</a>
                  </div>
                  <div className="register-btn">
                    <a href="register.html">Register</a>
                  </div>
                  <div className="clearfix" />
                </div>
                <div className="clearfix" />
              </div>
            </div>
            {/*col-lg-2 end*/}
          </div>
          {/*row end*/}
        </div>
      </div>
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
                      <LocationAutocomplete onSelect={setLocationId} />
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
      {/*footer start*/}
      <div className="footer-wrap">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-12">
              <div className="footer-logo">
                <img src="images/footer-logo.png" alt="" />
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                sit amet quam eu purus rutrum suscipit eget ac lacus. Donec vel
                euismod odio. Suspendisse consectetur quis risus sit amet
                aliquam. Phasellus pretium maximus lobortis. Nam pulvinar magna
                ac risus condimentum fringilla. Morbi in sodales tortor, ut
                euismod orci. ...
              </p>
              <div className="read-btn">
                <a href="#">Read More</a>
              </div>
            </div>
            <div className="col-lg-8 col-md-12">
              <div className="row">
                <div className="col-lg-4 col-md-4">
                  <h3>Quick LInks</h3>
                  <ul className="footer-links">
                    <li>
                      <a href="#.">About Us</a>
                    </li>
                    <li>
                      <a href="#.">Career Resources</a>
                    </li>
                    <li>
                      <a href="#.">Categories</a>
                    </li>
                    <li>
                      <a href="#.">Blog</a>
                    </li>
                    <li>
                      <a href="#.">Terms of Service</a>
                    </li>
                    <li>
                      <a href="#.">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="#.">Register</a>
                    </li>
                    <li>
                      <a href="#.">Submit Resume</a>
                    </li>
                    <li>
                      <a href="#.">Contact Us</a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 col-md-4">
                  <h3>Jobs in Pakistan</h3>
                  <ul className="footer-links">
                    <li>
                      <a href="#">New York</a>
                    </li>
                    <li>
                      <a href="#">Dothan</a>
                    </li>
                    <li>
                      <a href="#">Alexander City</a>
                    </li>
                    <li>
                      <a href="#">Enterprise</a>
                    </li>
                    <li>
                      <a href="#">Chickasaw</a>
                    </li>
                    <li>
                      <a href="#">Clanton</a>
                    </li>
                    <li>
                      <a href="#">Cullman</a>
                    </li>
                    <li>
                      <a href="#">Andalusia</a>
                    </li>
                    <li>
                      <a href="#">Anniston</a>
                    </li>
                  </ul>
                </div>
                <div className="col-lg-4 col-md-4">
                  <h3>Jobs by Categories</h3>
                  <ul className="footer-links">
                    <li>
                      <a href="#">Computer Software Jobs</a>
                    </li>
                    <li>
                      <a href="#">Customer Service Jobs</a>
                    </li>
                    <li>
                      <a href="#">Education Jobs</a>
                    </li>
                    <li>
                      <a href="#">Engineering Jobs</a>
                    </li>
                    <li>
                      <a href="#">Manager/Supervisor Jobs</a>
                    </li>
                    <li>
                      <a href="#">Sr. Executive Jobs</a>
                    </li>
                    <li>
                      <a href="#">School/College Student Jobs</a>
                    </li>
                    <li>
                      <a href="#">Web &amp; E-commerce Jobs</a>
                    </li>
                    <li>
                      <a href="#">Accounting Jobs</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*footer end*/}
      {/*copyright start*/}
      <div className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="copyright">
                Copyright © 2021 Job Finder - All Rights Reserved.
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="social">
                <div className="followWrp">
                  {" "}
                  <span>Follow Us</span>
                  <ul className="social-wrap">
                    <li>
                      <a href="#.">
                        <i
                          className="fa fa-facebook-square"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#.">
                        <i
                          className="fa fa-twitter-square"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#.">
                        <i
                          className="fa fa-google-plus-square"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#.">
                        <i
                          className="fa fa-linkedin-square"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                    <li>
                      <a href="#.">
                        <i className="fa fa-vimeo-square" aria-hidden="true" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*copyright end*/}
      <Script src="js/jquery-2.1.4.min.js"></Script>
      <Script src="js/bootstrap.bundle.min.js"></Script>
      <Script
        type="text/javaScript"
        src="rs-plugin/js/jquery.themepunch.tools.min.js"
      ></Script>
      <Script
        type="text/javaScript"
        src="rs-plugin/js/jquery.themepunch.revolution.min.js"
      ></Script>
      <Script src="js/owl.carousel.js"></Script>
      <Script type="text/javaScript" src="js/Script.js"></Script>
    </>
  );
}
