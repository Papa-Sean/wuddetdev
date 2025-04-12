User Experience Document (UXD) for wuddevdet.com
MVP Scope

1. Overview
Purpose: A community hub for web developers in Michigan (primarily Southeast Michigan/Detroit) to connect, share events, showcase work, and engage with local tech culture.
Key Pages: Landing, Portfolio, Merch, Say What Up Doe.
User Roles: Guest (unauthenticated), Member (authenticated), Admin.

2. User Roles & Permissions
Role	Permissions
Guest	View Landing, Portfolio, Merch; Submit messages via "Say What Up Doe".
Member	All Guest permissions + Post/edit/delete event meetups, comment on posts (280 chars max).
Admin	All Member permissions + Manage Portfolio content, moderate/delete user posts, view/respond to guest messages.
3. Page Specifications
3.1 Landing Page
Purpose: Introduce the site’s mission and attract users to explore.

Content:

Hero section: "Welcome to wuddevdet.com – Detroit’s Web Dev Hub."

Subheader: "Connect with Michigan developers, share events, and grow together."

Interactive map highlighting Southeast Michigan/Detroit focus.

Preview cards linking to Portfolio, Merch, and "Say What Up Doe".

Role-based CTAs:

Guest: "Join the Community → Sign Up."

Member/Admin: "Check the latest events → Say What Up Doe."

3.2 Portfolio Page
Purpose: Showcase Admin’s development projects.

Content:

Grid layout of projects with thumbnails, titles, short descriptions, tech stack, and links to prototypes.

Admin-Only Features: "Add Project" button, edit/delete icons on each project.

Guests/Members: View-only with social share buttons.

3.3 Merch Page
Purpose: Sell branded merchandise (T-shirts, hoodies).

Content:

Embedded Shopify store (print-on-demand).

No role restrictions – all users can browse/purchase.

3.4 Say What Up Doe Page
Purpose: Facilitate communication between users and Admins + event coordination.

Content:

Guest View: Simple contact form to message Admin (name, email, message).

Member View:

Message board with threads for events/meetups.

"Create Post" button (title, 280-char description, event date/location).

Comment section under each post (280-char limit).

Admin View:

Moderation tools: Delete posts/comments, pin important events.

Dashboard to view/respond to guest messages.

4. User Flows
4.1 Guest Flow
View Landing → Explore Portfolio/Merch → Submit message via "Say What Up Doe".

Sign Up: Email, password, location (Michigan-focused validation optional).

4.2 Member Flow
Log In → Access message board → Create/edit event posts + comment.

Edit Profile: Add bio, profile picture, social links.

4.3 Admin Flow
Log In → Manage Portfolio (add/edit projects).

Moderate "Say What Up Doe": Delete posts, respond to guest messages.

5. Technical Requirements
Authentication: OAuth 2.0 or JWT for secure login.

Database:

User data (role, profile info).

Portfolio projects (title, description, images, links).

Guest messages + message board posts/comments.

Third-Party Integrations: Shopify API (Merch), reCAPTCHA (contact form).

Security: HTTPS, input sanitization, role-based access control (RBAC).

6. MVP Priorities
Core Pages (Landing, Portfolio, Merch, Say What Up Doe).

User Authentication (Sign Up/Login).

Admin Dashboard (moderation tools, portfolio management).

Responsive Design (mobile-first).

7. Future Enhancements
Calendar view for events.

Member portfolios (expand beyond Admin).

Upvote/downvote system for posts.

Discord/Slack integration.

8. Mockups/Wireframes
Include low-fidelity sketches or Figma links showing:

Landing page layout with CTAs.

Portfolio grid vs. Admin edit view.

"Say What Up Doe" role-based interfaces.

API Endpoints Overview
Base URL: https://api.wuddevdet.com/v1
Authentication: JWT tokens (sent in Authorization: Bearer <token> header).

