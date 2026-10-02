## Refrences Across Collection

* Goal :- user authentication and authorization to our application

* Reason :- Users should be stored in the database and every note should be linked to the user who created it. Deleting and editing a note should only be allowed for the user who created it.

* one-to-many relationship between the user (User) and notes (Note):

* if we were working with a relational database the implementation would be straightforward. Both resources would have their separate database tables, and the **id of the user who created a note** **would be stored** in the notes table as a **foreign key**.

* Traditionally document databases like Mongo do not support **join queries that are available in relational databases**, used for aggregating data from multiple tables. **However, starting from version 3.2. Mongo has supported lookup aggregation queries**. **We will not be taking a look at this functionality in this course**.

* Document databases also offer a radically different way of organizing the data: In some situations, it might be beneficial to nest the entire notes array as a part of the documents in the users collection:

```js
[
  {
    username: 'mluukkai',
    _id: 123456,
    notes: [
      {
        content: 'HTML is easy',
        important: false,
      },
      {
        content: 'The most important operations of HTTP protocol are GET and POST',
        important: true,
      },
    ],
  },
  {
    username: 'hellas',
    _id: 141414,
    notes: [
      {
        content:
          'A proper dinosaur codes with Java',
        important: false,
      },
    ],
  },
]
```

* In this schema, notes would be tightly nested under users and the **database would not generate ids for them**.
