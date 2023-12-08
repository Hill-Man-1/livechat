import { useContext } from 'react';
import { Container, Stack } from 'react-bootstrap';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import UserChat from '../components/chat/UserChat';
import PotentialChats from '../components/chat/potentialChats';
import ChatBox from './../components/chat/chatBox';

const Chat = () => { 
    const { user } = useContext(AuthContext);
    const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);
    
    return (
        <Container>
            <PotentialChats/>
            <Stack direction="horizontal" gap={4} className='align-items-start'>
                <Stack className='messages-box flex-grow-0 pe-3' gap={3}>
                    {isUserChatsLoading && <p>Loading Chats</p>}
                    {userChats?.map((chat, index) => (
                        <div key={index} onClick={() => updateCurrentChat(chat)}>
                            <UserChat chat={chat} user={user}/>
                        </div>
                    ))}
                </Stack>
                <ChatBox/>
            </Stack>
        </Container>
    );
}

export default Chat;