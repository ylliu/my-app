import React from "react";
import { render, fireEvent } from '@testing-library/react';
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
    let usernameInput, passwordInput, button;

    const setupForSubmit = (props) => {
        const rendered = render(<LoginPage {...props} />);
        const { container, queryByPlaceholderText } = rendered;

        usernameInput = queryByPlaceholderText('Your username');
        fireEvent.change(usernameInput, changeEvent('my-user-name'));
        passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        button = container.querySelector('button');
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
        fireEvent.change(usernameInput,changeEvent(''))
        expect(button).not.toBeDisabled();
    });

})

