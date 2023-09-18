# Chatbot

**Project Description:** Chatbot is a realtime chat application that provides uses to register, login, create chat rooms, join chat rooms and exchange messages in the chat room.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Enhancements](#enhancements)

## Installation

**(Provide instructions on how to install your project)**

```bash
# Clone the repository
git clone git@github.com:sandeep-maale/realtime-chat-app.git

# Navigate to the project directory
cd realtime-chat-app

# run build-and-run.sh shell script to build client server containers and run those along with mongoDB container.
run build-and-run.sh

```

## Usage
```
After successfully running the above command it should spin below 3 containers 
    Client/UI - localhost:3000
    Server/API - localhost:9000
    MondoDB container - localhost:27017

Please follow the demo video for more details here: https://github.com/sandeep-maale/realtime-chat-app/blob/master/Demo.mov
```


## Features
```
- User Registration
    - User should be able to register into the system and login with all the form validations.
- Real-Time Chat
    - User authentication: Users can sign in with a username and password.
    - Multiple chat rooms: Users can join or create chat rooms.
    - Real-time messaging: Messages sent by users in a chat room are displayed in real-time to all participants.
    - Message formatting: Users can send messages with basic formatting (bold, italic, etc.) using a custom syntax.
    - Message history: Display the chat message history for a room when a user joins.
    - User presence: Show a list of users currently online in a chat room.
```

## Enhancements
``` 
Future enhancements.
- socket.io - Implement pub/sub model for notifications and better app performance and scaling.
```