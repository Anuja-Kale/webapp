## RESTful API REQUIREMENTS

> **Request/Response Payload:** All API request/response payloads should be in JSON.
>
> **UI:** No UI should be implemented for the application.
>
> **HTTP Status Codes:** As a user, I expect all API calls to return with a proper HTTP status code.
>
> **Code Quality:** As a user, I expect the code quality of the application to be maintained to the highest standards using the unit and/or integration tests.

## BOOTSTRAPPING DATABASE

> **Bootstrapping:** The application is expected to automatically bootstrap the database at startup. Bootstrapping involves the creation or updating of the schema, tables, indexes, sequences, etc.
>
> **SQL Restrictions:** Manual SQL script setup for the database is not allowed.
>
> **Recommended ORM Frameworks:** Hibernate (for Java), SQLAlchemy (for Python), Sequelize (for Node.js).

## USERS & USER ACCOUNTS

> **Data Source:** The application will bootstrap account data from a well-known CSV location: `/opt/user.csv`.
>
> **Startup Behavior:** At startup, user data should be read from the CSV and used to create accounts. If a user account already exists, no action is required. New accounts should be created if they do not exist. Deletion of user accounts is not supported.
>
> **Passwords:** Passwords must be hashed using BCrypt before being stored in the database. Passwords should never be stored in plain text.
>
> **Fields `account_created` and `account_updated`:** Users cannot set or modify these fields. Any input values for these fields will be ignored. Both fields should have the same value (as no updates/deletions are allowed).

## AUTHENTICATION REQUIREMENTS

> **Authentication Method:** The web application should only support Token-Based authentication. Session Authentication is not supported. Every API call to authenticated endpoints requires a basic authentication token.

## WEB APPLICATION DEMO

> **Account Verification:** Ensure user accounts are created in the database. Verify that `account_created` and `account_updated` values are set up correctly.
>
> **Password Storage:** Validate that passwords are stored as BCrypt hashes and not in plain text.
>
> **Demo Tool Recommendation:** You can demonstrate API calls using tools like Postman or any other REST client.

## API TESTING

> **Create Assignment:** Can only be performed by authenticated users. Unauthorized requests should return a 401 status code.
>
> **Update Assignment:** Only the user who created the assignment can update it. Others should receive a 403 status code.
>
> **Delete Assignment:** Only the user who created the assignment can delete it. Others should receive a 403 status code.
>
> **PATCH HTTP Method:** Should return a 405 status code for updating assignments.
