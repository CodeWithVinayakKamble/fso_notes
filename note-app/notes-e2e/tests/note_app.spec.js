const { test, expect, describe, beforeEach } = require('@playwright/test')
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {

    beforeEach(async ({ page, request }) => {

        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'vinayak kamble',
                username: 'vinayak',
                password: 'test@#123'
            }
        })

        await page.goto('/')
    })

    test('front page can be opened', async ({ page }) => {

        const locator = page.getByText('Notes')
        await expect(locator).toBeVisible()
        await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2026')).toBeVisible()
    })

    test('user can login with correct credentials', async ({ page }) => {

        await loginWith(page, 'vinayak', 'test@#123')
        await expect(page.getByText('vinayak kamble logged in')).toBeVisible()
    })

    test('login fails with wrong credentials', async ({ page }) => {

        await loginWith(page, 'vinayak', 'wrong_password')
        await expect(page.getByText('Invalid username or password')).toBeVisible()
    })

    // ============================================
    // Nested group: Tests that require a logged-in user to crete note
    // ============================================

    describe('when user logged in', () => {

        beforeEach(async ({ page }) => {
            await loginWith(page, 'vinayak', 'test@#123')
        })

        test('a note can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'new note' }).click()
            await page.getByRole('textbox').fill('a new note created by playwright')
            await page.getByRole('button', { name: 'save' }).click()
            await expect(page.getByRole('listitem').filter({ hasText: 'a new note created by playwright' })).toBeVisible()
        })

        // ============================================
        // Nested group: for testing toggleimportance
        // ============================================
        describe('and a note exists', () => {

            beforeEach(async ({ page, request }) => {
                await createNote(request, 'first note', true)
                await page.reload()
            })

            test('importance can be changed', async ({ page }) => {
                await page.getByRole('button', { name: 'make not important' }).click()
                await expect(page.getByText('make important')).toBeVisible()
            })

        })
    })

})
