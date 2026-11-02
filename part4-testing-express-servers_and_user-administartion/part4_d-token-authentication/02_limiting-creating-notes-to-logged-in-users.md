# Limiting creating new notes to logged-in users

## 1. Let's change creating new notes so that it is only possible if the post request has a valid token attached. The note is then saved to the notes list of the user identified by the token.

* There are several ways of sending the token from the browser to the server. **We will use the Authorization header**. The header also tells which **authentication scheme is used**.

* This can be necessary if the server offers multiple ways to authenticate. Identifying the scheme tells the server how the attached credentials should be interpreted.

### The Bearer scheme is suitable for our needs.

* In practice, this means that if the token is, for example, the string **eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW**, the Authorization header will have the value:

- Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW


* chnages in notesRouter

