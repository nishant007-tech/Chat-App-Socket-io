import React from 'react'
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from './actions/user_actions';
import io from 'socket.io-client';
import { SERVER } from './config';
const socket = io(SERVER);

function Navbar() {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.user_reducer.user);

    const LogoutHandler = async () => {
        await dispatch(logoutUser());
        socket.emit("disconnectUser", isLoggedIn);
        window.location = '/';
    }

    return (
        <div className='navbar'>
            <div className='navLogo'>
                <Link to='/'>
                    <WhatsAppIcon style={{ fontSize: 50 }} color='secondary' fontSize='large' />
                    <span>Chat App</span>
                </Link>
            </div>

            <div className='navLinks'>
                {
                    isLoggedIn
                        ?
                        <>
                            <Link to='/chat'>
                                <Button className='navBtn' color="secondary">Chats</Button>
                            </Link>
                            <Link to='/allusers'>
                                <Button className='navBtn' color="secondary">All Users</Button>
                            </Link>
                            <Button onClick={LogoutHandler} className='navBtn' color="secondary">Logout</Button>
                        </>
                        :
                        <>
                            <Link to='/login'>
                                <Button className='navBtn' color="secondary">Login</Button>
                            </Link>
                            <Link to='/register'>
                                <Button className='navBtn' color="secondary">Register</Button>
                            </Link>
                        </>
                }
            </div>
        </div>
    )
}

export default Navbar
