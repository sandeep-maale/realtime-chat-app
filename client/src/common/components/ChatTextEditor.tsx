import { useState } from 'react';
import chatTextEditorStyles from './ChatTextEditor.module.scss'; // Import the SCSS module
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import TextDecreaseIcon from '@mui/icons-material/TextDecrease';
import { Stack, IconButton, CardActions, CardContent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppState, setMessages } from '../../redux/store';
import axios from 'axios';
import config from '../../config';
import dayjs from 'dayjs';
import Cookies from 'universal-cookie';

function ChatTextEditor() {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const currentChatRoom = useSelector((state: AppState) => state.currentChatRoom?.chatRoom || null);
  const dispatch = useDispatch();
  const cookies = new Cookies();

  const textStyle = {
    fontWeight: isBold ? 'bold' : 'normal',
    fontStyle: isItalic ? 'italic' : 'normal',
    textDecoration: isUnderline ? 'underline' : 'none',
    fontSize: fontSize + 'px',
    flex: 1
  };

  const handleBoldClick = () => {
    setIsBold(!isBold);
  };

  const handleItalicClick = () => {
    setIsItalic(!isItalic);
  };

  const handleUnderlineClick = () => {
    setIsUnderline(!isUnderline);
  };
  const handleIncreaseFontSizeClick = () => {
    setFontSize((prevState) => {
      return prevState + 4;
    });
  };
  const handleDecreaseFontSizeClick = () => {
    setFontSize((prevState) => {
      return prevState - 4;
    });
  };

  const handleMessageKey = async (e: any) => {
    if (e.keyCode === 13 && !e.shiftKey && e.target.innerText.trim().length >0) {
      if (cookies && cookies.get('user') && cookies.get('user').email.length > 0) {
        const message = e.target.innerText;
        if (message && message.length > 0 && currentChatRoom && currentChatRoom.roomId) {
          e.target.innerText = '';

          // Create message 
          await axios.post(`${config.serviceUrl}/messages`, {
            message: message, user: {...cookies.get('user')}, roomId: currentChatRoom.roomId, timeStamp: dayjs().valueOf(), style: textStyle
          })
            .then(response => {
              if (response?.data.length > 0) {
                dispatch(setMessages(
                  [...response.data]
                ))
              }
            })
            .catch(error => {
              console.error('Error while creating users,', error);
            });
        }
      }
    }
  }

  return (
    <div className={chatTextEditorStyles.chatTextEditorContainer}>
      <CardActions className={chatTextEditorStyles.chatActions}>
        <Stack direction="row">
          <IconButton aria-label="bold" title='Bold' color={isBold ? 'primary' : 'default'} onClick={handleBoldClick}>
            <FormatBoldIcon />
          </IconButton>
          <IconButton aria-label="italic" title="italic" color={isItalic ? 'primary' : 'default'} onClick={handleItalicClick}>
            <FormatItalicIcon />
          </IconButton>
          <IconButton aria-label="underline" title="underline" color={isUnderline ? 'primary' : 'default'} onClick={handleUnderlineClick}>
            <FormatUnderlinedIcon />
          </IconButton>
          <IconButton aria-label="decrease font size" title="Decrease font size" onClick={handleDecreaseFontSizeClick} disabled={fontSize <= 12}>
            <TextDecreaseIcon />
          </IconButton>
          <IconButton aria-label="increase font size" title="Increase font size" onClick={handleIncreaseFontSizeClick} disabled={fontSize >= 24}>
            <TextIncreaseIcon />
          </IconButton>
        </Stack>
      </CardActions>
      <CardContent className={chatTextEditorStyles.chatTextArea}>
        <div id="messageEditor" contentEditable="true" data-placeholder={'Enter message here...'} className={chatTextEditorStyles.textBox} onKeyDown={(e) => { handleMessageKey(e) }} style={textStyle}>
        </div>
      </CardContent>
    </div>
  );
}

export default ChatTextEditor;
