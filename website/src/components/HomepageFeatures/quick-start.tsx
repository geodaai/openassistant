export function QuickStart() {
  return (
    <div className="w-10/12 mt-10 flex flex-col p-4 gap-4">
      <div className="text-gray-600 font-bold leading-[1.2] tracking-tighter sm:text-[36px]">
        <div className="bg-hero-section-title bg-clip-text">Quick Start</div>
      </div>
      <div className="max-w-[1400px]">
        <>
          {/* Introduction Section */}
          <div className="mb-8">
            <div className="text-amber-500 font-semibold mb-2">
              Note: This feature is currently undergoing development. Stay tuned
              for updates!
            </div>
            <p className="mb-4">
              OpenAssistant is not only a LLM based chatbot, it is engineered to
              help users analyzing their data by levaraging the existing
              functions and tools in your application. OpenAssistant provides a
              new way that allows users to interact with your application in a
              more natural and creative way. See a demo below:
            </p>
            <video
              className="w-full rounded-lg mb-4"
              controls
              src="https://location.foursquare.com/wp-content/uploads/sites/2/2025/01/kepler-gl-ai-assistant_7f53ec.mp4"
            />
            <p className="text-gray-500 mb-4">
              Kepler.gl AI Assistant is powered by OpenAssistant.
            </p>
          </div>

          {/* Supported Providers Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Supported AI Providers</h2>
            <p className="mb-4">
              The following providers and models are currently supported.
            </p>
            <p className="text-amber-500 mb-4">
              Note: we are working on feature to allow users specify their own
              providers, models and base URL.
            </p>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Provider</th>
                    <th className="border p-2">Models</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2 font-semibold">OpenAI</td>
                    <td className="border p-2">
                      gpt-4o, gpt-4o-mini, gpt-3.5-turbo, gpt-3.5-turbo-0125,
                      o1-mini, o1-preview
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Google</td>
                    <td className="border p-2">
                      gemini-2.0-flash-exp, gemini-1.5-flash, gemini-1.5-pro,
                      gemini-1.0-pro
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">Ollama (local)</td>
                    <td className="border p-2">
                      deepseek-r1, phi4, phi3.5, qwen2.5-coder, qwen2, qawa,
                      llava, mistral, gemma2, llama3.3, llama3.2, llama3.1,
                      llama3.1:70b
                    </td>
                  </tr>
                  <tr>
                    <td className="border p-2 font-semibold">DeepSeek</td>
                    <td className="border p-2">
                      deepseek-chat, deepseek-reasoner
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Built-in Features</h2>
            <ul className="list-disc ml-6 mb-4">
              <li>
                Take screenshot to ask{' '}
                <a
                  href="https://geoda.ai/img/highlight-screenshot.mp4"
                  className="text-blue-500"
                >
                  [Demo]
                </a>
              </li>
              <li>
                Talk to ask{' '}
                <a
                  href="https://geoda.ai/img/highlight-ai-talk.mp4"
                  className="text-blue-500"
                >
                  [Demo]
                </a>
              </li>
            </ul>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Take a Screenshot to Ask
                </h3>
                <p className="mb-4">
                  This feature enables users to capture a screenshot anywhere
                  within your application and ask questions about the
                  screenshot.
                </p>
                <p className="mb-4">
                  For example
                  <ul className="list-disc ml-6 mb-4">
                    <li>
                      users can take a screenshot of the configuration panel and
                      ask questions about how to use it, e.g.{' '}
                      <code>How can I adjust the parameters in this panel</code>
                      .
                    </li>
                    <li>
                      users can take a screenshot of the plots (e.g. in the chat
                      panel) and ask questions about the plots e.g.{' '}
                      <code>Can you give me a summary of the plot?</code>.
                    </li>
                    <li>
                      users can take a screenshot of the map (or partial of the
                      map) and ask questions about the map e.g.{' '}
                      <code>how many counties are in this screenshot</code>,
                    </li>
                  </ul>
                </p>
                <img
                  src="https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-screenshot.png"
                  alt="Screenshot to ask"
                  className="w-[400px] rounded-lg mb-4"
                />

                <h4 className="text-lg font-semibold mb-2">
                  How to use this feature?
                </h4>
                <ol className="list-decimal ml-6 mb-4">
                  <li>
                    Click the &quot;Screenshot to Ask&quot; button in the chat
                    interface
                  </li>
                  <li>
                    A semi-transparent overlay will appear, and the chat
                    interface will be disabled.
                  </li>
                  <li>Click and drag to select the area you want to capture</li>
                  <li>Release to complete the capture</li>
                  <li>
                    The screenshot will be displayed in the chat interface
                  </li>
                  <li>
                    You can click the x button on the top right corner of the
                    screenshot to delete the screenshot
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Talk to Ask</h3>
                <p className="mb-4">
                  This feature enables users to &quot;talk&quot; to the
                  OpenAssistant. After clicking the &quot;Talk to Ask&quot;
                  button, users can start talking using microphone. When
                  clicking the same button again, the AI assistant will stop
                  listening and send the transcript to the input box.
                </p>
                <p className="mb-4">
                  When using the voice-to-text feature for the first time, users
                  will be prompted to grant microphone access. The browser will
                  display a permission dialog that looks like this:
                </p>
                <img
                  src="https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-talk-to-ask.png"
                  alt="Talk to ask"
                  className="w-[400px] rounded-lg mb-4"
                />
                <p className="mb-4">
                  After granting access, users can start talking to the AI
                  assistant.
                </p>
              </div>
            </div>
          </div>

          {/* Map and Data Analysis Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Bridge Your Application with LLM using Function Tools
            </h2>
            <p className="mb-4">
              Function calling enables the OpenAssistant to perform specialized
              tasks that LLMs cannot handle directly, such as complex
              calculations, data analysis, visualization generation, and
              integration with external services. This allows the assistant to
              execute specific operations within your application while
              maintaining natural language interaction with users. For example,
              below is a process diagram to show how the AI assistant works
              within Kepler.gl:
            </p>
            <img
              src="https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-diagram.png"
              alt="AI Assistant Diagram"
              className="max-w-[800px] w-full rounded-lg mb-4"
            />
            <p className="mb-4">
              In this diagram, the AI Assistant acts as an intermediary between
              the user and the application (Kepler.gl). When a user makes a
              request, the AI Assistant:
              <ol className="list-decimal ml-6 mb-4">
                <li>
                  Processes the natural language input and determines if
                  function calls are needed
                </li>
                <li>
                  Makes API calls to the LLM for language understanding and
                  response generation
                </li>
                <li>
                  When needed, calls specific functions within Kepler.gl to:
                  <ul className="list-disc ml-6 mb-2">
                    <li>Retrieve metadata about maps, layers, and datasets</li>
                    <li>Execute data analysis operations</li>
                    <li>Update visualizations</li>
                    <li>Modify map configurations</li>
                  </ul>
                </li>
                <li>
                  Returns processed results back to the user in natural language
                </li>
              </ol>
              <p className="mb-4">
                This architecture ensures that while the LLM handles natural
                language processing, all data operations remain within your
                application&apos;s environment.
              </p>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  How to create a function tool?
                </h3>
                <p className="mb-4">
                  OpenAssistant provides great type support to help you create
                  function tools. You can create a function tool by following
                  the tutorial{' '}
                  <a
                    href="https://openassistant-doc.vercel.app/tutorial-basics/add-function-tool"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    here
                  </a>
                  .
                </p>
              </div>
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Is my data secure?</h2>
            <p className="mb-4">
              Yes, the data you used in your application stays within the
              browser, and will <b>never</b> be sent to the LLM. Using function
              tools, we can engineer the OpenAssistant to use only the meta data
              for function calling, e.g. the name of the dataset, the name of
              the layer, the name of the variables, etc.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Free AI Plugins for your application
            </h2>
            <p className="mb-4">
              We are working on a series of free AI plugins for your
              application. These plugins will allow you to integrate your
              application with LLMs and provide a more seamless experience for
              your users.
            </p>
            <p className="mb-4">
              OpenAssistant also provides plugins for function tools, which you
              can use in your application with just a few lines of code. For
              example,
              <ul className="list-disc ml-6 mb-4">
                <li>
                  the DuckDB plugin allows the AI assistant to query your data
                  using DuckDB. See a tutorial{' '}
                  <a
                    href="https://openassistant-doc.vercel.app/docs/tutorial-extras/duckdb-plugin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    here📚
                  </a>
                  .
                </li>
                <li>
                  the ECharts plugin allows the AI assistant to visualize data
                  using ECharts. See a tutorial{' '}
                  <a
                    href="https://openassistant-doc.vercel.app/docs/tutorial-extras/echarts-plugin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    here📚
                  </a>
                  .
                </li>
                <li>
                  the Kepler.gl plugin allows the AI assistant to create
                  beautiful maps. See a tutorial{' '}
                  <a
                    href="https://openassistant-doc.vercel.app/docs/tutorial-extras/keplergl-plugin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    here📚
                  </a>
                  .
                </li>
                <li>
                  the GeoDa plugin allows the AI assistant to apply spatial data
                  analysis using GeoDa. See a tutorial{' '}
                  <a
                    href="https://openassistant-doc.vercel.app/docs/tutorial-extras/geoda-plugin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    here📚
                  </a>
                  .
                </li>
              </ul>
            </p>
            <p className="mb-4">
              Note: to see our plan to add more features in our plugins, please
              check out this{' '}
              <a
                href="https://github.com/kepler-gl/kepler.gl/issues/4689"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Kepler.gl Plugin RFC
              </a>{' '}
              and the{' '}
              <a
                href="https://github.com/GeoDaCenter/openassistant/wiki/Integration-Kepler.gl---GeoDaLib"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                GeoDa Plugin RFC
              </a>
            </p>
            <div>
              <h3 className="text-xl font-semibold mb-2">eCharts Plugin</h3>
              <p className="mb-4">
                The eCharts plugin allows the AI assistant to create beautiful
                plots using eCharts. The plots created by the OpenAssistant are
                interactive, and can be used to explore the data.
              </p>
              <p className="mb-4">
                In each plot, there is a small toolbar on the top right corner,
                which contains three buttons:
                <ul className="list-disc ml-6 mb-4">
                  <li>
                    <b>Box Select</b>: Select the data in the plot.
                  </li>
                  <li>
                    <b>Keep Selection</b>: Keep the selected data in the plot.
                  </li>
                  <li>
                    <b>Clear Selection</b>: Clear the selected data in the plot.
                  </li>
                </ul>
                One can click the <b>Box Select</b> button first. Then, start
                selecting the data in the plot by left clicking the mouse and
                dragging the mouse to select the data. The selected data will be
                highlighted in the plot and also be highlighted in your
                application.
              </p>
              <div>
                <h3 className="text-lg font-semibold mb-2">Scatter Plot</h3>
                <p className="mb-4">
                  For scatter plot, the OpenAssistant will create a scatter plot
                  with a regression line by default. If users select points in
                  the plot, there will be 3 different regression lines created:
                  one for all points, one for the selected points, and one for
                  the unselected points.
                </p>
                <p className="mb-4">
                  If users click the &apos;expand&apos; button on the top right
                  corner of the plot, the plot will be expanded to a floating
                  modal dialog with more details of the regressions shown in a
                  tablt.
                </p>
                <p className="mb-4">
                  The regression details include:
                  <ul className="list-disc ml-6 mb-4">
                    <li>R-squared</li>
                    <li>Slope</li>
                    <li>Intercept</li>
                    <li>P-value</li>
                    <li>Standard Error</li>
                    <li>
                      Chow test for selected and unselected regression lines
                    </li>
                  </ul>
                </p>
                <p className="mb-4">
                  This scatter plot can help users to explore the relationship
                  between two variables, and explore the heterogeneity of the
                  data by selecting different points.
                </p>
                <img
                  src="https://4sq-studio-public.s3.us-west-2.amazonaws.com/statics/keplergl/images/kepler-ai-assistant-scatterplot.png"
                  alt="Scatterplot"
                  className="max-w-[800px] w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
