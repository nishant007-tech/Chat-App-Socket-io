import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authUser } from '../actions/user_actions';

export default function RequireAuthentication(Component) {

    function AuthenticationCheck(props) {
        let userID = useSelector(state => state.user_reducer.user);
        const dispatch = useDispatch();
        useEffect(() => {
            const fetchData = async () => {
                try {
                    await dispatch(authUser());
                } catch (error) {
                    console.log(error.message)
                }
            }
            fetchData();
        }, [dispatch, props.history, userID])

        return (
            <Component {...props} user={userID} />
        )

    }
    return AuthenticationCheck;

}

