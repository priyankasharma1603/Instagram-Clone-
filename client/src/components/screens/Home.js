import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import "../styles/Home.css";
import Sidebar from "../screens/Sidebar";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const { state } = useContext(UserContext);
  const [mypics, setPics] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/allpost", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();
        setData(result.posts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const likePost = async (id) => {
    try {
      const res = await fetch("/like", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ postId: id }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      const newData = data.map((item) =>
        item._id === result._id ? result : item
      );
      setData(newData);
    } catch (err) {
      console.error("Error liking post:", err);
      setError(err.message);
    }
  };

  const unlikePost = async (id) => {
    try {
      const res = await fetch("/unlike", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ postId: id }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      const newData = data.map((item) =>
        item._id === result._id ? result : item
      );
      setData(newData);
    } catch (err) {
      console.error("Error unliking post:", err);
      setError(err.message);
    }
  };

  const makeComment = async (text, postId) => {
    try {
      const res = await fetch("/comment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({ postId, text }),
      });

      const result = await res.json();
      const newData = data.map((item) => {
        return item._id === result._id ? result : item;
      });
      setData(newData);
    } catch (err) {
      console.error("Error making comment:", err);
      setError(err.message);
    }
  };

  const deletePost = async (postId) => {
    try {
      const res = await fetch(`/deletepost/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });

      const result = await res.json();
      const newData = data.filter(item => item._id !== result._id);
      setData(newData);
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err.message);
    }
  };

  const filteredPosts = data.filter((item) =>
    item.postedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading-message">Loading posts...</div>
      ) : (
        <>
          <div className="sidebar1">
            <Sidebar />
          </div>

          {/* Main Content Area */}
          <div className="main-content">
            {/* Search Bar */}
            <div className="search-bar">
              <i className="material-icons search-icon">search</i> {/* Icon inside search bar */}
              <input
                type="text"
                placeholder="Search by user name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="cancel-button" onClick={() => setSearchTerm("")}>
                  Cancel
                </button>
              )}
            </div>

            {/* Post Section */}
            <div className="home">
              {filteredPosts.length ? (
                filteredPosts.map((item) => (
                  <div className="card home-card" key={item._id}>
                    <h5 style={{ padding: "5px", display: "flex", alignItems: "center" }}>
                      <img
                        src={item.postedBy.pic || "https://res.cloudinary.com/priyankasharma/image/upload/v1727364792/dyzxxqwqst7cfggvuva7.png"}
                        alt="profile"
                        className="user-profile-icon"
                        style={{ width: "30px", height: "30px", marginRight: "10px" }}
                      />
                      <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                        {item.postedBy.name}
                      </Link>
                      {item.postedBy._id === state._id && (
                        <i
                          className="material-icons"
                          style={{ marginLeft: "auto", cursor: "pointer" }}
                          onClick={() => deletePost(item._id)}
                        >
                          delete
                        </i>
                      )}
                    </h5>

                    <div className="card-image">
                      <img src={item.photo} alt="post" />
                    </div>
                    <div className="card-content">
                      <div className="card-actions">
                        <i className="material-icons" style={{ color: "red" }}>
                          favorite
                        </i>
                        {item.likes.includes(state._id) ? (
                          <i className="material-icons" onClick={() => unlikePost(item._id)}>
                            thumb_down
                          </i>
                        ) : (
                          <i className="material-icons" onClick={() => likePost(item._id)}>
                            thumb_up
                          </i>
                        )}
                      </div>
                      <h6>{item.likes.length} likes</h6>
                      <h6>{item.title}</h6>
                      <p>{item.body}</p>
                      {item.comments.map((record) => (
                        <h6 key={record._id}>
                          <span style={{ fontWeight: "700" }}>{record.postedBy.name}</span> {record.text}
                        </h6>
                      ))}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          makeComment(e.target[0].value, item._id);
                        }}
                      >
                        <input type="text" placeholder="add a comment" />
                      </form>
                    </div>
                  </div>
                ))
              ) : (
                <div>No posts found</div>
              )}
            </div>
          </div>

          {/* User Details Section */}
          <div className="suggested">
            <div className="user-card">
              <img
                src={state?.pic || "loading"}
                alt="profile"
                className="user-image"
              />
              <h3>{state?.name || "loading"}</h3>
              <p>
                <span className="stat">{mypics.length} Photos</span> ·{" "}
                <span className="stat">{state?.followers?.length || "0"} followers</span>
              </p>
              <p className="user-bio">
                Hey this is {state?.name || "loading"}
              </p>
              <p className="user-bio">
                Check out my profile and follow me !!
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
