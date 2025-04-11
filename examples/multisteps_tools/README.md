# Multistep Tools Example

This example demonstrates how to use multistep tools with OpenAssistant, showcasing a weather information system that combines multiple steps to provide comprehensive weather data.

## Features

- Demonstrates the use of multistep tools in OpenAssistant
- Shows how to combine multiple data sources (weather stations and temperature data)
- Implements a custom UI component for displaying weather information
- Uses context-aware tool execution

## Implementation Details

The example implements a weather information system that:
1. Takes a city name as input
2. Retrieves the corresponding weather station ID
3. Fetches the current temperature
4. Displays the information in a custom UI component

The main components include:
- A weather station lookup function
- A temperature lookup function
- A custom WeatherStation component for displaying the data
- Integration with OpenAssistant's AI interface

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to `.env`

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open the application in your browser
2. Interact with the AI assistant
3. Ask for weather information for supported cities (New York, Los Angeles, Chicago)
4. The assistant will use the multistep tools to gather and display the information

## Note

This is a demonstration example using mock data. In a production environment, you would want to connect to real weather APIs and implement proper error handling.




