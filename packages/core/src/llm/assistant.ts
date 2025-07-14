// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AudioToTextProps,
  ProcessImageMessageProps,
  ProcessMessageProps,
  RegisterToolProps,
} from '../types';

export abstract class AbstractAssistant {
  /**
   * Get instance using singleton pattern
   */
  public static async getInstance(): Promise<AbstractAssistant> {
    throw new Error('Method not implemented.');
  }

  /**
   * Configure the LLM instance
   */
  public static configure(props: { model: string; apiKey: string }) {
    throw new Error('Method not implemented.');
  }

  /**
   * Close the LLM instance
   */
  public async close() {
    throw new Error('Method not implemented.');
  }

  /**
   * Stop processing
   */
  public stop() {
    throw new Error('Method not implemented.');
  }

  /**
   * Restart the chat
   */
  public restart() {
    throw new Error('Method not implemented.');
  }

  /**
   * Process image message
   */
  public async processImageMessage(props: ProcessImageMessageProps) {
    throw new Error('Method not implemented.');
  }

  /**
   * Voice to text
   */
  public async translateVoiceToText(audioBlob: Blob): Promise<string> {
    throw new Error('Method not implemented.');
  }

  /**
   * Process text message
   */
  public async processTextMessage(
    props: ProcessMessageProps
  ): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  public static registerTool(props: RegisterToolProps) {
    throw new Error('Method not implemented.');
  }

  /**
   * audio to text
   */
  public async audioToText(props: AudioToTextProps): Promise<string> {
    throw new Error('Method not implemented.');
  }

  /**
   * Test connection
   */
  public static async testConnection(
    apiKey: string,
    model: string
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /**
   * One time prompt without saving the conversation
   */
  public async temporaryPrompt(props: {
    prompt: string;
    temperature?: number;
  }): Promise<string> {
    throw new Error('Method not implemented.');
  }

  public static getToolResults() {
    throw new Error('Method not implemented.');
  }
}
