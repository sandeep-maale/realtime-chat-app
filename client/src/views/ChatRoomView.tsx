import { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, IconButton, Stack, Typography } from '@mui/material';
import ChatRoom from '../models/ChatRoom';
import ChatRoomComponent from '../common/components/ChatRoomComponent';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CreateChatRoomComponent from '../common/components/CreateChatRoomComponent';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setChatRooms, setCurrentChatRoom, setMessages } from '../redux/store';
import ChatRoomViewStyles from './ChatRoomView.module.scss'; // Import the SCSS module
import config from '../config';
import Cookies from 'universal-cookie';


function ChatRoomView() {
    const [showCreateChatRoom, setShowCreateChatRoom] = useState<boolean>(false);
    const dispatch = useDispatch();
    const chatRooms = useSelector((state: AppState) => state.chatRooms.chatRooms);
    const currentChatRoom = useSelector((state: AppState) => state.currentChatRoom.chatRoom);
    
    // eslint-disable-next-line 
    const [refreshInterval, setRefreshInterval] = useState(1000); // 5 seconds
    const [activeRoom, setActiveRoom] = useState<number>(1);
    const cookies = new Cookies();


    const handleCreateChatRoomClick = () => {
        setShowCreateChatRoom(true);
    }

    const createChatRoom = async (chatRoom: ChatRoom) => {
        await axios.post(`${config.serviceUrl}/chatRooms`, chatRoom)
            .then(response => {
                if (response.status === 200 && response?.data.length > 0) {
                    dispatch(setChatRooms(
                        [...response.data]
                    ));
                    const createdChatRoom = response.data.find((room: any) => room.roomName === chatRoom.roomName)
                    dispatch(setCurrentChatRoom(createdChatRoom));
                }
                setShowCreateChatRoom(false);
            })
            .catch(error => {
                console.error('Error while creating chatRoom,', error);
            });
    }

    const fetchChatRoomMessages = async (roomId: number) => {
        // Fetch messages for current chat room
        await axios.get(`${config.serviceUrl}/messages?roomId=${roomId}`)
            .then(response => {
                if (response?.data.length > 0) {
                    dispatch(setMessages(response.data))
                } else {
                    dispatch(setMessages([]))
                }
            })
            .catch(error => {
                console.error('Error fetching messages for current chat room:', error);
            });

    }

    const handleChatRoomClick = async (chatRoomDetails: ChatRoom) => {
        setActiveRoom(chatRoomDetails.roomId);
        dispatch(setCurrentChatRoom({
            chatRoom: {
                ...chatRoomDetails
            }
        }))
    }

    useEffect(() =>{
        if(currentChatRoom === null && chatRooms && chatRooms.length > 0){
            dispatch(setCurrentChatRoom({
                chatRoom: {
                    ...chatRooms[0]
                }
            }))
        }
        // eslint-disable-next-line 
    }, [chatRooms])

    // Effect to fetch data initially and then at regular intervals
    useEffect(() => {
        fetchChatRoomMessages(activeRoom);

        const intervalId = setInterval(() => {
            // Fetch data at regular intervals
            fetchChatRoomMessages(activeRoom);

            // Optionally, you can change the refresh interval dynamically
            // setRefreshInterval(newInterval);
        }, refreshInterval);

        return () => {
            clearInterval(intervalId); // Clear the interval when the component unmounts
        };
        // eslint-disable-next-line 
    }, [refreshInterval, activeRoom]); // Dependencies array to re-run the effect when the interval changes

    return (
        <Stack className={ChatRoomViewStyles.chatRoomWrapper}>
            <Grid container direction={'row'} className={ChatRoomViewStyles.chatRoomViewContainer} >
                <Grid item flexGrow={1} className={ChatRoomViewStyles.typographyContainer}>
                    <Typography variant='subtitle2' fontWeight={'bold'} >Chat Rooms</Typography>
                </Grid>
                <Grid item>
                    <IconButton disabled={!cookies.get('user')} onClick={handleCreateChatRoomClick} className={ChatRoomViewStyles.icon} >
                        <AddCircleIcon />
                    </IconButton>
                </Grid>
            </Grid>

            {chatRooms?.map((chatRoom, index) => {
                return <ChatRoomComponent isActive={currentChatRoom !== null ? chatRoom.roomId === currentChatRoom.roomId : (activeRoom ===1 && index === 0) ? true: false} onClick={() => { handleChatRoomClick(chatRoom) }} key={chatRoom.roomId} {...chatRoom} />
            })}
            <CreateChatRoomComponent onSubmitChatRoom={createChatRoom} onCloseDialog={() => { setShowCreateChatRoom(false) }} isOpen={showCreateChatRoom} />
        </Stack>
    );
}

export default ChatRoomView;
