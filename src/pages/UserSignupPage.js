import React from "react";
import Input from "../components/input"
export class UserSignupPage extends React.Component {

    state = {
        displayName: '',
        username: '',
        password: '',
        repeatPassword: '',
        pendingApiCall: false,
        errors: {}
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
        this.setState({ pendingApiCall: true });
        this.props.actions.postSignup(user)
            .then((response) => {
                this.setState({ pendingApiCall: false });
            })
            .catch((apiError) => {
                let errors = { ...this.state.errors }
                if (apiError.response.data && apiError.response.data.validationErrors) {
                    errors = { ...apiError.response.data.validationErrors }
                }
                this.setState({ pendingApiCall: false, errors });
            });
    };

    render() {
        return (
            <div className="container">
                <h1 className="text-center">Sign Up</h1>
                <div className="col-12 mb-3">
                    <Input
                        label="Display name"
                        placeholder="Your display name"
                        value={this.state.displayName}
                        onChange={this.onChangeDisplayName}
                        hasError={this.state.errors.displayName && true}
                        error={this.state.errors.displayName}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Username"
                        placeholder="Your username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                        hasError={this.state.errors.username && true}
                        error={this.state.errors.username}
                    />
                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Password"
                        placeholder="Your password" type={'password'}
                        value={this.state.password}
                        onChange={this.onChangePassword}
                        hasError={this.state.errors.password && true}
                        error={this.state.errors.password}
                    />

                </div>
                <div className="col-12 mb-3">
                    <Input
                        label="Password repeat"
                        placeholder="Repeat your password" type={'password'}
                        value={this.repeatPassword}
                        onChange={this.onChangeRepeatPassword}
                        hasError={this.state.errors.repeatPassword && true}
                        error={this.state.errors.password}
                    />
                </div>
                <div className="text-center">
                    <button className="btn btn-primary"
                        onClick={this.onClickSignup}
                        disabled={this.state.pendingApiCall}
                    >
                        {this.state.pendingApiCall && (
                            <div className="spinner-border text-light spinner-border-sm mr-l" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        )}
                        Sign Up</button>
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