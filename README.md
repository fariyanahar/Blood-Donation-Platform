# Blood-Donation-Platform
A blood donation platform where donors can accept posts created by recipients and join blood donation events organized by the admin. Recipients can create posts specifying their blood type, location and other information, join events, and collect blood from those events. The admin manages users, posts, and events. The backend was developed using MySQL, Node.js, and Express.js, and built a REST API to ensure smooth communication with the frontend. The frontend was developed using HTML, vanilla JavaScript, CSS and Bootstrap for simplicity and ease of use.


Project Features
1. Token-based authentication using JWT and Passport js.  
2. Role-Based Access Control (RBAC).  
3. Donors can donate blood by responding to recipients' posts or attending events.  
4. Recipients can create posts to seek blood or join events to collect blood directly.  
5. Proper input validation.
6. Users can edit their profile information.  
7. Proper management of post and profile ownership.  
8. Accurate handling of blood compatibility and donation validity. 
9. Proper management of post confirmations, event participation, and blood collections.  
10. Admins can delete users, create and manage events, and delete posts.  
11. Fully functional filtering and sorting for posts, users, and events.

Frontend Development: For the frontend, HTML, CSS, and Bootstrap was used. Vanilla JavaScript was used for page interactivity. Utilizing JavaScript's FETCH method to handle HTTP requests and responses with the backend API, which ultimately interacts with the database. To keep the styling simple, Bootstrap classes were extensively used.

Backend Development: For the database, MySQL was used. Since Express.js framework was used to build the REST API, the database was connected to the backend using the mysql2/promise module. This module provided JavaScript promises, which were very useful for handling asynchronous operations. After establishing the database connection, a models folder was set up containing raw MySQL queries encapsulated in JavaScript functions. These functions were designed to support dynamic query building. The API was set up to handle all HTTP requests, with controller functions managing the responses accordingly. The JOI library was used to validate input effectively. Authentication was implemented using JWT and Passport.js. The backend fully supports Role-Based Access Control (RBAC), with middleware utilized to enforce authorization rules.



