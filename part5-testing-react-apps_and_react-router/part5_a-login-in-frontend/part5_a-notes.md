## the browser's local storage

* This problem is easily solved by saving the login details to local storage. Local Storage is a key-value database in the browser.

* It is very easy to use. A value corresponding to a certain key is saved to the database with the method setItem. For example:

    ```js
    window.localStorage.setItem('name', 'juha tauriainen')
    ```
    * saves the string given as the second parameter as the value of the key name.

* The value of a key can be found with the method getItem:

    ```js
    window.localStorage.getItem('name')
    ```

* while removeItem removes a key.

* windows.localStorage.clear() clears all db entries

* Values in the local storage are persisted even when the page is re-rendered. **The storage is origin-specific so each web application has its own storage**.

* Values saved to the storage are DOMstrings,so we **cannot save a JavaScript object as it is**. The object has to be **parsed** to JSON first, with the method **JSON.stringify**.

* Correspondingly, when a JSON object is read from the local storage, it has to be parsed back to JavaScript with JSON.parse.


