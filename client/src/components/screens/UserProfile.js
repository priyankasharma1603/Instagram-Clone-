import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
import Sidebar from '../screens/Sidebar'; // Import Sidebar component
import '../styles/Profile.css'; // Import custom CSS

const Profile = () => {
  const [userProfile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  
  const [showFollow, setShowFollow] = useState(() => {
    if (state && state.following) {
      return !state.following.includes(userid);
    }
    return true;
  });

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then((res) => res.json())
      .then((result) => {
        setProfile(result);
      })
      .catch((err) => console.error("Error fetching user profile:", err));
  }, [userid]);

  const followUser = () => {
    fetch('/follow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        followId: userid
      })
    }).then(res => res.json())
      .then(data => {
        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            followers: [...prevState.user.followers, data._id]
          }
        }));
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch('/unfollow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    }).then(res => res.json())
      .then(data => {
        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(item => item !== data._id);
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower
            }
          };
        });
        setShowFollow(true);
      });
  };

  return (
    <div className="profile-container">
      {userProfile ? (
        <>
          <div className="profile-main">
            <div className="profile-header">
              <div className="profile-img">
                <img
                  src={userProfile.user.pic}
                  alt={userProfile.user.name}
                />
              </div>
              <div className="profile-info">
                <h4>{userProfile.user.name}</h4>
                <h5>{userProfile.user.email}</h5>
                <div className="profile-stats">
                  <h6>{userProfile.posts.length} posts</h6>
                  <h6>{userProfile.user.followers.length} followers</h6>
                  <h6>{userProfile.user.following.length} following</h6>
                </div>
                {showFollow ? (
                  <button className="follow-btn" onClick={followUser}>
                    Follow
                  </button>
                ) : (
                  <button className="unfollow-btn" onClick={unfollowUser}>
                    UnFollow
                  </button>
                )}
              </div>
            </div>

            <div className="gallery">
              {userProfile.posts.map(item => (
                <img key={item._id} className="gallery-item" src={item.photo} alt={item.title} />
              ))}
            </div>
          </div>
          <Sidebar /> {/* Sidebar component on the right */}
        </>
      ) : (
        <h2>Loading...!</h2>
      )}
    </div>
  );
};

export default Profile;
