import React from "react";
import {
    render,
    fireEvent,
    waitForElementToBeRemoved,
    waitFor
} from '@testing-library/react';
import { UserSignupPage } from './UserSignupPage';

describe('UserSignupPage', () => {
    describe('Layout', () => {
        it('has header of Sign up', () => {
            const { container } = render(<UserSignupPage />)
            const header = container.querySelector('h1');
            expect(header).toHaveTextContent('Sign Up');
        });

        it('has input for dispaly name', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const dispalyNameInput = queryByPlaceholderText('Your display name');
            expect(dispalyNameInput).toBeInTheDocument();
        });

        it('has input for username', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const usernameInput = queryByPlaceholderText('Your username');
            expect(usernameInput).toBeInTheDocument();
        });

        it('has input for password', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput).toBeInTheDocument();
        });
        it('has password type for password input', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            expect(passwordInput.type).toBe('password');

        });

        it('has input for password repeat', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordRepeat = queryByPlaceholderText('Repeat your password');
            expect(passwordRepeat).toBeInTheDocument();
        });
        it('has password type for password repeat input', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordRepeat = queryByPlaceholderText('Repeat your password');
            expect(passwordRepeat.type).toBe('password');
        });

        it('has submit button', () => {
            const { container } = render(<UserSignupPage />);
            const button = container.querySelector('button');
            expect(button).toBeInTheDocument();
        });
    });

    describe('Interaction', () => {
        const changeEvent = (content) => {
            return {
                target: {
                    value: content
                }
            };
        };

        const mockAsyncDelayed = () => {
            return jest.fn().mockImplementation(() => {
                return new Promise((resolve, rejecet) => {
                    setTimeout(() => {
                        resolve({});
                    }, 300)
                })
            })
        }

        let button, dispalyNameInput, usernameInput, passwordInput, passwordRepeat;

        const setupForSubmit = (props) => {
            const rendered = render(
                <UserSignupPage {...props} />
            );

            const { container, queryByPlaceholderText } = rendered;

            dispalyNameInput = queryByPlaceholderText('Your display name');
            usernameInput = queryByPlaceholderText('Your username');
            passwordInput = queryByPlaceholderText('Your password');
            passwordRepeat = queryByPlaceholderText('Repeat your password');


            fireEvent.change(dispalyNameInput, changeEvent('my-display-name'));
            fireEvent.change(usernameInput, changeEvent('my-user-name'));
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            fireEvent.change(passwordRepeat, changeEvent('P4ssword'));

            button = container.querySelector('button');
            return rendered;
        }

        it('sets the displayName value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const dispalyNameInput = queryByPlaceholderText('Your display name');
            fireEvent.change(dispalyNameInput, changeEvent('my-display-name'));
            expect(dispalyNameInput).toHaveValue('my-display-name');
        });

        it('sets the userName value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const usernameInput = queryByPlaceholderText('Your username');
            fireEvent.change(usernameInput, changeEvent('my-username'));
            expect(usernameInput).toHaveValue('my-username');
        });
        it('sets the password value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordInput = queryByPlaceholderText('Your password');
            fireEvent.change(passwordInput, changeEvent('P4ssword'));
            expect(passwordInput).toHaveValue('P4ssword');
        });
        it('sets the password repeat value into state', () => {
            const { queryByPlaceholderText } = render(<UserSignupPage />);
            const passwordRepeat = queryByPlaceholderText('Repeat your password');
            fireEvent.change(passwordRepeat, changeEvent('P4ssword'));
            expect(passwordRepeat).toHaveValue('P4ssword');
        });

        it('calls postSignup when the fields are valid and the actions are provided in props', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            };

            setupForSubmit({ actions });

            fireEvent.click(button);
            expect(actions.postSignup).toHaveBeenCalledTimes(1);
        });

        it('does not throw exception when clicking the button when actions not provided in the props', () => {

            const { container, queryByPlaceholderText } = setupForSubmit();
            expect(() => fireEvent.click(button)).not.toThrow();
        });

        it('calls post with user body when the fields are valid', () => {
            const actions = {
                postSignup: jest.fn().mockResolvedValueOnce({})
            };

            setupForSubmit({ actions });

            fireEvent.click(button);
            const expectedUserObject = {
                username: 'my-user-name',
                displayName: 'my-display-name',
                password: 'P4ssword'
            }

            expect(actions.postSignup).toBeCalledWith(expectedUserObject);
        });

        it('does not allow user to click the sign up button when there is an ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayed()
            };

            setupForSubmit({ actions });
            fireEvent.click(button);

            fireEvent.click(button);
            expect(actions.postSignup).toHaveBeenCalledTimes(1);
        });

        it('displays spinner when there is an ongoing api call', () => {
            const actions = {
                postSignup: mockAsyncDelayed()
            };

            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);

            const spinner = queryByText('Loading...');
            expect(spinner).toBeInTheDocument();
        });

        it('hides spinner after api finishes successfully', async () => {
            const actions = {
                postSignup: mockAsyncDelayed()
            };

            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);

            await waitForElementToBeRemoved(() => queryByText('Loading...'))

            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        });

        it('hides spinner after api finishes with error', async () => {
            const actions = {
                postSignup: jest.fn().mockImplementation(() => {
                    return new Promise((resolve, rejecet) => {
                        setTimeout(() => {
                            rejecet({
                                response: { data: {} }
                            });
                        }, 300);
                    });
                })
            };

            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);

            await waitForElementToBeRemoved(() => queryByText('Loading...'))

            const spinner = queryByText('Loading...');
            expect(spinner).not.toBeInTheDocument();
        });

        it('displays validation error for displayName when error is received for the for field', async () => {
            const actions = {
                postSignup: jest.fn().mockRejectedValue({
                    response: {
                        data: {
                            validationErrors: {
                                displayName: 'Cannot be null'
                            }
                        }
                    }
                })
            }
            const { queryByText } = setupForSubmit({ actions });
            fireEvent.click(button);

            await waitFor(() => {
                expect(queryByText('Cannot be null')).toBeInTheDocument();
            });
        })
    })
})

console.error = () => { };