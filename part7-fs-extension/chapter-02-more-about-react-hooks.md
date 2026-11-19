# more about react hooks

## rules :
1. Don’t call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function.
2. never forget rule no 1.

### You can only call Hooks while React is rendering a function component:
* Call them at the top level in the body of a function component.
* Call them at the top level in the body of a custom Hook.


## useMemo


* useMemo - stops re-render within components if componets has two state like theme and filter , filteration required heavy computation power and re-render occcur by theme state and that action responciable to recalculate computation but result same so useMemo comes in the game,its cache its result alredy from very first render if only specif state chnages and result is not equal to its previous state only re-render occur in preview list.

* **useMemo caches the result of a calculation inside a component**

#### useMemo — Caches a Calculated Value
The Problem: You have heavy math or an expensive filter/sort on a large array.
The Rule: "Don't recalculate this value unless its dependencies change."
Example:
```javascript
// Only re-filters if `searchTerm` or `bigList` changes, NOT on every unrelated keystroke/render
const filteredList = useMemo(() => {
  return bigList.filter(item => item.name.includes(searchTerm))
}, [searchTerm, bigList])
```
---

## React.memo 

* React.memo pairs naturally with **useMemo** that prevents expensive calculations from re-running, while React.memo prevents the component itself from re-rendering.

* React.memo -  React.memo takes a different angle: it caches the rendered output of an entire component, React.memo is not a hook but a higher-order component,When a component is wrapped in React.memo, React skips re-rendering it if its props have not changed since the last render.

### React.memo — The Component Bouncer

The Problem: In React, when a Parent re-renders, all Children re-render by default, even if their props didn't change!

**The Rule: "Compare incoming props with previous props. If props are strictly equal (prevProps === nextProps), skip re-rendering this child."**

Example:
```javascript
const HeavyList = React.memo(({ items }) => {
  return <ul>...</ul>
})
```

---

## useCallback
* prevents a function getting re-render if component is re-rendering and that function is prop to other component or any child component it forcess to that component to re-render beacoz only parent app got re-render it bad so "useCallback" comes in play to prevent 

### The JavaScript Reference Trap & useCallback

```javascript
const a = () => {}
const b = () => {}
console.log(a === b) // ❌ FALSE! Two different spots in computer memory.
```

* When a Parent component re-renders:

    - Every function defined inside the parent is re-created brand new in memory.
    - If you pass const handleClick = () => ... to <HeavyList onClick={handleClick} />:
    - React.memo checks: prevProps.onClick === nextProps.onClick.
    - It says: "Wait, this is a new memory address! The prop changed!"
    - React.memo fails and the child re-renders anyway.

### Enter useCallback:
```javascript
// Locks the function to the EXACT SAME memory address across renders
const handleClick = useCallback(() => {
  doSomething()
}, [])
```

* Now, prevProps.onClick === nextProps.onClick is TRUE! React.memo successfully skips the child's re-render!

---

## Custom hooks: 

* **Building your own Hooks lets you extract component logic into reusable functions.**

* Custom hooks are regular JavaScript functions that can use any other hooks, as long as they adhere to the rules of hooks(opens in a new tab). Additionally, the name of custom hooks must start with the word use.