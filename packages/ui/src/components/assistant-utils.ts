import {
  MessageModel,
  SendImageMessageProps,
  SendTextMessageProps,
  StreamMessage,
} from '@openassistant/core';
import React, { ReactNode } from 'react';

export type SendTextMessageHandlerProps = {
  newMessage: string;
  messages: MessageModel[];
  setMessages: (value: React.SetStateAction<MessageModel[]>) => void;
  setTypingIndicator: (value: React.SetStateAction<boolean>) => void;
  sendTextMessage: (props: SendTextMessageProps) => Promise<void>;
  onMessagesUpdated?: (messages: MessageModel[]) => void;
  onToolFinished?: (toolCallId: string, additionalData: unknown) => void;
};

export async function sendTextMessageHandler({
  newMessage,
  messages,
  setMessages,
  setTypingIndicator,
  sendTextMessage,
  onMessagesUpdated,
  onToolFinished,
}: SendTextMessageHandlerProps) {
  // set prompting to true, to show typing indicator
  setTypingIndicator(true);

  // add outgoing user input message
  const updatedMesssages: MessageModel[] = [
    ...messages,
    {
      direction: 'outgoing',
      sender: 'user',
      position: 'normal',
      messageContent: {
        parts: [
          {
            type: 'text',
            text: newMessage,
          },
        ],
      },
    },
  ];

  // add empty incoming message
  let lastMessage: MessageModel = {
    direction: 'incoming',
    sender: 'assistant',
    position: 'normal',
    messageContent: { parts: [] },
  };

  // add incoming message to show typing indicator for chatbot
  setMessages([...updatedMesssages, lastMessage]);

  try {
    // send message to AI model
    await sendTextMessage({
      message: newMessage,
      onToolFinished,
      streamMessageCallback: ({ customMessage, isCompleted, message }) => {
        // update the last message with the response
        lastMessage = {
          ...lastMessage,
          payload: customMessage,
          messageContent: message || { parts: [] },
        };
        const newMessages: MessageModel[] = [...updatedMesssages, lastMessage];
        setMessages(newMessages);

        // when the message is completed, set typing indicator to false
        if (isCompleted) {
          setTypingIndicator(false);
          // call the onMessagesUpdated callback if it is provided
          if (onMessagesUpdated) {
            onMessagesUpdated(newMessages);
          }
          // check if the message is empty
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.messageContent?.parts?.length === 0) {
            lastMessage.messageContent.parts = [
              {
                type: 'text',
                text: 'Sorry, AI has not provided any response. Please try again.',
              },
            ];
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
      direction: 'outgoing',
      sender: 'user',
      position: 'normal',
      payload: imageBase64String,
      messageContent: {
        parts: [
          {
            type: 'text',
            text: newMessage,
          },
        ],
      },
    },
  ];
  // add incoming message to show typing indicator for chatbot
  let lastMessage: MessageModel = {
    direction: 'incoming',
    sender: 'assistant',
    position: 'normal',
    messageContent: { parts: [] },
  };
  setMessages([...updatedMesssages, lastMessage]);

  // send message to AI model
  try {
    // send message to AI model
    await sendImageMessage({
      message: newMessage,
      imageBase64String,
      streamMessageCallback: ({ customMessage, isCompleted, message }) => {
        // update the last message with the response
        lastMessage = {
          ...lastMessage,
          payload: customMessage,
          messageContent: message || { parts: [] },
        };
        const newMessages = [...updatedMesssages, lastMessage];
        setMessages(newMessages);
        if (isCompleted) {
          setTypingIndicator(false);
          if (onMessagesUpdated) {
            onMessagesUpdated(newMessages);
          }
          // check if the message is empty
          // check if the message is empty
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage?.messageContent?.parts?.length === 0) {
            lastMessage.messageContent.parts = [
              {
                type: 'text',
                text: 'Sorry, AI has not provided any response. Please check if image prompt is supported by the selected AI model.',
              },
            ];
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

export function createWelcomeMessage(
  welcomeMessage: string | ReactNode
): StreamMessage {
  if (typeof welcomeMessage === 'string') {
    return {
      parts: [{ type: 'text', text: welcomeMessage }],
    };
  }
  return {
    parts: [{ type: 'text', text: '' }],
  };
}
