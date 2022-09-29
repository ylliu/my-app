import React from "react";

export class UserSignupPage extends React.Component {

    state = {
        displayName: '',
        username: '',
        password: '',
        repeatPassword: '',
    };

    onChangeDisplayName = (event) => {
        const value = event.target.value;
        this.setState({ displayName: value });
    };

    onChangeUsername = (event) => {
        const value = event.target.value;
        this.setState({ username: value });
    };

    onChangePassword = (event) => {
        const value = event.target.value;
        this.setState({ password: value });
    };

    onChangeRepeatPassword = (event) => {
        const value = event.target.value;
        this.setState({ repeatPassword: value });
    };

    onClickSignup = () => {
        const user = {
            username: this.state.username,
            displayName: this.state.displayName,
            password: this.state.password
        }
        this.props.actions.postSignup(user);
    };

    render() {
        return (
            <div>
                <h1>Sign Up</h1>
                <div>
                    <input
                        placeholder="Your display name"
                        value={this.state.displayName}
                        onChange={this.onChangeDisplayName}
                    />
                </div>
                <div>
                    <input
                        placeholder="Your username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                    />
                </div>
                <div>
                    <input placeholder="Your password" type={'password'}
                        value={this.state.password}
                        onChange={this.onChangePassword} />
                </div>
                <div>
                    <input placeholder="Repeat your password" type={'password'}
                        value={this.repeatPassword}
                        onChange={this.onChangeRepeatPassword} />
                </div>
                <div>
                    <button onClick={this.onClickSignup}>Sign Up</button>
                </div>
            </div>
        )
    }
}

UserSignupPage.defaultProps = {
    actions: {
        postSignup: () =>
            new Promise((resolve, reject) => {
                resolve({});
            })
    }

}

export default UserSignupPage;