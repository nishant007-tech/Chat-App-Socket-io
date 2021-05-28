import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { registerUser } from './actions/user_actions';


function Register(props) {
    const dispatch = useDispatch();
    const [error, setError] = useState();
    const [state, setState] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleName = (e) => {
        setState({
            ...state, name: e.target.value
        });
    }
    const handleEmail = (e) => {
        setState({
            ...state, email: e.target.value
        });
    }
    const handlePassword = (e) => {
        setState({
            ...state, password: e.target.value
        });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            let response = await dispatch(registerUser(state));
            if (response) {
                props.history.push('/login');
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
            <div className='RegContainer'>
                <form onSubmit={submitHandler}>
                    <p className='heading'>Register Here!!</p>
                    <div>
                        <TextField
                            className='txtField'
                            label="Name"
                            variant="outlined"
                            color="secondary"
                            required={true}
                            onChange={handleName}
                            autoComplete="new-name"
                        />
                        <TextField
                            className='txtField'
                            label="Username/Email"
                            variant="outlined"
                            color="secondary"
                            required={true}
                            onChange={handleEmail}
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
                            onChange={handlePassword}
                            autoComplete="off"
                        />
                    </div>
                    <Button variant='contained' color="secondary" type='submit'>Register</Button>
                </form>

            </div>
        </>
    )
}


export default Register;
