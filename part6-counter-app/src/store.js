import { create } from "zustand";
import { useShallow } from "zustand/react/shallow"

const useCounterStore = create(set => ({
    counter: 0,
    changes: 0,
    actions: {
        increment: () => set(state => ({
            counter: state.counter + 1,
            changes: state.changes + 1
        })),
        decrement: () => set(state => ({
            counter: state.counter - 1,
            changes: state.changes + 1

        })),
        zero: () => set(state => ({
            counter: 0,
            changes: state.changes + 1

        }))

    }
}))


// it is not advisable to export the function defining the entire state for use throughout the application. Instead, smaller views that expose only the necessary parts of the state should be created from it
// export const useCounterStore XXX

// the hook functions that are used elsewhere in app
export const useCounter = () => useCounterStore(state => state.counter)
export const useCounterControls = () => useCounterStore(state => state.actions)
export const useValues = () => useCounterStore(() => {
    useShallow((state) => ({
        counter: state.counter,
        changes: state.changes,
    }))
})