1. Authentication & User Management
Endpoint	Method	Description	Permissions	Request Body Example	Response Example
/auth/signup	POST	Register as a Member	Guest	{ email, password, name, location (MI-only) }	{ user: { id, email }, token }
/auth/login	POST	Log in (Member/Admin)	Guest	{ email, password }	{ user: { id, email, role }, token }
/auth/logout	POST	Log out	Member/Admin	—	{ message: "Logged out" }
/users/me	GET	Get current user profile	Member/Admin	—	{ id, email, role, name, bio, profile_pic }
/users/me	PUT	Update profile (bio, pic)	Member/Admin	{ bio, profile_pic }	Updated user object
2. Portfolio (Admin-Only)
Endpoint	Method	Description	Permissions	Request Body Example	Response Example
/projects	GET	List all projects	All	—	[{ id, title, description, tech_stack[], prototype_url, image }]
/projects	POST	Add a project	Admin	{ title, description, tech_stack[], prototype_url, image }	Created project object
/projects/{id}	PUT	Update a project	Admin	{ title, description, ... }	Updated project object
/projects/{id}	DELETE	Delete a project	Admin	—	204 No Content
3. Merch (Shopify Integration)
Note: If using Shopify’s Storefront API, embed their SDK/client-side components. For MVP, no custom backend endpoints needed unless displaying merch data via your API.

4. Say What Up Doe
4.1 Guest Messages
Endpoint	Method	Description	Permissions	Request Body Example	Response Example
/contact	POST	Submit a message to Admin	Guest	{ name, email, message }	201 Created
4.2 Message Board (Members + Admin)
Endpoint	Method	Description	Permissions	Request Body Example	Response Example
/posts	GET	List all event posts	All	—	[{ id, title, content (280c), event_date, location, author, comments[] }]
/posts	POST	Create an event post	Member/Admin	{ title, content (280c), event_date, location }	Created post object
/posts/{id}	PUT	Edit a post	Member (owner) or Admin	{ content, ... }	Updated post object
/posts/{id}	DELETE	Delete a post	Member (owner) or Admin	—	204 No Content
/posts/{id}/comments	POST	Add a comment	Member/Admin	{ content (280c) }	Created comment object
/comments/{id}	DELETE	Delete a comment	Member (owner) or Admin	—	204 No Content
5. Admin-Specific Endpoints
Endpoint	Method	Description	Permissions	Request Body Example	Response Example
/admin/contact-messages	GET	List guest messages	Admin	—	[{ id, name, email, message, timestamp }]
/admin/users	GET	List all users	Admin	—	[{ id, email, role, signup_date }]
/admin/users/{id}	DELETE	Delete a user	Admin	—	204 No Content
/admin/users/{id}/role	PUT	Update user role	Admin	{ role: "member" | "admin" }	Updated user object
6. Query Parameters & Pagination
Pagination: Append ?page=1&limit=10 to GET endpoints (e.g., /posts?page=1&limit=10).

Filtering: /posts?location=detroit&sort=newest.

7. Error Handling
Common Responses:

401 Unauthorized: Invalid/missing token.

403 Forbidden: User lacks permissions.

404 Not Found: Resource doesn’t exist.

400 Bad Request: Invalid input (e.g., >280 chars).

Example Error Response:

json
Copy
{  
  "error": "ValidationError",  
  "message": "Content exceeds 280 characters."  
}  
8. Database Schema Suggestions
Users
Copy
id | email | password_hash | role | name | location | profile_pic | created_at  
Projects
Copy
id | title | description | tech_stack[] | prototype_url | image | admin_id (FK) | created_at  
ContactMessages
Copy
id | name | email | message | created_at  
Posts
Copy
id | title | content | event_date | location | user_id (FK) | created_at  
Comments
Copy
id | content | post_id (FK) | user_id (FK) | created_at  
9. Example Request Flow
Member Creating a Post:

http
Copy
POST /posts  
Authorization: Bearer <MEMBER_TOKEN>  
Content-Type: application/json  

{  
  "title": "Detroit Dev Meetup",  
  "content": "Join us this Friday at 7 PM!",  
  "event_date": "2023-12-01",  
  "location": "Downtown Detroit"  
}  
Response:

json
Copy
{  
  "id": 123,  
  "title": "Detroit Dev Meetup",  
  "content": "Join us this Friday at 7 PM!",  
  "author": "user@email.com",  
  "created_at": "2023-11-25T12:34:56Z"  
}  