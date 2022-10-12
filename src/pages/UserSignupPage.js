import React from "react";

export class UserSignupPage extends React.Component {

    state = {
        displayName: '',
        username: '',
        password: '',
        repeatPassword: '',
        pendingApiCall: false,
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
        .then((response)=>{
            this.setState({ pendingApiCall: false });
        })
        .catch(error=>{
            this.setState({ pendingApiCall: false });
        });
    };

    render() {
        return (
            <div className="container">
                <h1 className="text-center">Sign Up</h1>
                <div className="col-12 mb-3">
                    <lable>Display Name</lable>
                    <input
                        className="form-control"
                        placeholder="Your display name"
                        value={this.state.displayName}
                        onChange={this.onChangeDisplayName}
                    />
                </div>
                <div className="col-12 mb-3">
                    <lable>Username</lable>
                    <input
                        className="form-control"
                        placeholder="Your username"
                        value={this.state.username}
                        onChange={this.onChangeUsername}
                    />
                </div>
                <div className="col-12 mb-3">
                    <lable>Password</lable>
                    <input
                        className="form-control"
                        placeholder="Your password" type={'password'}
                        value={this.state.password}
                        onChange={this.onChangePassword} />
                </div>
                <div className="col-12 mb-3">
                    <lable>Password repeat</lable>
                    <input
                        className="form-control"
                        placeholder="Repeat your password" type={'password'}
                        value={this.repeatPassword}
                        onChange={this.onChangeRepeatPassword} />
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