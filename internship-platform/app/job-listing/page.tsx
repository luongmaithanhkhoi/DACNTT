"use client";

import React from "react";
import Script from "next/script";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CategoryFilter from "./components/CategoryFilter";
import LocationFilter from "./components/LocationFilter";
import JobsList from "./components/JobList";

export default function JobListing() {
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [locationId, setLocationId] = useState("");
  const isUuid = (s: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

  // chỉ apply khi bấm Search
  const [applied, setApplied] = useState({
    q: "",
    categoryId: "",
    locationId: "",
  });
  const searchParams = useSearchParams();

  useEffect(() => {
    const qParam = searchParams.get("q") ?? "";
    const categoryParam = searchParams.get("category") ?? "";
    const locationParam = searchParams.get("location") ?? "";
  
    setQ(qParam);
    setCategoryId(categoryParam);
    setLocationId(locationParam);
  
    // áp dụng filter luôn khi vào page từ Home
    setApplied({
      q: qParam,
      categoryId: categoryParam,
      locationId: locationParam,
    });
  }, [searchParams]);

  
  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setApplied({ q: q.trim(), categoryId, locationId });
  };

  return (
    <>
      <>
        {/*inner heading start*/}
        <div className="inner-heading">
          <div className="container">
            <h3>Job Listing</h3>
          </div>
        </div>
        {/*inner heading end*/}
        {/*Inner Content start*/}
        <div className="inner-content listing">
          <div className="container">
            {/*Job Listing Start*/}
            <div className="row">
              <div className="col-lg-4 col-xl-3">
                <div className="leftSidebar">
                  <div className="filter">Search Listings</div>
                  <div className="sidebarpad">
                    <form>
                      <h4>Job Search</h4>
                      <div className="input-wrap">
                        <input
                          type="text"
                          name="job search"
                          placeholder="Job Search"
                          className="form-control"
                        />
                      </div>
                      <h4>Categories</h4>
                      <div className="input-wrap">
                        <select name="category" className="form-control">
                          <option>Category </option>
                          <option value="designer">Web Designer</option>
                          <option value="developer">Web Developer</option>
                          <option value="seo">SEO Expert</option>
                        </select>
                      </div>
                      <h4>City</h4>
                      <div className="input-wrap">
                        <select name="city" className="form-control">
                          <option>Select Cities </option>
                          <option value={1}>New York</option>
                          <option value={2}>Chicago</option>
                          <option value={3}>San Diego</option>
                          <option value={4}>Los Angeles</option>
                          <option value={5}>Houston</option>
                        </select>
                      </div>
                      <h4>Price Range</h4>
                      <div className="input-wrap">
                        <ul className="check">
                          <li>
                            <input
                              type="checkbox"
                              defaultValue="Almost Like New"
                              name="price"
                              id="price"
                            />
                            <label htmlFor="price">
                              $100 to $199<span>4</span>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              defaultValue="Almost Like New"
                              name="price"
                              id="price2"
                            />
                            <label htmlFor="price2">
                              $200 to $299<span>9</span>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              defaultValue="Almost Like New"
                              name="price"
                              id="price3"
                            />
                            <label htmlFor="price3">
                              $300 to $399<span>17</span>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              defaultValue="Almost Like New"
                              name="price"
                              id="price4"
                            />
                            <label htmlFor="price4">
                              $400 to $499<span>42</span>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              defaultValue="Almost Like New"
                              name="price"
                              id="price5"
                            />
                            <label htmlFor="price5">
                              $500 to $599<span>12</span>
                            </label>
                          </li>
                        </ul>
                      </div>
                      <h4>Contract</h4>
                      <div className="input-wrap">
                        <ul className="check">
                          <li>
                            <input
                              type="checkbox"
                              defaultValue="Almost Like New"
                              name="contract"
                              id="contract2"
                            />
                            <label htmlFor="contract2">
                              Full Time<span>241</span>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              defaultValue="Almost Like New"
                              name="contract"
                              id="contract3"
                            />
                            <label htmlFor="contract3">
                              Part Time<span>159</span>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              defaultValue="Almost Like New"
                              name="contract"
                              id="contract4"
                            />
                            <label htmlFor="contract4">
                              Intership<span>172</span>
                            </label>
                          </li>
                          <li>
                            <input
                              type="checkbox"
                              defaultValue="Almost Like New"
                              name="contract"
                              id="contract5"
                            />
                            <label htmlFor="contract5">
                              Freelance<span>322</span>
                            </label>
                          </li>
                        </ul>
                      </div>
                      <div className="sub-btn">
                        <input
                          type="submit"
                          className="sbutn"
                          defaultValue="Search Filter"
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-xl-9">
                <div className="sortbybar">
                  <div className="sortbar listingSearch">
                    <div className="form-wrap">
                      <form onSubmit={onSubmitSearch}>
                        <div className="row">
                          <div className="col-xl-4">
                            <div className="input-group">
                              <input
                                type="text"
                                placeholder="Job title, skills, or company"
                                className="form-control"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="col-xl-3">
                            <div className="input-group">
                            <LocationFilter value={locationId} onSelect={setLocationId} />

                            </div>
                          </div>

                          <div className="col-xl-3">
                            <div className="input-group">
                              <CategoryFilter
                                value={categoryId}
                                onChange={setCategoryId}
                              />
                            </div>
                          </div>

                          <div className="col-xl-2">
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

                      <JobsList
                        limit={6}
                        q={applied.q}
                        locationId={applied.locationId}
                        categoryId={applied.categoryId}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/*Job Listing End*/}
          </div>
        </div>
        {/*Inner Content End*/}

        <Script src="js/jquery-2.1.4.min.js"></Script>
        <Script src="js/bootstrap.bundle.min.js"></Script>

        <Script
          type="text/javascript"
          src="rs-plugin/js/jquery.themepunch.tools.min.js"
        ></Script>
        <Script
          type="text/javascript"
          src="rs-plugin/js/jquery.themepunch.revolution.min.js"
        ></Script>

        <Script src="js/owl.carousel.js"></Script>
        <Script type="text/javascript" src="js/script.js"></Script>
      </>
    </>
  );
}
