import PostJobForm from "./PostJobForm";

export default function PostJobPage() {
  return (
    <>
      {/* Inner Heading */}
      {/* <div className="inner-heading">
        <div className="container">
          <h3>Post a Job</h3>
        </div>
      </div> */}

      {/* Inner Content */}
      <div className="inner-content loginWrp">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 col-md-2" />
            <div className="col-lg-8 col-md-8">
              <div className="login">
                <div className="contctxt">Job Information</div>
                <PostJobForm/>
              </div>
            </div>
            <div className="col-lg-2 col-md-2" />
          </div>
        </div>
      </div>
    </>
  );
}
