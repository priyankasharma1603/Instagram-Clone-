import React, { useState } from "react";
import M from "materialize-css";
import { useNavigate } from "react-router-dom";


const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");

    const postDetails = () => {
        if (!title || !body || !image) {
            return M.toast({ html: "Please fill in all fields", classes: "toast-error" });
        }

        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "Myinsta");
        data.append("cloud_name", "priyankasharma");

        // Upload image to Cloudinary
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

            return fetch("/createpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    photo: data.url
                })
            });
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Post creation failed");
            }
            return res.json();
        })
        .then(postData => {
            if (postData.error) {
                M.toast({ html: postData.error, classes: "toast-error" });
            } else {
                M.toast({ html: "Created post successfully", classes: "toast-success" });
                navigate('/');
            }
        })
        .catch(err => {
            console.error("Error:", err);
            M.toast({ html: err.message, classes: "toast-error" });
        });
    };

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h5 className="card-title">Create a New Post</h5>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Body" 
                    value={body} 
                    onChange={(e) => setBody(e.target.value)} 
                />
                <div className="file-field input-field">
                    <div className="btn btn-upload Roboto" >
                        <span >Upload Image</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button 
                    className="btn btn-submit" 
                    type="submit" 
                    onClick={postDetails}
                >
                    Submit Post
                </button>
            </div>
        </div>
    );
};

export default CreatePost;
