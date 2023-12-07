/* eslint-disable no-unused-vars */
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { Container, Stack } from 'react-bootstrap'
import { useContext } from 'react';
import UserChat  from '../components/chat/userChat'

const Chat = () => { 
    const { user } = useContext(AuthContext);
    const { userChats,
    isUserChatsLoading,
    userChatsError, } = useContext(ChatContext);
    
    return <Container>
        {userChats?.length < 1? null : 
            (<Stack  direction="horizontal" gap={4} className='align-items-start'>
            <Stack className='messages-box flex-grow-8 pe-3' gap={3}>
                {isUserChatsLoading && <p>Loading Chats</p>}
                {userChats?.map((chat,index)=>{
                    return (
                        <div key={index}>
                            <UserChat chat={chat} user={user}/>
                        </div>
                    )
                })}
            </Stack>
            <p>Chat Box</p>
            </Stack>
        )}</Container>
}

export default Chat