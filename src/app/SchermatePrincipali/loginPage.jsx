import "./login.css";

 function Login() {
  return ( 
    <div className="login-container">
      <div className="login-box">
        <div className="login-header"> 
        <img id="logo" src="Untitled.png" alt="" />
          <h1 className="logo">Spotify</h1> 
          <div className="tabs"> 
            <button className="tab active">LOGIN </button>    
          </div> 
        </div>  
        <form className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="example@gmail.com" />
          </div> 
 
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="password" />
          </div>

          <div className="form-options">
            <label className="checkbox">
              <input type="checkbox"/>
              Stay signed in 
            </label>
            <a href="#forgetPassword" className="forgot">
              Forgot Password?
            </a>
          </div>
 
          <button type="button" className="btn-submit">
           Login 
          </button>
        </form>  
      </div>
    </div>
  );
} 
export default Login;
 