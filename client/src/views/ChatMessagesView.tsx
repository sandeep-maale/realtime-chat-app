import { Grid } from '@mui/material';
import ChatTextEditor from '../common/components/ChatTextEditor';
import MessageComponent from '../common/components/MessageComponent';
import ChatMessagesViewStyles from './ChatMessagesView.module.scss'; // Import the SCSS module
import { useSelector } from 'react-redux';
import { AppState } from '../redux/store';

function ChatMessagesView() {
    const messages = useSelector((state: AppState) => state.messages?.messages || []);
    return (
        <Grid container direction={'column'} className={ChatMessagesViewStyles.chatMessagesViewContainer}>
            <Grid item sx={{alignItems:'stretch', overflowY:'hide'}}>
                {messages?.map((message) => {
                    return <MessageComponent key={message.timeStamp} {...message}></MessageComponent>
                })}
            </Grid>
            <Grid item sm={2} justifySelf={'end'} >
                <ChatTextEditor />
            </Grid>

        </Grid>
    );
}

export default ChatMessagesView;
