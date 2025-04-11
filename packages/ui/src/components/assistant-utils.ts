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

  // add incoming message to show typing indicator for chatbot
  setMessages([
    ...updatedMesssages,
    {
      message: '',
      direction: 'incoming',
      sender: 'assistant',
      position: 'normal',
      messageContent: {
        reasoning: '',
        toolCallMessages: [],
        text: '',
      },
    },
  ]);

  
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
        const newMessages: MessageModel[] = [
          ...updatedMesssages,
          {
            message: deltaMessage,
            direction: 'incoming',
            sender: 'assistant',
            position: 'normal',
            payload: customMessage,
            messageContent: message,
          }
        ];
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
    setTypingIndicator(false);
    const newMessages: MessageModel[] = [
      ...updatedMesssages,
      {
        message: 'Error occured while processing the request. ' + error,
        direction: 'incoming',
        sender: 'error',
        position: 'normal',
      },
    ];
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
    },
  ];
  // add incoming message to show typing indicator for chatbot
  setMessages([
    ...updatedMesssages,
    {
      message: '',
      direction: 'incoming',
      sender: 'assistant',
      position: 'normal',
    },
  ]);

  // send message to AI model
  try {
    // send message to AI model
    await sendImageMessage({
      message: newMessage,
      imageBase64String,
      streamMessageCallback: ({ deltaMessage, customMessage, isCompleted }) => {
        // update the last message with the response
        const newMessages: MessageModel[] = [
          ...updatedMesssages,
          {
            message: deltaMessage,
            direction: 'incoming',
            sender: 'assistant',
            position: 'normal',
            payload: customMessage,
          },
        ];
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
    setTypingIndicator(false);
    const newMessages: MessageModel[] = [
      ...updatedMesssages,
      {
        message:
          'Error occured while processing the request. Details: ' + error,
        direction: 'incoming',
        sender: 'error',
        position: 'normal',
      },
    ];
    setMessages(newMessages);
    if (onMessagesUpdated) {
      onMessagesUpdated(newMessages);
    }
  }
}
