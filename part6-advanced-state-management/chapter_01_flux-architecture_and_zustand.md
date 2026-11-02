# flux architecture

## Major Problem With React state (useState)
* We have followed React's recommended practice for managing application state by defining the state needed by multiple components and the functions that handle it in the top-level(opens in a new tab) components of the component hierarchy. Most of the state and the functions handling it have typically been defined directly in the root component and passed via props to the components that need them. This works up to a point, but as the application grows, state management becomes challenging.

## Solution : flux

* In Flux, the management of application state is separated entirely into external stores outside of React components.

* When an action is dispatched and it changes the store's state, the views are re-rendered:
    * **Action** -> **Dispatcher** -> **Store** -> **View**

* Flux thus provides a standard way for how and where the application state is kept and for making changes to it.

## understanding

* **With normal useState**:

    - State is trapped inside the component that declared it.

    - If a component 4 levels down or a sibling component in another file needs it, you are forced to prop-drill it all the way down.

* **With Zustand**:

    - The state and its updater functions live in a standalone JavaScript object outside React's DOM tree.

    - Any component in your entire project (Header, Footer, Sidebar, LoginModal) just imports useCounterStore and grabs whatever piece it wants.

    - Zero prop drilling. Zero <Provider> wrappers.

## Zustand-related functions are named starting with the word use.

* The reason for this is that the function returned by Zustand's create function, in our example useCounterStore, is a React custom hook(opens in a new tab) function. Our own helper functions useCounter and useCounterControls are also essentially custom hooks because they hide the use of the custom hook useCounterStore inside them

* Naming Tip: Notice the use prefix (like useCounterStore or useNoteStore). Because Zustand stores are literally React custom hooks, naming the file and the hook starting with use makes it immediately obvious to any React developer that it follows hook rules.

## The Two Unbreakable Rules

1. Rule 1: Only call hooks at the top level

    - NEVER call useCounterStore inside an if statement, inside a loop, or inside a click handler:

        ```js
        const App = () => {
        // ❌ ILLEGAL: Calling a hook inside a regular function / click handler!
        const handleClick = () => {
            const counter = useCounterStore(state => state.counter) 
        }

        // ✅ CORRECT: Always call it at the very top of your component!
        const counter = useCounterStore(state => state.counter)
        const increment = useCounterStore(state => state.increment)

        const handleClick = () => {
            increment()
        }

        return <button onClick={handleClick}>Click</button>
        }
        ```

---

2. Rule 2: Only call hooks from React function components or other custom hooks

    - You cannot call useCounterStore() inside a plain JavaScript file or regular helper function.

---


3. Bonus: What if you genuinely need state outside of React?

* (For example, inside an Axios interceptor or a standalone utility function?)

* Because Zustand is so flexible, it provides a special non-hook backdoor:

* javascript
    // This is NOT a hook, so you can call this anywhere in plain JS!
    const currentCount = useCounterStore.getState().counter

* As long as you are inside React components, stick to the top-level hook call: const counter = useCounterStore(state => state.counter).


## Custom hooks with more complex state

* The Fatal Infinite Loop 💥

    1. Because that selector returns a brand new { ... } object every single time:
    2. React renders the component.
    3. The selector runs and returns Object #1 ({ counter: 0, changes: 0 }).
    4. Zustand does its check: PreviousObject === Object #1?
    5. JavaScript says: false!
    6. Zustand thinks: "Alert! The state changed! Tell React to re-render!"
    7. React re-renders the component.
    8. The selector runs again and returns Object #2.
    9. Object #1 === Object #2? false!
    10. Zustand tells React to re-render again...
    11. 💥 Infinite Loop! Browser freezes / "Maximum update depth exceeded".

## Memory model of zustand to stop re-render with complex or multiple states.
* **Without useShallow** : Every time the selector runs, JavaScript creates a fresh object wrapper at a new memory address (0x001, 0x002, 0x003). Zustand does a reference check: 0x001 === 0x002 => false. Zustand assumes state changed and screams at React to re-render.

* **With useShallow** : useShallow tells Zustand: "Stop looking at the memory address of the outer wrapper object! Unpack the box and compare what's inside (0 === 0 and 0 === 0)." Since the inner values are identical, Zustand tells React: "Stand down, nothing actually changed."

* Now Zustand only triggers a re-render when counter or changes actually have a new value, not just when a new object is created.

## Stored State vs Derived State
* e.g unicafe app

### Stored State()
* const good = good(), const bad =  bad() and const neutral = neutral() which based almost user input

### Derived State() which is based on existing stated
* const all = good + bad + neutral
* const average = (good - bad)/all