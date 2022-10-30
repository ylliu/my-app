import React from "react";
import { render } from '@testing-library/react';
import TopBar from './TopBar';
import { MemoryRouter } from 'react-router-dom';

const setup = () => {
    return render(
        <MemoryRouter>
            <TopBar />
        </MemoryRouter>
    )
}
describe('TopBar', () => {
    describe('Layout', () => {
        it('has application Logo', () => {
            const { container } = setup();
            const image = container.querySelector('img');
            expect(image.src).toContain('hoaxify-logo.png');
        });

        it('has link to home from logo', () => {
            const { container } = setup();
            const image = container.querySelector('img');
            expect(image.parentElement.getAttribute('href')).toBe('/');
        });

        it('has link to login', () => {
            const { queryByText } = setup();
            const LoginLink = queryByText('Login');
            expect(LoginLink.getAttribute('href')).toBe('/login');
        });

        it('has link to signup', () => {
            const { queryByText } = setup();
            const signupLink = queryByText('Sign Up');
            expect(signupLink.getAttribute('href')).toBe('/signup');
        });
    })
})