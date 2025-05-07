import {
  MessageModel,
  SendImageMessageProps,
  SendTextMessageProps,
} from '@openassistant/core';
import React from 'react';

export type SendTextMessageHandlerProps = {
  newMessage: string;
  messages: MessageModel[];
  setMessages: (value: React.SetStateAction<MessageModel[]>) => void;
  setTypingIndicator: (value: React.SetStateAction<boolean>) => void;
  sendTextMessage: (props: SendTextMessageProps) => Promise<void>;
  onMessagesUpdated?: (messages: MessageModel[]) => void;
};

export async function sendTextMessageHandler({
  newMessage,
  messages,
  setMessages,
  setTypingIndicator,
  sendTextMessage,
  onMessagesUpdated,
}: SendTextMessageHandlerProps) {
  // set prompting to true, to show typing indicator
  setTypingIndicator(true);

  // add outgoing user input message
  const updatedMesssages: MessageModel[] = [
    ...messages,
    {
      message: newMessage,
      direction: 'outgoing',
      sender: 'user',
      position: 'normal',
      messageContent: {
        reasoning: '',
        toolCallMessages: [],
        text: newMessage,
      },
    },
  ];

  let lastMessage: MessageModel = {
    message: '',
    direction: 'incoming',
    sender: 'assistant',
    position: 'normal',
    messageContent: {
      reasoning: '',
      toolCallMessages: [],
      text: '',
      parts: [],
    },
  };

  // add incoming message to show typing indicator for chatbot
  setMessages([...updatedMesssages, lastMessage]);

  // send message to AI model
  try {
    // send message to AI model
    await sendTextMessage({
      message: newMessage,
      streamMessageCallback: ({
        deltaMessage,
        customMessage,
        isCompleted,
        message,
      }) => {
        // update the last message with the response
        lastMessage = {
          message: deltaMessage,
          direction: 'incoming',
          sender: 'assistant',
          position: 'normal',
          payload: customMessage,
          messageContent: message,
        };
        const newMessages: MessageModel[] = [...updatedMesssages, lastMessage];
        setMessages(newMessages);
        if (isCompleted) {
          // when the message is completed, set typing indicator to false
          setTypingIndicator(false);
          if (onMessagesUpdated) {
            onMessagesUpdated(newMessages);
          }
          // check if the message is empty
          if (newMessages[newMessages.length - 1]?.message?.length === 0) {
            newMessages[newMessages.length - 1].message = '...';
          }
        }
      },
    });
  } catch (error) {
    console.error(error);
    setTypingIndicator(false);
    // append errorMessage to the last message
    lastMessage.messageContent?.parts?.push({
      type: 'text',
      text: 'Error occured while processing the request. ' + error,
    });
    const newMessages: MessageModel[] = [...updatedMesssages, lastMessage];
    setMessages(newMessages);
    if (onMessagesUpdated) {
      onMessagesUpdated(newMessages);
    }
  }
}

export type SendImageMessageHandlerProps = {
  newMessage: string;
  imageBase64String: string;
  messages: MessageModel[];
  setMessages: (value: React.SetStateAction<MessageModel[]>) => void;
  setTypingIndicator: (value: React.SetStateAction<boolean>) => void;
  sendImageMessage: (props: SendImageMessageProps) => Promise<void>;
  onMessagesUpdated?: (messages: MessageModel[]) => void;
};

export async function sendImageMessageHandler({
  newMessage,
  imageBase64String,
  messages,
  setMessages,
  setTypingIndicator,
  sendImageMessage,
  onMessagesUpdated,
}: SendImageMessageHandlerProps) {
  // set prompting to true, to show typing indicator
  setTypingIndicator(true);

  // add outgoing user input message
  const updatedMesssages: MessageModel[] = [
    ...messages,
    {
      message: newMessage,
      direction: 'outgoing',
      sender: 'user',
      position: 'normal',
      payload: imageBase64String,
      messageContent: {
        reasoning: '',
        toolCallMessages: [],
        text: newMessage,
      },
    },
  ];
  // add incoming message to show typing indicator for chatbot
  let lastMessage: MessageModel = {
    message: '',
    direction: 'incoming',
    sender: 'assistant',
    position: 'normal',
    messageContent: {
      reasoning: '',
      toolCallMessages: [],
      text: '',
    },
  };
  setMessages([...updatedMesssages, lastMessage]);

  // send message to AI model
  try {
    // send message to AI model
    await sendImageMessage({
      message: newMessage,
      imageBase64String,
      streamMessageCallback: ({
        deltaMessage,
        customMessage,
        isCompleted,
        message,
      }) => {
        // update the last message with the response
        lastMessage = {
          message: deltaMessage,
          direction: 'incoming',
          sender: 'assistant',
          position: 'normal',
          payload: customMessage,
          messageContent: message,
        };
        const newMessages = [...updatedMesssages, lastMessage];
        setMessages(newMessages);
        if (isCompleted) {
          setTypingIndicator(false);
          if (onMessagesUpdated) {
            onMessagesUpdated(newMessages);
          }
          // check if the message is empty
          if (newMessages[newMessages.length - 1]?.message?.length === 0) {
            newMessages[newMessages.length - 1].message =
              'Sorry, AI has not provided any response. Please check if image prompt is supported by the selected AI model.';
          }
        }
      },
    });
  } catch (error) {
    console.error(error);
    setTypingIndicator(false);
    // append errorMessage to the last message
    lastMessage.messageContent?.parts?.push({
      type: 'text',
      text: 'Error occured while processing the request. ' + error,
    });
    const newMessages: MessageModel[] = [...updatedMesssages, lastMessage];
    setMessages(newMessages);
    if (onMessagesUpdated) {
      onMessagesUpdated(newMessages);
    }
  }
}
