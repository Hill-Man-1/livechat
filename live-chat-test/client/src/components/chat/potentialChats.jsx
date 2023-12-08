/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, updateCurrentChat } = useContext(ChatContext);

    return (
        <>
            <div className="all-users">
                {potentialChats &&
                    potentialChats.map((u, index) => (
                        <div
                            className="single-user"
                            key={index}
                            onClick={() => {
                                createChat(user._id, u._id);
                                updateCurrentChat(currentChat); // Update the current chat
                            }}
                        >
                            {u.email}
                            <span className="user-online"></span>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default PotentialChats;