import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux'
import { loginUser } from './actions/user_actions';

function Login(props) {

    const dispatch = useDispatch();
    const [error, setError] = useState();
    const [state, setState] = useState({
        email: "",
        password: ""
    });
    const userNameHandler = (e) => {
        setState({
            ...state, email: e.target.value
        });
    }
    const passwordHandler = (e) => {
        setState({
            ...state, password: e.target.value
        })
    }

    const loginSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await dispatch(loginUser(state));
            if (response) {
                props.history.push('/');
            }
        } catch (err) {
            setError(err.response.data.message);
            console.log(err.response.data.message);
        }

    }
    const closeButtonhandler = () => {
        setError(undefined);
    }

    return (
        <>
            { error && (
                <div className="error">
                    <span>
                        <i className="fa fa-exclamation-circle errorIcon"></i>
                        <p>{error}</p>
                    </span>
                    <button onClick={closeButtonhandler}>X</button>
                </div>)
            }
            <div className='Container'>
                <form onSubmit={loginSubmitHandler}>
                    <p className='heading'>Welcome To Login Page!</p>
                    <div>
                        <TextField
                            className='txtField'
                            label="Email"
                            variant="outlined"
                            color="secondary"
                            required={true}
                            onChange={userNameHandler}
                            autoComplete="off"
                            type="email"
                        />
                        <TextField
                            className='txtField'
                            type='password'
                            label="Password"
                            variant="outlined"
                            color="secondary"
                            required={true}
                            onChange={passwordHandler}
                            autoComplete="off"
                        />
                    </div>
                    <Button variant='contained' color="secondary" type='submit'>Login</Button>
                </form>

            </div>
        </>
    )
}

export default Login
