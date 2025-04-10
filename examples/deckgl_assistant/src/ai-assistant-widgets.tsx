import { Deck, Widget, WidgetPlacement } from '@deck.gl/core';
import { MessageModel, UseAssistantProps } from '@openassistant/core';
import { AiAssistant, AiAssistantConfig, ConfigPanel } from '@openassistant/ui';
// import { ConfigPanel } from './config-panel';
import { createRoot } from 'react-dom/client';

/**
 * The props for the AiAssistantWidget component.
 */
export type AiAssistantWidgetProps = {
  id?: string;
  /**
   * Widget positioning within the view. Default 'top-left'.
   */
  placement?: WidgetPlacement;
  /**
   * The width of the widget.
   */
  width?: number;
  /**
   * The height of the widget.
   */
  height?: number;
  /**
   * Opacity of the widget.
   */
  opacity?: number;
  /**
   * Theme of the widget.
   */
  theme?: 'light' | 'dark';
  /**
   * Whether to show the Model config panel. The Model config panel provides an interface
   * in the chat UI for users to select the model, enter apiKey, temperature, top P, and base URL.
   * If you use the config panel, then you don't need to provide the following props:
   * - modelProvider
   * - model
   * - apiKey
   */
  showConfigPanel?: boolean;
  /**
   * The name of the assistant.
   */
  assistantName?: string;
  /**
   * The API key for the assistant.
   */
  apiKey?: string;
  /**
   * The version of the assistant.
   */
  version?: string;
  /**
   * The model provider of the assistant.
   */
  modelProvider?: string;
  /**
   * The model of the assistant.
   */
  model?: string;
  /**
   * The welcome message of the assistant.
   */
  welcomeMessage?: string;
  /**
   * The instructions of the assistant.
   */
  instructions?: string;
  /**
   * The function tools of the assistant.
   */
  functionTools?: UseAssistantProps['functions'];
  /**
   * The temperature of the assistant.
   */
  temperature?: number;
  /**
   * The top P of the assistant.
   */
  topP?: number;
  /**
   * The base URL of the assistant.
   */
  baseUrl?: string;
  /**
   * The chat endpoint of the assistant. Use it when you setup a chat endpoint service.
   */
  chatEndpoint?: string;
  /**
   * The voice endpoint of the assistant. Use it when you setup a voice endpoint service.
   */
  voiceEndpoint?: string;
};

export class AiAssistantWidget implements Widget<AiAssistantWidgetProps> {
  private root?: ReturnType<typeof createRoot>;

  id: string = 'ai-assistant-widget';
  element?: HTMLDivElement;
  deck?: Deck<any>;
  placement: WidgetPlacement = 'top-right';
  width: number = 390;
  height: number = 800;
  opacity: number = 0.8;
  theme: 'light' | 'dark' = 'light';
  showConfigPanel: boolean = true;
  assistantName: string = 'My Assistant';
  apiKey: string = '';
  version: string = 'v1';
  modelProvider: string = 'openai';
  model: string = 'gpt-4o';
  welcomeMessage: string = 'Hello, how can I help you today?';
  instructions: string = '';
  functionTools: UseAssistantProps['functions'] = [];
  historyMessages: MessageModel[] = [];
  temperature: number = 0.5;
  topP: number = 1.0;
  baseUrl: string = '';
  chatEndpoint: string = '';
  voiceEndpoint: string = '';

  constructor(options: AiAssistantWidgetProps) {
    if (options.placement) this.placement = options.placement;
    if (options.width) this.width = options.width;
    if (options.height) this.height = options.height;
    if (options.opacity) this.opacity = options.opacity;
    if (options.theme) this.theme = options.theme;
    if (options.assistantName) this.assistantName = options.assistantName;
    if (options.apiKey) this.apiKey = options.apiKey;
    if (options.version) this.version = options.version;
    if (options.modelProvider) this.modelProvider = options.modelProvider;
    if (options.model) this.model = options.model;
    if (options.welcomeMessage) this.welcomeMessage = options.welcomeMessage;
    if (options.temperature) this.temperature = options.temperature;
    if (options.topP) this.topP = options.topP;
    if (options.baseUrl) this.baseUrl = options.baseUrl;
    if (options.chatEndpoint) this.chatEndpoint = options.chatEndpoint;
    if (options.voiceEndpoint) this.voiceEndpoint = options.voiceEndpoint;
    if (options.instructions) this.instructions = options.instructions;
    if (options.functionTools) this.functionTools = options.functionTools;
    if (options.showConfigPanel) this.showConfigPanel = options.showConfigPanel;
  }

  onAdd({ deck }: { deck: Deck<any> }) {
    const el = document.createElement('div');
    el.className = 'ai-assistant-widget';
    el.style.pointerEvents = 'auto';

    // stop propagation of scroll and touch events to map (zoom, pan)
    el.addEventListener(
      'wheel',
      (e) => {
        e.stopPropagation();
      },
      { passive: false }
    );

    el.addEventListener(
      'touchstart',
      (e) => {
        e.stopPropagation();
      },
      { passive: false }
    );

    this.element = el;
    this.deck = deck;
    this.root = createRoot(el);

    this.update();

    return el;
  }

  private update() {
    const element = this.element;
    if (!element || !this.root) {
      return;
    }

    const ui = (
      <div
        className={'m-4 p-4 bg-white dark:bg-gray-800 rounded-lg'}
        style={{
          width: `${this.width}px`,
          height: `${this.height}px`,
          opacity: this.opacity,
        }}
      >
        <AiAssistant
          name={this.assistantName}
          apiKey={this.apiKey}
          version={this.version}
          modelProvider={this.modelProvider}
          model={this.model}
          welcomeMessage={this.welcomeMessage}
          instructions={this.instructions}
          functions={this.functionTools}
          temperature={this.temperature}
          topP={this.topP}
          baseUrl={this.baseUrl}
          enableVoice={true}
          chatEndpoint={this.chatEndpoint}
          voiceEndpoint={this.voiceEndpoint}
          theme={this.theme}
          historyMessages={
            this.showConfigPanel
              ? [
                  {
                    message: this.welcomeMessage,
                    direction: 'incoming',
                    position: 'single',
                  },
                  {
                    message:
                      'Please select your prefered LLM model and use your API key to start the chat.',
                    direction: 'incoming',
                    position: 'single',
                    payload: (
                      <div className="mt-4">
                        <ConfigPanel
                          initialConfig={{
                            isReady: true,
                            provider: this.modelProvider as 'openai' | 'deepseek' | 'google' | 'ollama',
                            model: this.model,
                            apiKey: this.apiKey,
                            temperature: this.temperature,
                            topP: this.topP,
                          }}
                          onConfigChange={(config: AiAssistantConfig) => {
                            this.modelProvider = config.provider;
                            this.model = config.model;
                            this.apiKey = config.apiKey;
                            this.temperature = config.temperature;
                            this.topP = config.topP;
                            this.baseUrl = config.baseUrl || '';
                            this.update();
                          }}
                        />
                      </div>
                    ),
                  },
                ]
              : []
          }
        />
      </div>
    );

    this.root.render(ui);
  }
}
