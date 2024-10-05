import React, { useEffect, createContext, useReducer, useContext } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import SubscribeUserPosts from './components/screens/SubscribesUserPosts';
import UserProfile from './components/screens/UserProfile';
import Notification from './components/screens/Notification';
import { reducer, initialState } from './reducers/userReducer';

// Create UserContext to manage global user state
export const UserContext = createContext();

// Routing component
const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = localStorage.getItem('user'); // Get the user from localStorage

    if (user) {
      try {
        const parsedUser = JSON.parse(user); // Parse the user JSON string
        dispatch({ type: 'USER', payload: parsedUser }); // Dispatch user to state
      } catch (error) {
        console.error('Error parsing user from localStorage:', error); // Handle JSON parsing error
      }
    } else {
      navigate('/signin'); // Redirect to sign-in page if no user is found
    }
  }, [dispatch, navigate]);

  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/myfollowerpost" element={<SubscribeUserPosts />} />
      <Route path="/Notification" element={<Notification />} />
    </Routes>
  );
};

// Main App component
function App() {
  const [state, dispatch] = useReducer(reducer, initialState); // useReducer for managing state

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Routing /> {/* Routing component for handling all routes */}
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
