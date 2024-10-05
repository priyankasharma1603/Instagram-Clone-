import React, {useState, useContext} from "react";
import {Link, useNavigate} from 'react-router-dom';
import {UserContext} from '../../App';
import M from 'materialize-css';
import M1 from '../../assets/gplay.png';
import M2 from '../../assets/micro.png';

import '../styles/signin.css';

const Signin = () => {
   const {state, dispatch} = useContext(UserContext);
   const navigate = useNavigate();
   const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");

   const PostData = () => {
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
         M.toast({html: "Invalid email", classes: "#c62828 red darken-3"});
         return;
      }
      fetch("/signin", {
         method: "post",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            password,
            email
         })
      }).then(res => res.json())
         .then(data => {
            console.log(data);
            if (data.error) {
               M.toast({html: data.error, classes: "#c62828 red darken-3"});
            } else {
               localStorage.setItem("jwt", data.token);
               localStorage.setItem("user", JSON.stringify(data.user));
               dispatch({type: "USER", payload: data.user});
               M.toast({html: "Signed in Successfully", classes: "#689f38 light-green darken-2"});
               navigate('/');
            }
         }).catch(err => {
         console.log(err);
      });
   };

   return (
      <div className="mycard">
         <div className="card auth-card input-field">
            <h2>Instagram</h2>
            <input
               type="text"
               placeholder="Phone number, username, or email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
            />
            <input
               type="password"
               placeholder="Password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
            />
            <button className="btn " id="login" onClick={() => PostData()}>
               Log in
            </button>
            <div className="or-divider">
               <span>OR</span>
            </div>
            <button className="btn white" style={{ width: '100%', marginTop: '10px',color:"darkblue",boxShadow:"none"}}>
               <i className="fab fa-facebook-square" style={{ marginRight: '5px' }}></i>
               Log in with Facebook
            </button>
            <h2 style={{fontFamily:"sans-serif",fontSize:"0.9rem",textAlign:"center",color:"darkblue",fontWeight:"lighter",marginTop:"10px"}}>
               <Link to="/">Forgot password?</Link>
            </h2>
            <h5 style={{fontFamily:"sans-serif",fontSize:"1rem", margin:"5px"}}>
               Don't have an account? <Link to="/signup">Sign up</Link>
            </h5>

         </div>
         <div style={{ textAlign: "center", marginTop: "20px" }}>
        <p>Get the app.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <img src={M1} alt="Google Play" width="135" />
          <img src={M2} alt="Microsoft Store" width="135" />
        </div>
      </div>
      </div>
      
   );
};

export default Signin;
