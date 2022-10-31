const initialSate = {
    id: 0,
    username: '',
    displayName: '',
    image: '',
    password: '',
    isLoggedIn: false
};

export default function authReducer(state = initialSate, action) {
    if (action.type === 'logout-success') {
        return { ...initialSate };
    } else if (action.type === 'login-success') {
        return {
            ...action.payload,
            isLoggedIn: true
        }
    };
    return state;
}