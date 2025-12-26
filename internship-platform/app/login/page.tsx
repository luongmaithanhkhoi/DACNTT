import Head from "next/head";
import Script from "next/script";

export default function LoginPage() {
  return (
    <>
      {/* ===== Inner heading ===== */}
      <div className="inner-heading">
        <div className="container">
          <h3>Login</h3>
        </div>
      </div>

      {/* ===== Login Content ===== */}
      <div className="inner-content loginWrp">
        <div className="container">
          <div className="row">
            <div className="col-lg-3" />
            <div className="col-lg-6">
              <div className="login">
                <div className="contctxt">User Login</div>

                <div className="formint conForm">
                  <form>
                    <div className="input-wrap">
                      <label className="input-group-addon">Email</label>
                      <input
                        type="text"
                        placeholder="User Name"
                        className="form-control"
                      />
                    </div>

                    <div className="input-wrap">
                      <label className="input-group-addon">
                        Password <span><a href="#">Forgot Password?</a></span>
                      </label>
                      <input
                        type="password"
                        placeholder="Password"
                        className="form-control"
                      />
                    </div>

                    <div className="sub-btn">
                      <input type="submit" className="sbutn" value="Login" />
                    </div>

                    <div className="newuser">
                      <i className="fa fa-user" /> New User?
                      <a href="/register"> Register Here</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-lg-3" />
            
          </div>
          
        </div>
      </div>
    </>
  );
}
