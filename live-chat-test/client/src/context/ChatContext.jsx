/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useCallback } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState([]);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    
    useEffect(() => {
        const fetchUsers = async () => {
            setIsUserChatsLoading(true);
            try {
                const data = await getRequest(`${baseUrl}/users/all`);
                if (data.error) {
                    setUserChatsError(data.error);
                    return;
                }

                const filteredChats = data.users.filter(u => u._id !== user?._id && !userChats.some(chat => chat.members.includes(u._id)));
                setPotentialChats(filteredChats);
            } catch (error) {
                console.error("Error in fetchUsers:", error);
                setUserChatsError(error);
            } finally {
                setIsUserChatsLoading(false);
            }
        };

        if (user?._id) {
            fetchUsers();
        }
    }, [userChats, user?._id]);

    useEffect(() => {
        const getMessages = async () => {
            if (currentChat?._id) {
                setIsMessagesLoading(true);
                try {
                    const response = await getRequest(`${baseUrl}/messages/${currentChat._id}`);
                    if (response.error) {
                        setMessagesError(response.error);
                    } else {
                        setMessages(response);
                    }
                } catch (error) {
                    setMessagesError(error);
                } finally {
                    setIsMessagesLoading(false);
                }
            }
        };

        getMessages();
    }, [currentChat?._id]);

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    const createChat = useCallback(async (firstId, secondId) => {
        try {
            const response = await postRequest(`${baseUrl}/chats`, { firstId, secondId });
            if (response.error) {
                console.error("Error Creating Chat", response);
            } else {
                setUserChats(prev => [...prev, response]);
            }
        } catch (error) {
            console.error("Error Creating Chat", error);
        }
    }, []);

    useEffect(() => {
        const fetchUserChats = async () => {
            if (user?._id) {
                setIsUserChatsLoading(true);
                try {
                    const response = await getRequest(`${baseUrl}/chats/${user._id}`);
                    if (response.error) {
                        setUserChatsError(response.error);
                    } else {
                        setUserChats(response);
                    }
                } catch (error) {
                    setUserChatsError(error);
                } finally {
                    setIsUserChatsLoading(false);
                }
            }
        };

        fetchUserChats();
    }, [user?._id]);

    return (
        <ChatContext.Provider value={{
            userChats,
            isUserChatsLoading,
            userChatsError,
            potentialChats,
            createChat,
            updateCurrentChat,
            currentChat,
            messages,
            isMessagesLoading,
            messagesError,
        }}>
            {children}
        </ChatContext.Provider>
    );
};
