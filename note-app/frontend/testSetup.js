import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import '@testing-library/jest-dom/vitest'


// (This cleans up jsdom after each test so tests don't leak state into each other)
afterEach(()=>{
    cleanup()
})