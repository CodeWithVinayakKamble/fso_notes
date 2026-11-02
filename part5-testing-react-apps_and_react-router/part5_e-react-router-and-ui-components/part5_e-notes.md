# React Router

## The One Catch with **useMatch**: The Router Context Rule
* You can ONLY call router hooks (like useMatch or useNavigate) inside a component that is already wrapped by a <Router>.

## so we have to wrap our App into Router
```js
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
``

* Expected error if not used 
```bash
Error: useMatch() may be used only in the context of a <Router> component.
```


## Part 1: What useMatch('/notes/:id') does

* useMatch acts like a **radar scanner for the browser address bar**.

* Every time the URL changes, it asks:
  ### "Does the current browser URL look like /notes/<something>?"
  * http://localhost:5173/notes/652f1b8a: useMatch returns a Match Object

* There are only two possible outcomes:
  - matched returned params.id
  - if not matched return null



