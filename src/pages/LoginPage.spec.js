import React from "react";
import { render, fireEvent, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
    it('has header of login', () => {
        const { container } = render(<LoginPage />);
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Login');
    });

    it('has input for username', () => {
        const { queryByPlaceholderText } = render(<LoginPage />);
        const usernameInput = queryByPlaceholderText('Your username');
        expect(usernameInput).toBeInTheDocument();

    });

    it('has input for password', () => {
        const { queryByPlaceholderText } = render(<LoginPage />);
        const passwordInput = queryByPlaceholderText('Your password');
        expect(passwordInput).toBeInTheDocument();
    });

    it('has password type for password input', () => {
        const { queryByPlaceholderText } = render(<LoginPage />);
        const passwordInput = queryByPlaceholderText('Your password');
        expect(passwordInput.type).toBe('password');
    });

    it('has login button', () => {
        const { container } = render(<LoginPage />);
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
    };
    let usernameInput, passwordInput, button;

    const setupForSubmit = (props) => {
        const rendered = render(<LoginPage {...props} />);
        const { container, queryByPlaceholderText } = rendered;

        usernameInput = queryByPlaceholderText('Your username');
        fireEvent.change(usernameInput, changeEvent('my-user-name'));
        passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        button = container.querySelector('button');
        return rendered;
    }
    it('sets the username value into state', () => {
        const { queryByPlaceholderText } = render(<LoginPage />);
        const usernameInput = queryByPlaceholderText('Your username');
        fireEvent.change(usernameInput, changeEvent('my-user-name'));
        expect(usernameInput).toHaveValue('my-user-name');
    });

    it('sets the password value into state', () => {
        const { queryByPlaceholderText } = render(<LoginPage />);
        const passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        expect(passwordInput).toHaveValue('P4ssword');
    });

    it('calls postLogin when the actions are provided in props and input fields have value', () => {
        const actions = {
            postLogin: jest.fn().mockResolvedValue({})
        }

        setupForSubmit({ actions });
        fireEvent.click(button);
        expect(actions.postLogin).toHaveBeenCalledTimes(1);
    });
    it('does not throw exception when clicking the button when actions not provided in props', () => {
        setupForSubmit();
        expect(() => fireEvent.click(button)).not.toThrow();
    });

    it('calls postLogin with credentials in body', () => {
        const actions = {
            postLogin: jest.fn().mockResolvedValue({})
        }
        setupForSubmit({ actions });
        fireEvent.click(button);
        const expectedUserObject = {
            username: 'my-user-name',
            password: 'P4ssword'
        };

        expect(actions.postLogin).toHaveBeenCalledWith(expectedUserObject);
    });

    it('enables the button when username and password is not empty', () => {
        setupForSubmit();
        expect(button).not.toBeDisabled();
    });
    it('disables the button when username is not empty', () => {
        setupForSubmit();
        fireEvent.change(usernameInput, changeEvent(''));
        expect(button).toBeDisabled();
    });

    it('disables the button when password is not empty', () => {
        setupForSubmit();
        fireEvent.change(passwordInput, changeEvent(''));
        expect(button).toBeDisabled();
    });

    it('displays alert when login fails', async () => {
        const actions = {
            postLogin: jest.fn().mockRejectedValue({
                response: {
                    data: {
                        message: 'Login failed'
                    }
                }
            })
        };
        const { queryByText } = setupForSubmit({ actions });
        fireEvent.click(button);
        await waitFor(() => {
            expect(queryByText('Login failed')).toBeInTheDocument();
        });
    });
    it('clears alert when user changes username', async () => {
        const actions = {
            postLogin: jest.fn().mockRejectedValue({
                response: {
                    data: {
                        message: 'Login failed'
                    }
                }
            })
        };
        const { queryByText } = setupForSubmit({ actions });
        fireEvent.click(button);
        await waitFor(() => {
            queryByText('Login failed');
        });

        fireEvent.change(usernameInput, changeEvent('updated-username'));
        alert = queryByText('Login failed');
        expect(alert).not.toBeInTheDocument();
    });

    it('clears alert when user changes password', async () => {
        const actions = {
            postLogin: jest.fn().mockRejectedValue({
                response: {
                    data: {
                        message: 'Login failed'
                    }
                }
            })
        };
        const { queryByText } = setupForSubmit({ actions });
        fireEvent.click(button);
        await waitFor(() => {
            queryByText('Login failed');
        });

        fireEvent.change(passwordInput, changeEvent('updated-P4ssword'));
        alert = queryByText('Login failed');
        expect(alert).not.toBeInTheDocument();
    });

    it('does not allow user to click the login button when there is an ongoing api call', () => {
        const actions = {
            postLogin: mockAsyncDelayed()
        };

        setupForSubmit({ actions });
        fireEvent.click(button);

        fireEvent.click(button);
        expect(actions.postLogin).toHaveBeenCalledTimes(1);
    });

    it('displays spinner when there is an ongoing api call', () => {
        const actions = {
            postLogin: mockAsyncDelayed()
        };

        const { queryByText } = setupForSubmit({ actions });
        fireEvent.click(button);

        const spinner = queryByText('Loading...');
        expect(spinner).toBeInTheDocument();
    });
    it('hides spinner after api finishes successfully', async () => {
        const actions = {
            postLogin: mockAsyncDelayed()
        };

        const { queryByText } = setupForSubmit({ actions });
        fireEvent.click(button);

        await waitForElementToBeRemoved(() => queryByText('Loading...'))

        const spinner = queryByText('Loading...');
        expect(spinner).not.toBeInTheDocument();
    });
    it('hides spinner after api finishes with error', async () => {
        const actions = {
            postLogin: jest.fn().mockImplementation(() => {
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

})

console.error = () => { };

