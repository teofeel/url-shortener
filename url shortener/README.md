# DOCUMENTATION

## HOW TO RUN APPLICATION
1. Open Terminal
2. Find application files folder with terminal
3. Run node app
4. Wait until on console is written 'Server is running/n DB is working'
5. To test routing open browser and type http://localhost:8080/{route you want to test}

## CODE DOCUMENTATION

1. **POST /register** 
    => Option to register, checks if the user's email is alredy registered, if user is logged in, if input field is missing.
    => Input: Body: {username: String, email: String (email format), password: String, confirmPassword: String}
    => Output:  OK => {message : User registered}
                400 => {message : error message}
2. **POST /login**
    => Option to login , checks if password and email are matching, if email is in right format, etc.
    => Input: Body: {email: String, password: String}
    => Output:  OK => {message: User is loggedin}
                400 => {message: error message}

3. **POST /createNewURL**
    => Logged user can create new shortened URL for himself
    => Input: Body: {originalURL: URL format, shortURL: String}
    => Output:  200 => {message: New shortened url create}
                400 => {message: error message}

4. **GET /viewURLs**
    => Gives array of shortened and original URLs that logged user has created 
    => Output: {data : Object Array}

5. **GET http://localhost:8080/:shortURL**
    => Logged user can be redirected by typing his shortened URL with our URL prefix
    => Output: Open browser to original URL destination

6. **PUT /editURL**
    => Gives option to logged user to edit his stored URLs
    => Input: Body: {shortURL:String, field: 'shortURL' || 'originalURL', newValue: String || URL format}
    => Output:  200 => {message: URL field updated}
                400 => {message: error message}

7. **DELETE /deleteURL**
    => Logged user can delete his shortened URLs
    => Input: Body: {shortURL:String}
    => Output:  200 => {message: URL deleted}
                400 => {message: error message}

8. **DELETE /logout**
    => Deletes session of user 

