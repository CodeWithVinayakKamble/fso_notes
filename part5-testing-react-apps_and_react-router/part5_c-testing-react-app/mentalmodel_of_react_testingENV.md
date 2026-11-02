# The 3-Step Mental Model of Every Component Test

```js
// Step 1: Put the component on the virtual screen (like a browser)
render(<Note note={note} />)

// Step 2: Look at the screen like a human
const element = screen.getByText('Component testing is done with react-testing-library', { exact: false })

// Step 3: Assert that you saw it
expect(element).toBeDefined()
```

---

1. **render(...)** = **Mounts the component into fake browser memory** **`(jsdom)`**.

2. **screen** = Represents the virtual screen. screen.getByText(...) searches the screen for that text just like human eyes would.

3. **expect(...)** = Checks that the element actually exists.