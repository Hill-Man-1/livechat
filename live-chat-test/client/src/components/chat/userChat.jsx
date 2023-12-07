/* eslint-disable react/prop-types */
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient"

const UserChat = ({chat, user}) => {
    
    const recipientUser = useFetchRecipientUser(chat, user)

    console.log("recipient user", recipientUser)
    return (
        <div>UserChat</div>
    )
}   
export default UserChat