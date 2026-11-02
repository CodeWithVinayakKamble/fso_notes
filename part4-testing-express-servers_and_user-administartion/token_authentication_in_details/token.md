# Token authentication and authorization 

---

## Step 0: The Core Problem — HTTP Has Amnesia

* HTTP is a stateless protocol. When a browser makes a request, the server answers it, and immediately forgets who the client was.

* If you make 10 requests to create 10 blogs, the server doesn't remember you from request #1 to request #2.

    * Option A (Terrible): Ask the user to send their raw password with every single HTTP request. (Huge security risk; passwords traveling constantly over the wire).

    * Option B (The Modern Standard - JWT): The user provides their password once at login. The server gives them a signed VIP Badge (Token). From then on, the client just flashes that badge with every request.

---

## Phase 1: Registration (POST /api/users)

* Before anyone can log in, they must exist in the database.

```
[ Client ]  ── { username: "vinayak", password: "mypassword123" } ──▶  [ Server ]
                                                                             │
                                                                   1. Validate lengths (>= 3)
                                                                   2. bcrypt.hash(password, 10)
                                                                   3. Save { username, passwordHash }
                                                                             │
                                                                      [ MongoDB Atlas ]
```

* We never save the raw password.

* We save a one-way mathematical fingerprint (passwordHash).

* Even if hackers dump our database, they cannot reverse the hash back into "mypassword123".

---

## Phase 2: Login & Issuing the Token (POST /api/login)

* This is where the user exchanges credentials for a token.

```
[ Client ] ── POST /api/login { username, password } ─────────────▶ [ Server ]
                                                                        │
                                                              1. Find user in Mongo
                                                              2. bcrypt.compare(rawPass, hash)
                                                                        │
                                                     Does password match?
                                                     ├── NO  ──▶ return 401 "Invalid username or password"
                                                     └── YES ──▶ Create Token!
                                                                        │
                                                              jwt.sign(payload, SECRET)
                                                                        │
[ Client ] ◀── 200 OK { token: "eyJhbGciOi...", username, name } ───────┘
```

### What actually is the Token?

* It's an encrypted-looking string divided into 3 parts separated by dots (.): Header.Payload.Signature

    1. **Payload:** The data we packed inside: { username: "vinayak", id: "65a..." }. (Base64 encoded, not encrypted!).

    2. **Signature**: The secret sauce. The server takes (Header + Payload) and signs it with our private SECRET.

        * If anyone tries to change id to someone else's ID, the signature becomes invalid!

---

## Phase 3: The Authorized Action (POST /api/blogs)

* Now the user wants to create a blog. They don't send their password. They attach their token in the HTTP Headers.

```
HTTP Request Headers:
Authorization: Bearer eyJhbGciOi...
Body: { title: "React Hooks", url: "https://react.dev" }
```

### Here is what your backend does step-by-step:
```
1. Extract Token:
   getTokenFrom(request) ➡️ strips "Bearer " and leaves raw token string.

2. Guard against missing token:
   if (!token) ➡️ return 401 "Token Missing"

3. Verify Signature:
   jwt.verify(token, SECRET)
   ├── Signature forged or expired? ──▶ throws JsonWebTokenError ──▶ 401 Unauthorized
   └── Valid! ──▶ Returns decoded payload: { username: "vinayak", id: "65a..." }

4. Find the User:
   User.findById(decodedToken.id) ➡️ Loads the user document from MongoDB.

5. Two-Way Linking:
   newBlog.user = user._id
   savedBlog = await newBlog.save()
   user.blogs = user.blogs.concat(savedBlog._id)
   await user.save()

6. Respond:
   return 201 Created with savedBlog!
```

