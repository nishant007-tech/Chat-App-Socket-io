import React, { useEffect, useRef } from 'react'
import Typist from 'react-typist';
import { format } from 'timeago.js';
import { DoDecrypt } from './aes';


function ShowMessages({ foundMessages, userId, friendId, foundUser }) {
    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [foundMessages]);

    const decryptToPlainText = (cipher) => {
        return DoDecrypt(cipher);
    }

    return (
        <div className="rightChatContent" >
            {
                foundMessages.length !== 0 ?
                    foundMessages.map((data, index) => (
                        <div ref={scrollRef} key={index} className={data.authorId === userId ? "right" : `left `}>
                            <h6> <i className="fa fa-user-circle"></i> {data.author}</h6>
                            <p>{data.type === "textMessage" ? decryptToPlainText(data.content)
                                : data.type === 'image/jpeg' || data.type === 'image/png' ?
                                    <img src={data.content} alt="Pic" className="ChatImage" />
                                    : <video className="video" controls>
                                        <source src={data.content} type="video/mp4"></source>
                                    </video>
                            }</p>
                            <i className="time">{format(data.createdAt)}</i>
                        </div>
                    ))
                    :
                    friendId ?
                        <h3 ref={scrollRef}>Lets Start Conversation with "<b>{foundUser.name}"</b></h3>
                        :
                        <Typist cursor={
                            {
                                show: false,
                                hideWhenDone: true
                            }
                        }>
                            <div ref={scrollRef} className="typistContainer">
                                <p className='chatHeadTxt'>Let's Chat </p>
                                <p> Let's Talk Virtual</p>
                                <Typist.Delay ms={500} />
                                <p className='chatHeadTxt'>It's An Online live Conversation</p>
                            </div>
                        </Typist>
            }
        </div>
    )
}

export default ShowMessages
