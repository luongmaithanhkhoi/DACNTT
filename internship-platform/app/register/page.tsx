export default function RegisterPage() {
  return (
    <>
      {/* ===== Inner Heading ===== */}
      <div className="inner-heading">
        <div className="container">
          <h3>Register</h3>
        </div>
      </div>

      {/* ===== Register Form ===== */}
      <div className="inner-content loginWrp">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-2"></div>

            <div className="col-lg-6 col-md-8">
              <div className="login">
                <div className="contctxt">
                  Please complete all fields.
                </div>

                <div className="formint conForm">
                  <form>
                    <div className="input-wrap">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="form-control"
                      />
                    </div>

                    <div className="input-wrap">
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="form-control"
                      />
                    </div>

                    <div className="input-wrap">
                      <input
                        type="text"
                        placeholder="Street Address"
                        className="form-control"
                      />
                    </div>

                    <div className="input-wrap">
                      <select className="form-control">
                        <option>Select City</option>
                        <option>New York</option>
                        <option>London</option>
                        <option>Washington</option>
                        <option>New Jersey</option>
                      </select>
                    </div>

                    <div className="input-wrap">
                      <input
                        type="text"
                        placeholder="Zip Code"
                        className="form-control"
                      />
                    </div>

                    <div className="input-wrap">
                      <input
                        type="text"
                        placeholder="Phone Number"
                        className="form-control"
                      />
                    </div>

                    <div className="sub-btn">
                      <input
                        type="submit"
                        className="sbutn"
                        value="Register Now"
                      />
                    </div>

                    <div className="newuser">
                      <i className="fa fa-user" /> Already have account?
                      <a href="/login"> Login Here</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-md-2"></div>
          </div>
        </div>
      </div>

  
    </>
  );
}
