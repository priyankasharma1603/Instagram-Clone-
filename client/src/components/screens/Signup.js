import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import "../styles/signup.css";
import M1 from '../../assets/gplay.png';
import M2 from '../../assets/micro.png';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [url, setUrl] = useState(undefined);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Myinsta"); 
    data.append("cloud_name", "priyankasharma"); 
    fetch("https://api.cloudinary.com/v1_1/priyankasharma/image/upload", {
        method: "POST",
        body: data
    })
    .then(res => {
        if (!res.ok) {
            throw new Error("Cloudinary upload failed");
        }
        return res.json();
    })
    .then(data => {
        if (!data.url) {
            throw new Error("Failed to get image URL");
        }
        setUrl(data.url); 
      });
  };

  const uploadFields = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      M.toast({ html: "Invalid email", classes: "#c62828 red darken-3" });
      return;
    }

    setLoading(true);
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic: url // Ensure the pic URL is included here
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          return;
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          M.toast({
            html: data.message,
            classes: "#689f38 light-green darken-2",
          });
          navigate("/signin"); // Redirect to welcome page after signup
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  }

  return (
    <div className="mycard1">
      <div className="card auth-card1 input-field" style={{ height: "700px" }}>
        <h2>Instagram</h2>
        <h5>Sign up to see photos and videos from your friends.</h5>
        <button className="btn blue darken-1" style={{ width: "100%" }}>
          <i className="fab fa-facebook-square" style={{ marginRight: '5px' }}></i>
          Log in with Facebook
        </button>
        <h5 style={{ textAlign: "center" }}>OR</h5>
        <input
          type="text"
          placeholder="Mobile Number or Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn #1e88e5 blue darken-1" style={{ borderRadius: "6px", fontFamily: "sans-serif" }}>
            <span>Upload pic</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <h6>People who use our service may have uploaded your contact information to Instagram. Learn More</h6>
        <h6>
          By signing up, you agree to our{" "}
          <Link to="/terms">Terms</Link>, <Link to="/privacy">Privacy Policy</Link>, and{" "}
          <Link to="/cookies">Cookies Policy</Link>.
        </h6>
        <button
          className="btn #1e88e5 blue darken-1"
          onClick={() => PostData()}
          style={{ borderRadius: "6px", width: "100%" }}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </div>
      <div className="card1">
        <h5 style={{ fontFamily: "sans-serif", fontSize: "1.2rem" }}>
          Already have an account? <Link to="/signin">Sign in</Link>
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

export default Signup;
