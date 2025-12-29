"use client";

import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import LocationAutocomplete from "./components/home/LocationAutocomplete";
import CategorySelect from "./components/home/CategorySelect";
import JobCategoryGrid from "./components/home/JobCategoryGrid";
import FeaturedJobs from "./components/home/FeaturedJobs";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryAutocomplete from "./components/home/CategoryAutocomplete";

export default function Home() {
  const [locationId, setLocationId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  return (
    <>
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
                      <CategoryAutocomplete onSelect={setCategoryId} />
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
          {/* <ul className="row">
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
          </ul> */}
          <div className="browse-jobs">
            <JobCategoryGrid />
          </div>

          <div className="read-btn">
            <a href="#">View All Categories</a>
          </div>
        </div>
      </div>
      {/*Browse Job End*/}
      {/*featured jobs*/}
      {/* <div className="featured-wrap">
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
      </div> */}
      <div className="featured-wrap">
        <div className="container">
          <div className="heading-title">
            Tin <span>Tuyển dụng</span>
          </div>

          <FeaturedJobs />

          <div className="read-btn">
            <a href="/jobs">View All Featured Jobs</a>
          </div>
        </div>
      </div>
      {/*feature end*/}
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
