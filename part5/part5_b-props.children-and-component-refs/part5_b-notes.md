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