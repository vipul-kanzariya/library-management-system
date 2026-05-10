# library-management-system
    This is a library management API Bankend for the management of users and the books

# Route and the EndPoints

## /users
GET: Get the list of users in the system
POST: Create a new user

## /users{id}
GET: Get the user by id
PUT: Updating a user by their id
DELETE: Deleting user by their id (Checked if the user still has an issued book) && (is there any fine/panelty to be colleted)

## /user/subscription-dtails/{id}
GET: Get user subcription details by their id
    >>Date of subcription 
    >>Valid till ?
    >>Fine if any ?

## /books
GET: get all the books in the system
POST: Add a new book to the ststem

## /books{id}
GET: Get a book by its id
PUT: Update a book by its id
DELETE: Delete a book by ist id

## /books/issued
GET: Get all the issued books

## /books/isuued/withFine
GET: Get all the issued books with their fine amount

## Subscription Types
    >>Basic (3 months)
    >>Standard (6 months)
    >>Premium (12 months)

>> if a user missed the renewal date, then user should be collected with $100
>> if a user missed his subscription, the user expected to pay $100
>> if a user misses both the renewal and subscription then the collected amount should be $200

## Commands:
npm init
npm i express
npm i nodemon --save-dev

npm run dev

To restore node module and package-lock.json --> npm i/npm install