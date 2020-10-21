import React from 'react';
import {InputText} from 'primereact/inputtext';
import axios from 'axios';
import toastr from "toastr";
import "toastr/build/toastr.min.css"
import './app.css';
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            planetsList: [],
            initialSearch: false,
            timeOut: false,
            username: '',
            searchCounter: 0
        };
    }

    componentDidMount() {
        if (!localStorage.getItem('user_login')) {
            this
                .props
                .history
                .push('login')
        } else {
            axios
                .get(
                    `https://swapi.dev/api/people/?search=${JSON.parse(localStorage.getItem('user_login')).username}`
                )
                .then(res => {
                    this.setState({loading: false})
                    let response = res
                    if (response.status === 200) {
                        if (response.data.count == 1) {
                            if (JSON.parse(localStorage.getItem('user_login')).password === response.data.results[0].birth_year && JSON.parse(localStorage.getItem('user_login')).username === response.data.results[0].name) {

                                this.setState({
                                    username: JSON
                                        .parse(localStorage.getItem('user_login'))
                                        .username
                                })

                            } else {
                              localStorage.removeItem('user_login')
                                this
                                    .props
                                    .history
                                    .push('/login');
                            }

                        } else {
                          localStorage.removeItem('user_login')
                            this
                                .props
                                .history
                                .push('/login');
                        }
                    } else {
                        toastr.error("", response.message);
                    }
                })
                .catch(err => console.log("errr", err));

        }

        axios
            .get(`https://swapi.dev/api/planets/`)
            .then(response => {

                if (response.status === 200) {
                    this.setState({planetsList: response.data.results})
                } else {
                    toastr.error("", response.message);
                }
            })
            .catch(err => console.log("errr", err));
    }

    searchPlanet(event) {

        if (!event.target.value.length) {
            axios
                .get(`https://swapi.dev/api/planets/`)
                .then(response => {

                    if (response.status === 200) {
                        this.setState({planetsList: response.data.results})
                    } else {
                        toastr.error("", response.message);
                    }
                })
                .catch(err => console.log("errr", err));
        } else {
            if (this.state.username != 'Luke Skywalker' && this.state.searchCounter > 15) {
                toastr.error(
                    'You are not able to search more then 15 times in a minute. Please try after so' +
                    'me time'
                )
            } else {
                axios
                    .get(`https://swapi.dev/api/planets/?search=${event.target.value}`)
                    .then(response => {
                        if (response.status === 200) {
                            if (!this.state.initialSearch) {
                                setTimeout(() => {
                                    this.setState({timeOut: true, initialSearch: false, searchCounter: 0})
                                }, 60000)
                            }
                            this.setState({
                                planetsList: response.data.results,
                                initialSearch: true,
                                searchCounter: this.state.searchCounter + 1
                            })
                        } else {
                            toastr.error("", response.message);
                        }
                    })
                    .catch(err => console.log("errr", err));
            }
        }

    }

    logOut = () => {
        localStorage.removeItem('user_login')
        this
            .props
            .history
            .push('login')
    }

    renderTable = () => {
        if (this.state.planetsList.length === 0) 
            return <tr>
                <td
                    colSpan="2"
                    style={{
                        margin: 'auto'
                    }}>No records found</td>
            </tr>

        return this
            .state
            .planetsList
            .map((el, index) => {
                const {name} = el //destructuring
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{name}</td>
                    </tr>
                )
            })

    }

    render() {
        const header = (
            <div className="table-header">
                <h3>
                    Search for Planets</h3>
                <span className="p-input-icon-left">
                    <i className="pi pi-search"/>
                    <InputText
                        type="search"
                        onInput={(e) => this.searchPlanet(e)}
                        placeholder="Search for Planet name"/>
                </span>
                <button
                    style={{
                        float: 'right'
                    }}
                    className="primary"
                    onClick={this.logOut}>Logout</button>
            </div>
        );
        return (

            <> < div style = {{ border: '1px',height:"80%",width:"80%", margin:"auto"}} > {
                header
            } < br /> <table>
                <tbody>
                    <tr>
                        <th>Sr</th>
                        <th>Planets</th>

                    </tr>
                    {this.renderTable()}

                </tbody>
            </table>
        </div>

    </>
        );
    }
}

export default App;
