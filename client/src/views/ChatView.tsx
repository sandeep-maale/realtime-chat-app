import { Grid } from '@mui/material';
import ChatRoomView from './ChatRoomView';
import ChatMessagesView from './ChatMessagesView';
import ChatRoomConfig from './ChatRoomConfig';
import ChatViewStyles from './ChatView.module.scss'; // Import the SCSS module
function ChatView() {

    return (
        <Grid container className={ChatViewStyles.chatViewContainer}>
            <Grid item xs={2} className={ChatViewStyles.chatRoomViewContainer}>
                {/* chat rooms content */}
                <ChatRoomView />
            </Grid>
            <Grid container direction={'column'} item xs={10} className={ChatViewStyles.chatMessageContainer} flexGrow={1}>
                {/* chat room config to configure rooms */}
                <Grid item >
                    <ChatRoomConfig />
                </Grid>

                {/* chat messages content */}
                <Grid item className={ChatViewStyles.chatMessageViewContainer} flexGrow={1}>
                    <ChatMessagesView />
                </Grid>

            </Grid>

        </Grid>
    );
}

export default ChatView;
