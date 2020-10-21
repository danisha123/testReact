import React, {Component} from 'react';
import logo from './logo.svg';
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText
} from 'reactstrap';
import {getErrorMessages, formValid, getallErrors} from './formvalidation';
import axios from 'axios';
import toastr from "toastr";
import "toastr/build/toastr.min.css"
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            loginpassword: "",
            disableButton: true,
            formErrors: {
                username: "",
                loginpassword: ""
            },
            loading: false
        }
    }
    componentDidMount() {
        if (localStorage.getItem('user_login')) {
            this
                .props
                .history
                .push('home')
        }
    }

    handleChange = (e) => {

        const {name, value} = e.target;

        this.setState({[name]: value});
        let formErrors = {
            ...this.state.formErrors
        };
        formErrors = getErrorMessages(formErrors, name, value);
        if (formValid(this.state)) {
            this.setState({disableButton: false});
        } else {
            this.setState({disableButton: true});
        }

        this.setState({formErrors, [name]: value});

    };

    handleSubmit = (e) => {

        e.preventDefault();

        if (formValid(this.state)) {
            let obj = {
                username: this.state.username,
                password: this.state.loginpassword
            }
            this.setState({loading: true})
            axios
                .get(`https://swapi.dev/api/people/?search=${obj.username}`)
                .then(res => {
                    this.setState({loading: false})
                    let response = res
                    if (response.status === 200) {
                        //   localStorage.setItem('token', response.data.token);
                        if (response.data.count == 1) {
                            if (obj.password === response.data.results[0].birth_year && obj.username === response.data.results[0].name) {
                                toastr.success("Logged in successfuly");
                                localStorage.setItem('user_login', JSON.stringify({
                                    username: response
                                        .data
                                        .results[0]
                                        .name,
                                    password: response
                                        .data
                                        .results[0]
                                        .birth_year
                                }))
                                this
                                    .props
                                    .history
                                    .push('/home');

                            } else {
                                toastr.error("Username or password is incorrect!");
                            }

                        } else {
                            toastr.error("User not Found");
                        }

                    } else {

                        toastr.error("", response.message);

                    }
                })
                .catch(err => console.log("errr", err));
        } else {
            let errors = getallErrors(this.state);
            this.setState({
                formErrors: {
                    username: errors.username,
                    loginpassword: errors.loginpassword
                }
            })
        }
    }

    render() {

        const {formErrors} = this.state;
        const style = {
            cursorchanges: {
                cursor: 'pointer'
            }
        }
        return (
            <> < div style = {{ border: '1px',height:"80%",width:"80%", margin:"auto"}} > <h1>Login</h1>
            <Form onSubmit={this.handleSubmit}>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="exampleusername" className="mr-sm-2">Username
                    </Label>
                    <Input
                        type="username"
                        name="username"
                        onChange={this.handleChange}
                        autoFocus="autoFocus"/> {
                        formErrors.username.length > 0 && (
                            <span className="text-danger">{formErrors.username}</span>
                        )
                    }

                </FormGroup>
                <br/>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="examplePassword" className="mr-sm-2">Password
                    </Label>
                    <Input type="password" name="loginpassword" onChange={this.handleChange}/> {
                        formErrors.loginpassword.length > 0 && (
                            <span className="text-danger">{formErrors.loginpassword}</span>
                        )
                    }
                </FormGroup>
                <br/>
                <Button type='submit'>Submit</Button>
            </Form>
        </div>
    </>

        );
    }
}

export default Login;
