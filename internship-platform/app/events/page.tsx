"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import EventList from "./components/EventList";
import EventSidebar from "./components/EventSidebar";

export default function EventPage() {
  const searchParams = useSearchParams();

  // state filter
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");

  /**
   * ✅ SYNC URL QUERY → STATE
   * Ví dụ:
   * /events?q=abc&category=UUID
   */
  useEffect(() => {
    const qParam = searchParams.get("q") ?? "";
    const categoryParam = searchParams.get("category") ?? "";

    setQ(qParam);
    setCategoryId(categoryParam);
  }, [searchParams]);
  
  return (
    <>
      {/*inner heading start*/}
      <div className="inner-heading">
        <div className="container">
          <h3>Blog</h3>
        </div>
      </div>
      {/*inner heading end*/}
      {/*Inner Content start*/}
      <div className="inner-content blog-wrap">
        <div className="container">
          {/*Blog Start*/}
          <div className="row">
            <div className="col-lg-8">
              {/* Blog List start */}
              {/* <div className="blogWraper">
                <ul className="blogList">
                  <li>
                    <div className="row">
                      <div className="col-lg-5 col-md-4">
                        <div className="postimg">
                          <img src="images/blog/1.jpg" alt="Blog Title" />
                          <div className="date"> 17 SEP</div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-8">
                        <div className="post-header">
                          <h4>
                            <a href="#">Duis ultricies aliquet mauris</a>
                          </h4>
                          <div className="postmeta">
                            By : <span>Luck Walker </span> Category :{" "}
                            <a href="#">Movers, Shifting, Packers </a>
                          </div>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Mauris eu nulla eget nisl dapibus finibus. ...
                        </p>
                        <div className="view-btn">
                          <a href="#">Read More</a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col-lg-5 col-md-4">
                        <div className="postimg">
                          <img src="images/blog/2.jpg" alt="Blog Title" />
                          <div className="date"> 17 SEP</div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-8">
                        <div className="post-header">
                          <h4>
                            <a href="#">Duis ultricies aliquet mauris</a>
                          </h4>
                          <div className="postmeta">
                            By : <span>Luck Walker </span> Category :{" "}
                            <a href="#">Movers, Shifting, Packers </a>
                          </div>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Mauris eu nulla eget nisl dapibus finibus. ...
                        </p>
                        <div className="view-btn">
                          <a href="#">Read More</a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col-lg-5 col-md-4">
                        <div className="postimg">
                          <img src="images/blog/3.jpg" alt="Blog Title" />
                          <div className="date"> 17 SEP</div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-8">
                        <div className="post-header">
                          <h4>
                            <a href="#">Duis ultricies aliquet mauris</a>
                          </h4>
                          <div className="postmeta">
                            By : <span>Luck Walker </span> Category :{" "}
                            <a href="#">Movers, Shifting, Packers </a>
                          </div>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Mauris eu nulla eget nisl dapibus finibus. ...
                        </p>
                        <div className="view-btn">
                          <a href="#">Read More</a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col-lg-5 col-md-4">
                        <div className="postimg">
                          <img src="images/blog/4.jpg" alt="Blog Title" />
                          <div className="date"> 17 SEP</div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-8">
                        <div className="post-header">
                          <h4>
                            <a href="#">Duis ultricies aliquet mauris</a>
                          </h4>
                          <div className="postmeta">
                            By : <span>Luck Walker </span> Category :{" "}
                            <a href="#">Movers, Shifting, Packers </a>
                          </div>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Mauris eu nulla eget nisl dapibus finibus. ...
                        </p>
                        <div className="view-btn">
                          <a href="#">Read More</a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col-lg-5 col-md-4">
                        <div className="postimg">
                          <img src="images/blog/1.jpg" alt="Blog Title" />
                          <div className="date"> 17 SEP</div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-8">
                        <div className="post-header">
                          <h4>
                            <a href="#">Duis ultricies aliquet mauris</a>
                          </h4>
                          <div className="postmeta">
                            By : <span>Luck Walker </span> Category :{" "}
                            <a href="#">Movers, Shifting, Packers </a>
                          </div>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Mauris eu nulla eget nisl dapibus finibus. ...
                        </p>
                        <div className="view-btn">
                          <a href="#">Read More</a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col-lg-5 col-md-4">
                        <div className="postimg">
                          <img src="images/blog/2.jpg" alt="Blog Title" />
                          <div className="date"> 17 SEP</div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-8">
                        <div className="post-header">
                          <h4>
                            <a href="#">Duis ultricies aliquet mauris</a>
                          </h4>
                          <div className="postmeta">
                            By : <span>Luck Walker </span> Category :{" "}
                            <a href="#">Movers, Shifting, Packers </a>
                          </div>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Mauris eu nulla eget nisl dapibus finibus. ...
                        </p>
                        <div className="view-btn">
                          <a href="#">Read More</a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col-lg-5 col-md-4">
                        <div className="postimg">
                          <img src="images/blog/3.jpg" alt="Blog Title" />
                          <div className="date"> 17 SEP</div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-8">
                        <div className="post-header">
                          <h4>
                            <a href="#">Duis ultricies aliquet mauris</a>
                          </h4>
                          <div className="postmeta">
                            By : <span>Luck Walker </span> Category :{" "}
                            <a href="#">Movers, Shifting, Packers </a>
                          </div>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Mauris eu nulla eget nisl dapibus finibus. ...
                        </p>
                        <div className="view-btn">
                          <a href="#">Read More</a>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div className="col-lg-5 col-md-4">
                        <div className="postimg">
                          <img src="images/blog/4.jpg" alt="Blog Title" />
                          <div className="date"> 17 SEP</div>
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-8">
                        <div className="post-header">
                          <h4>
                            <a href="#">Duis ultricies aliquet mauris</a>
                          </h4>
                          <div className="postmeta">
                            By : <span>Luck Walker </span> Category :{" "}
                            <a href="#">Movers, Shifting, Packers </a>
                          </div>
                        </div>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Mauris eu nulla eget nisl dapibus finibus. ...
                        </p>
                        <div className="view-btn">
                          <a href="#">Read More</a>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div> */}
              <EventList limit={6} q={q} categoryId={categoryId} />
            </div>
            <div className="col-lg-4">
              {/* Side Bar */}
              <EventSidebar
                q={q}
                categoryId={categoryId}
                onApply={({ q, categoryId }) => {
                  setQ(q);
                  setCategoryId(categoryId);
                }}
              />
            </div>
          </div>
          {/*Blog End*/}
        </div>
      </div>
      {/*Inner Content End*/}
    </>
  );
}
