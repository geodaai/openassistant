import { ChatOpenAI, OpenAIClient } from '@langchain/openai';
import { LangChainAssistant } from './langchain';
import { SystemMessage } from '@langchain/core/messages';
import { AudioToTextProps } from '../types';

export class DeepSeekAssistant extends LangChainAssistant {
  protected aiModel: ChatOpenAI;

  protected openAIClient: OpenAIClient;

  protected static instance: DeepSeekAssistant | null = null;

  private constructor() {
    super();

    // Initialize openai instance
    this.aiModel = new ChatOpenAI({
      model: DeepSeekAssistant.model,
      apiKey: DeepSeekAssistant.apiKey,
      configuration: {
        baseURL: 'https://api.deepseek.com/v1',
        defaultHeaders: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DeepSeekAssistant.apiKey}`,
        },
      },
    });

    // add system message from instructions
    this.messages.push(new SystemMessage(DeepSeekAssistant.instructions));

    // bind tools, NOTE: can't use bind() here, it will cause error
    this.llm = this.aiModel.bindTools(DeepSeekAssistant.tools);

    // initialize openAI client
    this.openAIClient = new OpenAIClient({
      apiKey: DeepSeekAssistant.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  public static async getInstance(): Promise<DeepSeekAssistant> {
    if (DeepSeekAssistant.instance === null) {
      DeepSeekAssistant.instance = new DeepSeekAssistant();
    }
    return DeepSeekAssistant.instance;
  }

  public override restart() {
    super.restart();
    // need to reset the instance so getInstance doesn't return the same instance
    DeepSeekAssistant.instance = null;
  }

  public override async audioToText({
    audioBlob,
  }: AudioToTextProps): Promise<string> {
    if (this.openAIClient === null) {
      throw new Error('DeepSeekClient is not initialized');
    }
    if (!audioBlob) {
      throw new Error('audioBlob is null');
    }
    if (!this.abortController) {
      this.abortController = new AbortController();
    }
    // create File from the audioBlob
    const file = new File([audioBlob], 'audio.webm');

    const transcriptionResponse =
      await this.openAIClient.audio.transcriptions.create(
        {
          file,
          model: 'whisper-1',
        },
        {
          signal: this.abortController.signal,
        }
      );

    return transcriptionResponse.text;
  }
}
