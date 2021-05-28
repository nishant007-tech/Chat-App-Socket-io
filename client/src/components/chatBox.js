import React, { useState, useEffect, useRef, memo } from 'react'
import { useSelector, useDispatch } from 'react-redux';
// import { SERVER } from './config';
import UsersList from './usersList'
import axios from 'axios'
import ShowMessages from './showMessages';
import io from 'socket.io-client'
import AddBoxRoundedIcon from '@material-ui/icons/AddBoxRounded';
import { DoEncrypt } from './aes';
import CircularProgress from '@material-ui/core/CircularProgress';
import { setMessageIsRead } from './actions/chat_actions';


let socket = io();
function ChatBox({ match }) {
    const [state, setstate] = useState("");
    const dispatch = useDispatch();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const userId = useSelector(state => state.user_reducer.user);
    const username = useSelector(state => state.user_reducer.username);
    const [newestSocketPrivateMessage, setNewestSocketPrivateMessage] = useState(null);
    const [foundUser, setFoundUser] = useState({});
    const [foundMessages, setFoundMessages] = useState([]);
    const [msg, setmsg] = useState("");
    const [loader, setloader] = useState(false);
    const [warning, setWarning] = useState(undefined);
    var friendId = match?.params.id;
    let readMsg = useRef();

    useEffect(() => {
        socket.on('privatemessage', pm => {
            if (pm.authorId === foundUser._id || pm.authorId === userId) {
                setNewestSocketPrivateMessage(pm);
            } else {
                dispatch(setMessageIsRead({
                    read: false,
                    authorId: pm.authorId
                }));
            }
        });
        return (() => socket.removeAllListeners('privatemessage'));
    }, [foundUser, userId, dispatch]);

    useEffect(() => {
        if (newestSocketPrivateMessage) {
            setFoundMessages(existingMessages => [
                ...existingMessages,
                newestSocketPrivateMessage
            ]);
        }
    }, [newestSocketPrivateMessage]);

    useEffect(() => {
        socket.emit('adduser', userId, username);
        socket.on("getusers", (users) => {
            setOnlineUsers([users]);
        });
        return (() => socket.removeAllListeners('getusers'))
    }, [userId, username]);

    useEffect(() => {
        const getData = async () => {
            if (friendId) {
                const returnedUser = await axios.get(`/userinfo/${friendId}`);
                if (returnedUser) {
                    setFoundUser(returnedUser.data);
                }
                const foundMsg = await axios.get(`/privateconvo?userid=${userId}&friendid=${friendId}`);
                if (foundMsg.data.length > 0) {
                    setFoundMessages(foundMsg.data);
                }
            }
        }
        getData();
    }, [userId, friendId]);

    const readInput = (e) => {
        setmsg(e.target.value);
    }
    const handleFileUpload = (e) => {
        readMsg.current.value = e.target.files[0].name;
        setmsg(e.target.files[0]);
    }

    const closeButtonhandler = () => {
        setWarning(undefined);
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        //if message has length zero it means either it is a file or user try to send an empty message
        if (msg.length > 0) {
            try {
                let encryptMsg = DoEncrypt(msg);
                const message = {
                    author: username,
                    authorId: userId,
                    content: encryptMsg,
                    receiver: foundUser._id,
                    receiverName: foundUser.name,
                    participants: [userId, foundUser._id],
                    type: 'textMessage'
                }
                setloader(true);
                setWarning("Reload If Content Like Pics/Videos Did'nt Load Properly!!")
                const res = await axios.post(`/messages`, message);
                setFoundMessages(existingMessages => [
                    ...existingMessages,
                    res.data
                ]);
                if ([res.data].length > 0) {
                    socket.emit("privatemsg", message);
                    setloader(false);
                    setWarning(undefined);
                }
                setmsg("");
                readMsg.current.value = "";

            } catch (err) {
                console.log(err);
            }
        }//check that message is file
        else if (msg.name) {
            try {
                let formData = new FormData();
                formData.append('author', username)
                formData.append('authorId', userId)
                formData.append('content', msg)
                formData.append('receiver', foundUser._id)
                formData.append('receiverName', foundUser.name)
                formData.append('participants', [userId, foundUser._id])
                formData.append('type', '');
                setloader(true);
                setWarning("Reload If Content Like Pics/Videos Did'nt Load Properly!!")
                const res = await axios.post(`/messages`, formData);
                setFoundMessages(existingMessages => [
                    ...existingMessages,
                    res.data
                ]);
                // such as Axios or fetch, can accept a FormData object as a body. It is encoded and sent out with Content-Type: multipart/form-data. and value are in form of key and pairs.Method to console log= console.log(...formData);
                if ([res.data].length > 0) {
                    socket.emit("privatemsg", res.data);
                    setloader(false);
                    setWarning(undefined);
                }
                setmsg("");
                readMsg.current.value = "";
            } catch (err) {
                console.log(err);
            }
        }
        else {
            alert("Message Shouldn't be Empty!")
        }
    }

    if (userId) {
        return (
            <>

                <div className="chatContainer">
                    <div className="chatContent">
                        <UsersList onlineUsers={onlineUsers} foundUser={foundUser} />
                        <div className="rightChatContainer">
                            {warning && (
                                <div className="error">
                                    <span>
                                        <i className="fa fa-exclamation-circle errorIcon"></i>
                                        <p> <b>Warning:</b> {warning}</p>
                                    </span>
                                    <button onClick={closeButtonhandler}>X</button>
                                </div>)
                            }
                            {loader ? <CircularProgress color="secondary" className="spinLoader" /> : ""}
                            <ShowMessages foundMessages={foundMessages} userId={userId} friendId={friendId} foundUser={foundUser} />
                            <form onSubmit={submitHandler} encType='multipart/form-data'>
                                <div className="sendmsgForm" >
                                    <div className="sendFormInner" >
                                        <input ref={readMsg} disabled={friendId ? false : true} autoComplete="off" onChange={readInput} name="inputMsg" type="text" placeholder="Write here...." />
                                        <button name="inputMsg" type="submit"> <i className="fa fa-send"></i></button>
                                    </div>
                                    <input disabled={friendId ? false : true} onChange={handleFileUpload} type="file" id="upload" hidden />
                                    <label htmlFor="upload">
                                        <AddBoxRoundedIcon color="secondary" id="Uploadbutton" />
                                    </label>
                                </div>
                            </form>
                        </div>
                    </div >
                </div >

            </>
        )
    } else {
        //i used settimeout for not showing content immediately after re render...... during component re-render untill fetching userId this content might be visible between renders....!!
        setTimeout(() => {
            setstate("Session Expired Please LogIn Again!!!");
        }, 500);
        return (
            <div className="chatContainer"><h2>{state}</h2> </div>
        )
    }
}

export default memo(ChatBox)
