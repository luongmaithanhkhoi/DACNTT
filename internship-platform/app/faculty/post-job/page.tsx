import PostJobForm from "./PostJobForm";

export default function PostJobPage() {
  
  const isAdmin = true; 

  return (
    <>
      <div className="inner-heading">
        <div className="container">
          <h3>Post a Job {isAdmin && "(Admin Mode)"}</h3>
        </div>
      </div>

      <div className="inner-content loginWrp">
        <div className="container">
          <div className="row">
            <div className="col-lg-2 col-md-2" />
            <div className="col-lg-8 col-md-8">
              <div className="login">
                <div className="contctxt">
                  {isAdmin ? "Create Job for Enterprise" : "Job Information"}
                </div>
                <PostJobForm 
                  isAdmin={isAdmin} 
                  enterpriseId="" // Admin không cần truyền
                />
              </div>
            </div>
            <div className="col-lg-2 col-md-2" />
          </div>
        </div>
      </div>
    </>
  );
}