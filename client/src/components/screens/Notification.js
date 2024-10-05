import React from 'react';
import '../styles/Notification.css'; // Importing the stylesheet

const notifications = [
  {
    id: 1,
    name: 'Isabella Meyer',
    action: 'started following you.',
    time: 'About 2 hours ago',
    profilePic: '/path/to/profile1.jpg', // Replace with your image path
  },
  {
    id: 2,
    name: 'Victoria Lamb',
    action: 'liked your photo.',
    time: '13 hours ago',
    profilePic: '/path/to/profile2.jpg',
    contentPic: '/path/to/content1.jpg',
  },
  {
    id: 3,
    name: 'Lloyd Stokes',
    action: 'commented: This is cool!',
    time: '1 day ago',
    profilePic: '/path/to/profile3.jpg',
    contentPic: '/path/to/content2.jpg',
  },
];

const Notification = () => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div className="notification-card" key={notification.id}>
          <div className="notification-profile">
            <img
              src="https://images.unsplash.com/photo-1445053023192-8d45cb66099d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ufGVufDB8fDB8fHww"
              alt={`${notification.name}'s profile`}
              className="profile-pic"
            />
          </div>
          <div className="notification-content">
            <span>
              <strong>{notification.name}</strong> {notification.action}
            </span>
            <small>{notification.time}</small>
          </div>
          {notification.contentPic && (
            <div className="notification-content-image">
              <img
                src="https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww"
                alt="Content"
                className="content-pic"
              />
            </div>
          )}
        </div>
      ))}
      <div className="see-all">
        <span>See All Notifications</span>
      </div>
    </div>
  );
};

export default Notification;
