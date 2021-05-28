import React from 'react'
import Typist from 'react-typist';
import ForumIcon from '@material-ui/icons/Forum';
import CodeIcon from '@material-ui/icons/Code';
function Home() {
    return (
        <div className='homeContainer'>
            <div className='forumIcon'>
                <ForumIcon style={{ fontSize: 200 }} color='secondary' />
            </div>
            <div>
                <Typist cursor={
                    {
                        show: false,
                        hideWhenDone: true
                    }
                }>
                    <span className='headTxt'> Welcome To Magic Chat Application</span>
                    <Typist.Delay ms={1000} />
                    <br />
                    <br />
                    <span className='headTxt'>Developed By Nishant Rana</span>
                </Typist>
            </div>
            <div>
                <CodeIcon style={{ fontSize: 100 }} color='secondary' />
            </div>
        </div >
    )
}

export default Home
