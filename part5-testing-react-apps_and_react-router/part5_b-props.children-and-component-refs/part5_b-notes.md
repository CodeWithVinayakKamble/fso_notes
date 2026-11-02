# props.children and component refs

---

## Chunk 1: `<LoginForm />` vs `<LoginForm></LoginForm>`

* `<LoginForm />` is just shorthand for `<LoginForm> </LoginForm>` when there is nothing in the middle.

---

## Chunk 2: What happens if you put something in the middle of 
`<LoginForm> ... </LoginForm>?`

```jsx
<LoginForm>
  <h1>Secret Message</h1>
</LoginForm>
```

* Will `<h1>Secret Message</h1>` show up on your screen? NO. It will not show up at all.

### Why ?

* React takes `<h1>Secret Message</h1>` and puts it inside props.children.

* React sends **props.children** to LoginForm.jsx.

* **Wait**: Look inside your LoginForm.jsx file — did you write **{props.children}** anywhere inside LoginForm.jsx? No! So LoginForm ignores it and throws 
`<h1>Secret Message</h1> `away.

---

## Chunk 3: How do you make the middle stuff show up?

```jsx
const Box = (props) => {
  return (
    <div style={{ border: '2px solid red' }}>
      {props.children}
    </div>
  )
}
```

* Because Box wrote **{props.children}** inside its <div>, whatever you put in the middle of `<Box> ... </Box>` in App.jsx gets pasted right where {props.children} is!

```jsx
<Box>
  <h1>Hello</h1>
</Box>
```

* {props.children} becomes `<h1>Hello</h1>` inside a red border.

* If you write in App.jsx:

```jsx
<Box>
  <LoginForm />
</Box>
```

* **{props.children}** becomes `<LoginForm />` inside a red border.
---

## In React, that exact pattern is literally called **Component Composition** — passing one component inside another component, just like passing a function into another function (Box(LoginForm)).

---

## lifting state up
* Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props. This is known as **lifting state up**

### Passing data from Child → Parent trips up almost everyone learning React at first, because React props only flow downwards (Parent → Child).

* To send data back up **(Child → Parent)**, you always use that exact 2-step callback trick:
 
  * Parent (App) passes a function down as a prop **(createNote={addNote})**.

  * Child (NoteForm) calls that function and puts the data inside the parentheses 
  **(createNote({ content: newNote, ... }))**.

---

## useRef hook

* The **`useRef hook`** is used to create a **noteFormRef** reference, that is assigned to the Togglable component containing the creation note form. 

* The noteFormRef variable acts as a reference to the component. This hook ensures that the same reference (ref) is kept throughout re-renders of the component.

### The component uses the useImperativeHandle hook to make its toggleVisibility function available outside of the component.

* We can now hide the form by calling noteFormRef.current.toggleVisibility() after a new note has been created:

  - we have call the **noteFormRef.current.toggleVisibility()** this refrence function into function of addnote

* To recap, the useImperativeHandle function is a React hook, that is used for defining functions in a component, which can be invoked from outside of the component.

* Togglable already has its own internal function:
  
```js
const toggleVisibility = () => setVisible(!visible)
```
  
* By default, that function is locked inside Togglable.

* useImperativeHandle simply makes a copy of that function available to the outside world:

* **The Problem**: visible state lives inside Togglable. Normally, React data only flows downwards. App.jsx has no way to reach inside Togglable and flip visible back to false!

* **The Solution** (useImperativeHandle + useRef): Think of ref like giving App.jsx a remote control to Togglable:

* useImperativeHandle inside Togglable says: "Hey React, expose this one function (toggleVisibility) on my remote control."

* useRef in App.jsx holds that remote control: const noteFormRef = useRef().

* Now, right after App.jsx finishes saving the note, App.jsx can press the remote button from outside: