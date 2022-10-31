import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import authReducer from '../redux/authReducer';
import axios from "axios";
import App from './App';


const setup = (path) => {
    const store = createStore(authReducer);
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[path]}>
                <App />
            </MemoryRouter>
        </Provider>
    )
}

describe('App', () => {
    it('displays homepage when url is /', () => {
        const { queryByTestId } = setup('/');
        expect(queryByTestId('homepage')).toBeInTheDocument();
    });

    it('displays LoginPage when url is /login', () => {
        const { container } = setup('/login');
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Login');
    });

    it('displays only LoginPage when url is /login', () => {
        const { queryByTestId } = setup('/login');
        expect(queryByTestId('homepage')).not.toBeInTheDocument();
    });

    it('displays UserSignUpPage when url is /signup', () => {
        const { container } = setup('/signup');
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Sign Up');
    });

    it('displays userpage when url is other than /,/login or /signup', () => {
        const { queryByTestId } = setup('/user1');
        expect(queryByTestId('userpage')).toBeInTheDocument();
    });

    it('displays topBar when url is /', () => {
        const { container } = setup('/');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();

    });

    it('displays topBar when url is /login', () => {
        const { container } = setup('/login');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
    });

    it('displays topBar when url is /signup', () => {
        const { container } = setup('/signup');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
    });

    it('displays topBar when url is /user1', () => {
        const { container } = setup('/user1');
        const navigation = container.querySelector('nav');
        expect(navigation).toBeInTheDocument();
    });

    it('shows the UserSignupPage when clicking signup', () => {
        const { queryByText, container } = setup('/');
        const signupLink = queryByText('Sign Up');
        fireEvent.click(signupLink);
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Sign Up');
    });


    it('shows the LoginPage when clicking login', () => {
        const { queryByText, container } = setup('/');
        const loginLink = queryByText('Login');
        fireEvent.click(loginLink);
        const header = container.querySelector('h1');
        expect(header).toHaveTextContent('Login');
    });

    it('shows the HomePage when clicking the logo', () => {
        const { queryByTestId, container } = setup('/');
        const logo = container.querySelector('img')
        fireEvent.click(logo);
        expect(queryByTestId('homepage')).toBeInTheDocument();
    });
    it('displays My Profile on TopBar after login success', async () => {
        const { queryByPlaceholderText, container, queryByText } = setup('/login');
        const changeEvent = (content) => {
            return {
                target: {
                    value: content
                }
            };
        };
        const usernameInput = queryByPlaceholderText('Your username');
        fireEvent.change(usernameInput, changeEvent('user1'));
        const passwordInput = queryByPlaceholderText('Your password');
        fireEvent.change(passwordInput, changeEvent('P4ssword'));
        const button = container.querySelector('button');

        axios.post = jest.fn().mockResolvedValue({
            data: {
                id: 1,
                username: 'user1',
                displayName: 'display1',
                image: 'profile1.png'
            }
        });
        fireEvent.click(button);

        await waitFor(() => expect(queryByText('My Profile')).toBeInTheDocument());
    })


})