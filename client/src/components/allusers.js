import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { getAllUsers } from './actions/user_actions';
function Allusers() {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const userId = useSelector(state => state.user_reducer.user);

    useEffect(() => {
        async function func() {
            let response = await dispatch(getAllUsers());
            setUsers(response.payload.data.users);
        }
        func();
    }, [userId, dispatch])
    return (
        <div className="allUserContainer">
            <div className="allUserContent">
                {
                    users.map((element, index) => (
                        element._id !== userId ?
                            <Link key={index} to={`/chat/${element._id}`}>
                                <div className="userContent">
                                    <span className="forUser"><i className="fa fa-user " ></i></span>
                                    <h3>{element.name}</h3>
                                    <span className="forActiveUser"><i className="fa fa-comments activeBlue "></i></span>
                                </div>
                            </Link>
                            :
                            ""
                    ))
                }
            </div>
        </div>
    )
}

export default Allusers
