<H1>Salary Hero Backend Code Challenge.</H1>

<H3>Environment setup<H3>

1. Create a new database.
2. Run the sql files in sql folder by the order of the file name.
3. create .env file. Example is avaialbe in .env.example
4. SUPER_USER_USERNAME and SUPER_USER_PASSWORD are the configuration of Salary Hero Admin


<H3>Start service<H3>

1. Run the command `npm install` to install the dependencies.
2. Run the command `npm start` to start the server.

<H3>Swagger API<H3>

1. http://localhost:8080/api-docs/

<H3>Assumption<H3>

1. No unit test.
2. Password is stored in the database as plain text for simplicity purpose. For the actual production we can use bcrypt for storing data and validation.
3. Company id must be presented in the request for Employees and Money transfer endpoint. See postman collection.
4. Authroization method is Basic Auth.
See postman collection.
5. Logging: For simplicity purpose, console.log is used. For actual production code, a library such as winston can be used.
6. Columns in the table only included the necessary information for the code challenge.
7. The code is not a production-quality code. It can be improved and refactored.
8. Get all employees and get all employees apis by company are not included.
9. Get all company api is not included.
10. Employee's username is unique within a company.
11. Client admins are also employees of a company.
12. Only Super user can create a client admin ina company. Super user cannot create a new employee in a company.
13. Only Client admin can create new employees with in a company.