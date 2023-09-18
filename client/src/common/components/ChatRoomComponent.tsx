import { Grid } from '@mui/material';
import ChatRoom from '../../models/ChatRoom';
import ChatRoomComponentStyles from './ChatRoomComponent.module.scss'; // Import the SCSS module

export interface ChatRoomComponentProps extends ChatRoom {
    isActive: boolean;
    onClick?: () => void;
}

function ChatRoomComponent(props: ChatRoomComponentProps) {

    return (
        <Grid container is-active={props.isActive? 'active':'inactive'} className={ChatRoomComponentStyles.chatRoomContainer} onClick={props.onClick}>
            <Grid item xs={12}  className={ChatRoomComponentStyles.chatRoom} flexGrow={1}>
                {props.roomName}
            </Grid>
        </Grid>
    );
}

export default ChatRoomComponent;
