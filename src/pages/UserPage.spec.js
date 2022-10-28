import React from "react";
import { render } from "@testing-library/react";
import UserPage from './UserPage';

describe('UserPage', () => {
    it('Layout', () => {
        const { queryByTestId } = render(<UserPage />);
        const UserPageDiv = queryByTestId('userpage');
        expect(UserPageDiv).toBeInTheDocument();
    })
})
