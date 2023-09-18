import { Badge, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import Message from '../../models/Message';
import PersonIcon from '@mui/icons-material/Person';
import MessageStyles from './MessageComponent.module.scss'; // Import the SCSS module

function MessageComponent(props: Message) {

    return (
        <Grid container direction='row' className={MessageStyles.messageContainer}>
            <Grid direction={'row'} container className={MessageStyles.label}>
                <Badge badgeContent={''} className={MessageStyles.badge}>
                    <PersonIcon color="action" />
                </Badge>
                <Typography variant='subtitle2' className={MessageStyles.userName}>
                    <b>{props?.user?.firstName} {props?.user?.lastName}</b>
                </Typography>
                <Typography variant='subtitle2' className={MessageStyles.timeStamp}>
                    {dayjs(props.timeStamp).format('MM-DD-YYYY HH:mm:ss')}
                </Typography>
            </Grid>
            <Grid style={{ ...props.style, paddingLeft: '40px' }}>
                {props.message}
            </Grid>
        </Grid>
    );
}

export default MessageComponent;
