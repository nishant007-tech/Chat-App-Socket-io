import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { getAllMessages } from './actions/user_actions';
import MessageTwoToneIcon from '@material-ui/icons/MessageTwoTone';
import NotificationsActiveTwoToneIcon from '@material-ui/icons/NotificationsActiveTwoTone';
import PermIdentityTwoToneIcon from '@material-ui/icons/PermIdentityTwoTone';

function UsersList({ foundUser, onlineUsers }) {
    let userID = useSelector(state => state.user_reducer.user);
    const dispatch = useDispatch();
    const [users, setusers] = useState([]);
    let [conversations, setconversations] = useState([]);
    const username = useSelector(state => state.user_reducer.username);
    const msgread = useSelector(state => state.chat_reducer.msgRead);

    useEffect(() => {
        if ((msgread?.read === false && conversations.length <= 0) || (msgread?.read === false && !conversations.some((item) => item.userId === msgread.authorId))) {
            window.location.reload();
        }
    })
    useEffect(() => {
        async function func() {
            let response = await dispatch(getAllMessages());
            let unique = [...new Set(response.payload.data.messages.flatMap(item => {
                if (item.receiver === userID) {
                    return (item.author + "|" + item.authorId);
                } if (item.authorId === userID) {
                    return (item.receiverName + "|" + item.receiver);
                } else {
                    return null
                }
            }))];
            setusers(unique.map(item => item !== null && item.split("|")));
        }
        func();

    }, [dispatch, userID])
    useEffect(() => {
        if (users.length > 0) {
            let data = [];
            for (let i = 0; i < users.length; i++) {
                var value = users[i];
                for (let j = 0; j < value.length - 1; j++) {
                    if (value !== false && value !== undefined) {
                        data.push({ "userId": value[j + 1], "username": value[j] })
                    }
                }
            }
            if (data.length > 0) {
                let bool = data.some(item => (
                    item.userId === foundUser._id
                ))
                if (!bool) {
                    setconversations(data);
                    setconversations(prev => [...prev, { "userId": foundUser._id, "username": foundUser.name }]);
                } else {
                    setconversations(data);
                }
            }
        }
    }, [foundUser, users, userID]);

    const handleReadMsg = (userId) => {
        if (msgread?.authorId === userId) {
            msgread.authorId = null;
            msgread.read = true;
        }
    }

    return (
        <div className="leftUsersContainer">
            <h3 id="h3ForOnline">Online </h3>
            <div className="onlineUsers">
                {
                    onlineUsers.length > 0 ?
                        onlineUsers[0].map((elem, index) => (
                            elem.userId && elem.userId !== userID ?
                                <Link key={index} to={`/chat/${elem.userId} `}>
                                    <div className={elem.userId === foundUser._id ? "leftUserContent userIsActive " : "leftUserContent"}>
                                        <span>
                                            <PermIdentityTwoToneIcon />
                                            <h3>{elem.username}</h3>
                                        </span>
                                        <i className={elem.socketId ? "fa fa-circle active" : " "}></i>
                                    </div>
                                </Link>
                                :

                                elem.userId && (
                                    <Link key={index} to={`/chat`}>
                                        <div className="leftUserContent ">
                                            <span >
                                                <span className="tooltiptext">Talking To Oneself Not Allowed!!</span>
                                                <PermIdentityTwoToneIcon />
                                                <h3>{username}(Me)</h3>
                                            </span>
                                            <i className="fa fa-circle active"></i>
                                        </div>
                                    </Link>
                                ))
                        )
                        :
                        ""
                }
            </div>
            <div>
                <h3 id="h3">Chats</h3>
                <div className="overflowY">
                    {
                        conversations.length > 0 ?
                            conversations.map((item, index) => (
                                item.userId !== undefined && (
                                    <Link key={index} to={`/chat/${item.userId} `}>
                                        <div onClick={() => handleReadMsg(item.userId)} className={item.userId === foundUser._id ? "leftUserContent userIsActive" : "leftUserContent"}>
                                            <span>
                                                <PermIdentityTwoToneIcon />
                                                <h3>{item.username}</h3>
                                            </span>
                                            {
                                                msgread?.authorId === item.userId ?
                                                    <NotificationsActiveTwoToneIcon color="action" className="notiIcon" />
                                                    :
                                                    ""
                                            }
                                        </div>
                                    </Link>)
                            ))
                            :
                            <div className="ifNoMsg">
                                <MessageTwoToneIcon color="action" className="ifNoConvo" />
                                <p> No Message Yet!</p>
                                <i>Start The Conversation!</i>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default UsersList
