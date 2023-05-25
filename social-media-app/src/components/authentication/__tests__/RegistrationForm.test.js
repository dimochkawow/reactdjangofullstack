import { render, screen, waitFor } from '../../../helpers/test-utils'
import userEvent from '@testing-library/user-event'
import RegistrationForm from '../RegistrationForm'
import { faker } from '@faker-js/faker'
import userFixtures from '../../../helpers/fixtures/user'

const userData = userFixtures()

test('renders Registratino form', async () => {
    const user = userEvent.setup()

    render(<RegistrationForm />)

    await waitFor(async () => {
        const registrationForm = screen.getByTestId('registration-form')
        expect(registrationForm).toBeInTheDocument()

        const firstNameField = screen.getByTestId('first-name-field')
        expect(firstNameField).toBeInTheDocument()

        const lastNameField = screen.getByTestId('last-name-field')
        expect(lastNameField).toBeInTheDocument()

        const bioField = screen.getByTestId('bio-field')
        expect(bioField).toBeInTheDocument()

        const usernameField = screen.getByTestId('username-field')
        expect(usernameField).toBeInTheDocument()

        const passwordField = screen.getByTestId('password-field')
        expect(passwordField).toBeInTheDocument()

        const password = faker.lorem.slug(2)

        await user.type(firstNameField, userData.first_name)
        await user.type(lastNameField, userData.last_name)
        await user.type(bioField, userData.bio)
        await user.type(usernameField, userData.username)
        await user.type(passwordField, password)

        expect(firstNameField.value).toBe(userData.first_name)
        expect(lastNameField.value).toBe(userData.last_name)
        expect(bioField.value).toBe(userData.bio)
        expect(usernameField.value).toBe(userData.username)
        expect(passwordField.value).toBe(password)
    })
})
