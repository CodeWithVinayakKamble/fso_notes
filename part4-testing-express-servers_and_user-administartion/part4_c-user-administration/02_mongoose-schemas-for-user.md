## Mongoose Schema for creatinga and storing new user first

* Let's define the model for representing a user in the **models/user.js file**


* The ids of the notes are stored within the user document as an array of Mongo ids. The definition is as follows:
```js
{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Note'
}
```

- The field **type** is **ObjectId**, meaning it refers to another document

- The **ref** field specifies the **name of the model being referenced** 'Note'

