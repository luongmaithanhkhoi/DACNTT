"use client";

import Head from "next/head";
import Script from "next/script";
import Link from "next/link";
import LocationAutocomplete from "./components/home/LocationAutocomplete";
import CategorySelect from "./components/home/CategorySelect";
import JobCategoryGrid from "./components/home/JobCategoryGrid";
import FeaturedJobs from "./components/home/FeaturedJobs";
import HomeLatestBlogs from "./components/home/HomeLatestBlogs";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryAutocomplete from "./components/home/CategoryAutocomplete";

export default function Home() {
  const [locationId, setLocationId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const router = useRouter();
  const [q, setQ] = useState("");

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
  
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (locationId) params.set("location", locationId);
    if (categoryId) params.set("category", categoryId);
  
    router.push(`/job-listing?${params.toString()}`);
  };
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
              <form onSubmit={onSubmitSearch}>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="input-group">
                      <input
                         type="text"
                         placeholder="Job title, skills, or company"
                         className="form-control"
                         value={q ?? ""}
                         onChange={(e) => setQ(e.target.value)}
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
    
          <div className="browse-jobs">
            <JobCategoryGrid />
          </div>

          <div className="read-btn">
            <a href="/job-listing">View All Categories</a>
          </div>
        </div>
      </div>
      {/*Browse Job End*/}
      {/*featured jobs*/}
      <div className="featured-wrap">
        <div className="container">
          <div className="heading-title">
            Tin <span>Tuyển dụng</span>
          </div>

          <FeaturedJobs />

          <div className="read-btn">
            <Link href="/job-listing">View All Featured Jobs</Link>
          </div>
        </div>
      </div>
      {/*feature end*/}
      {/*Blog start*/}
      <HomeLatestBlogs />
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
