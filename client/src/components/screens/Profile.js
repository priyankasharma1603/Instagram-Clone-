import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import '../styles/Profile.css';
import Sidebar from '../screens/Sidebar'; // Importing the Sidebar component

const Profile = () => {
    const [mypics, setPics] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState("");

    useEffect(() => {
        fetch('/mypost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setPics(result.mypost);
            });
    }, []);

    useEffect(() => {
        if (image) {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "Myinsta");
            data.append("cloud_name", "priyankasharma");
            fetch("https://api.cloudinary.com/v1_1/priyankasharma/image/upload", {
                method: "post",
                body: data
            })
                .then(res => res.json())
                .then(data => {
                    fetch('/updatepic', {
                        method: "put",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            localStorage.setItem("user", JSON.stringify({ ...state, pic: result.pic }));
                            dispatch({ type: "UPDATEPIC", payload: result.pic });
                        });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [image, state, dispatch]);

    const updatePhoto = (file) => {
        setImage(file);
    };

    return (
        <div className="profile-container">
            {/* Profile Section on the Left */}
            <div className="profile-main">
                <div className="profile-header">
                    <div className="profile-img">
                        <img
                            src={state?.pic || "loading"}
                            alt="profile"
                        />
                    </div>
                    <div className="profile-info">
                        <h4>{state?.name || "loading"}</h4>
                        <h5>{state?.email || "loading"}</h5>
                        <div className="profile-stats">
                            <h6>{mypics.length} posts</h6>
                            <h6>{state?.followers?.length || "0"} followers</h6>
                            <h6>{state?.following?.length || "0"} following</h6>
                        </div>
                        <div className="update-pic">
                            <label className="custom-file-upload">
                                <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                                Update Pic
                            </label>
                        </div>
                    </div>
                </div>

                <div className="gallery">
                    {mypics.map(item => (
                        <img key={item._id} className="gallery-item" src={item.photo} alt={item.title} />
                    ))}
                </div>
            </div>

            {/* Sidebar Section on the Right */}
            <Sidebar />
        </div>
    );
};

export default Profile;
