import { Grid } from '@mui/material';
import User from '../models/User';
import { useSelector, useDispatch } from 'react-redux';
import { AppState, setCurrentChatRoom, updateChatRoom } from '../redux/store';
import ChatRoomConfigStyles from './ChatRoomConfig.module.scss'; // Import the SCSS module

import AutoCompleteUsers from '../common/components/AutoCompleteUsers';
import axios from 'axios';
import config from '../config';
import dayjs from 'dayjs';

function ChatRoomConfig() {
    const users = useSelector((state: AppState) => state.users.users);
    const currentChatRoom = useSelector((state: AppState) => state.currentChatRoom.chatRoom);
    const dispatch = useDispatch();

    const handleUpdateChatRoomUsers = (currentUsers: User[]) => {
        axios.put(`${config.serviceUrl}/chatRooms`, { ...currentChatRoom, users: currentUsers, lastUpdatedTimeStamp: dayjs().valueOf() })
            .then(response => {
                if (response && response.status === 200) {
                    dispatch(updateChatRoom(
                        {
                            ...currentChatRoom, users: currentUsers
                        }))
            
                    dispatch(setCurrentChatRoom(
                        {
                            chatRoom: {
                                ...currentChatRoom, users: currentUsers
                            }
                        }))
                }
            })
            .catch(error => {
                console.error('Error while updating chatRoom.', error);
            })
    }

    return (
        <Grid container direction={'row'} className={ChatRoomConfigStyles.chatRoomConfigContainer}>
            <AutoCompleteUsers userList={users ? [...users] : []} chatRoomUsers={currentChatRoom?.users ? currentChatRoom.users : []} onUpdateChatRoomUsers={(users: User[]) => handleUpdateChatRoomUsers(users)} />
        </Grid>
    );
}

export default ChatRoomConfig;
