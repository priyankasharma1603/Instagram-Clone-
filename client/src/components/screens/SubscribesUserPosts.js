import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [commentText, setCommentText] = useState(''); // State for comment input

    useEffect(() => {
        fetch('/getsubpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch posts');
            }
            return res.json();
        })
        .then(result => {
            setData(result.posts);
        })
        .catch(err => {
            console.error('Error fetching posts:', err);
        });
    }, []);

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to like post');
            }
            return res.json();
        })
        .then(result => {
            const newData = data.map(item => (item._id === result._id ? result : item));
            setData(newData);
        })
        .catch(err => {
            console.error('Error liking post:', err);
        });
    };

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to unlike post');
            }
            return res.json();
        })
        .then(result => {
            const newData = data.map(item => (item._id === result._id ? result : item));
            setData(newData);
        })
        .catch(err => {
            console.error('Error unliking post:', err);
        });
    };

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId, text })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to add comment');
            }
            return res.json();
        })
        .then(result => {
            const newData = data.map(item => (item._id === result._id ? result : item));
            setData(newData);
            setCommentText(''); // Clear comment input after submission
        })
        .catch(err => {
            console.error('Error adding comment:', err);
        });
    };

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to delete post');
            }
            return res.json();
        })
        .then(result => {
            const newData = data.filter(item => item._id !== result._id);
            setData(newData);
        })
        .catch(err => {
            console.error('Error deleting post:', err);
        });
    };

    return (
        <div className="home">
            {data.map(item => (
                <div className="card home-card" key={item._id}>
                    <h5 style={{ padding: "5px" }}>
                        <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                            {item.postedBy.name}
                        </Link>
                        {item.postedBy._id === state._id && (
                            <i className="material-icons" style={{ float: "right" }} onClick={() => deletePost(item._id)}>delete</i>
                        )}
                    </h5>
                    <div className="card-image">
                        <img src={item.photo} alt="Post" />
                    </div>
                    <div className="card-content">
                        <i className="material-icons" style={{ color: "red" }}>favorite</i>
                        {item.likes.includes(state._id) ? 
                            <i className="material-icons" onClick={() => unlikePost(item._id)}>thumb_down</i> : 
                            <i className="material-icons" onClick={() => likePost(item._id)}>thumb_up</i>
                        }
                        <h6>{item.likes.length} likes</h6>
                        <h6>{item.title}</h6>
                        <p>{item.body}</p>
                        {item.comments.map(record => (
                            <h6 key={record._id}>
                                <span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}
                            </h6>
                        ))}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            makeComment(commentText, item._id);
                        }}>
                            <input 
                                type="text" 
                                placeholder="add a comment" 
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)} // Set comment text
                            />  
                        </form>
                    </div>
                </div> 
            ))}
        </div>
    );
};

export default Home;
