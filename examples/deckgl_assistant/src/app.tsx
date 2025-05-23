import { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { FullscreenWidget } from '@deck.gl/widgets';

import { Map } from 'react-map-gl/maplibre';
import '@deck.gl/widgets/stylesheet.css';

import { SAMPLE_DATASETS } from './dataset';
import { AiAssistantWidget } from './ai-assistant-widgets';

import { histogram } from '@openassistant/plots';
import { localQuery } from '@openassistant/duckdb';
import { z } from 'zod';

type PointData = {
  index: number;
  longitude: number;
  latitude: number;
  revenue: number;
  population: number;
};

export function App() {
  // Add state for filtered indices
  const [filteredIndices, setFilteredIndices] = useState<number[]>([]);

  // Add state for radius multiplier
  const [radiusMultiplier, setRadiusMultiplier] = useState<number>(1);

  // Initial viewport state
  const initialViewState = {
    longitude: -98.5795, // Center of continental US
    latitude: 39.8283, // Center of continental US
    zoom: 3, // Zoomed out to show entire country
    pitch: 0,
    bearing: 0,
  };

  // Sample data point
  const data = SAMPLE_DATASETS.myVenues;

  // Add LLM instructions
  const instructions = `You are a data analyst. You can help users to analyze data including:
   - changing the radius of the points
   - filtering the points by state
   - querying the data using selected variables
   - create a histogram of the selected variable

When responding to user queries:
1. Analyze if the task requires one or multiple function calls
2. For each required function:
   - Identify the appropriate function to call
   - Determine all required parameters
   - If parameters are missing, ask the user to provide them
   - Please ask the user to confirm the parameters
   - If the user doesn't agree, try to provide variable functions to the user
   - Execute functions in a sequential order
3. For SQL query, please help to generate select query clause using the content of the dataset:
   - please use double quotes for table name
   - please only use the columns that are in the dataset context
   - please try to use the aggregate functions if possible

Please use the following data context to answer the user's question:
Dataset Name: myVenues
Fields:
- index
- location
- longitude
- latitude
- revenue
- population
  `;

  function highlightPoints(indices: number[]) {
    // highlight the points
    setFilteredIndices(indices);
  }

  // Define LLM tools
  const functionTools = {
    histogram: {
      ...histogram,
      context: {
        getValues: (datasetName: string, variableName: string) => {
          const dataset = SAMPLE_DATASETS[datasetName];
          return dataset.map((item) => item[variableName]);
        },
        onSelected: (datasetName: string, selectedIndices: number[]) => {
          console.log(datasetName, selectedIndices);
          setFilteredIndices([...selectedIndices]);
        },
        config: { isDraggable: true, theme: 'light' },
      },
    },
    localQuery: {
      ...localQuery,
      context: {
        getValues: (datasetName, variableName) => {
          const dataset = SAMPLE_DATASETS[datasetName];
          return dataset.map((row) => row[variableName]);
        },
        config: { isDraggable: true },
      },
    },
    radius: {
      description: 'Change the radius of the points',
      parameters: z.object({
        radiusMultiplier: z.number(),
      }),
      execute: async ({ radiusMultiplier }) => {
        console.log('changeRadius', radiusMultiplier);
        setRadiusMultiplier(radiusMultiplier);
        return {
          llmResult: {
            success: true,
            result: `Radius multiplier set to ${radiusMultiplier}`,
          },
        };
      },
    },
    filterByState: {
      description: 'Filter points by state',
      parameters: z.object({
        state: z.string(),
        boundingBox: z.array(z.number()),
      }),
      execute: async ({ state, boundingBox }, options) => {
        const { filterByStateCallbackFunctionContext } = options.context;
        const { points } = filterByStateCallbackFunctionContext();

        // get the index of the points that fits inside the bounding box
        const filteredIndices = points
          .filter((point) => {
            const isInside =
              point.longitude >= boundingBox[0] &&
              point.longitude <= boundingBox[2] &&
              point.latitude >= boundingBox[1] &&
              point.latitude <= boundingBox[3];
            return isInside;
          })
          .map((point) => point.index);

        // highlight the filtered points
        highlightPoints(filteredIndices);

        return {
          llmResult: {
            type: 'success',
            result: `${filteredIndices.length} points are filtered by state ${state} and bounding box ${boundingBox}`,
          },
        };
      },
    },
  };

  // Create a scatterplot layer with key prop for forcing updates
  const layers = [
    new ScatterplotLayer<PointData>({
      id: 'scatter-plot',
      data,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 1,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      getPosition: (d: PointData) => [d.longitude, d.latitude],
      getRadius: (d: PointData) => (d.revenue / 200) * radiusMultiplier,
      getFillColor: (d: PointData) => {
        return filteredIndices.includes(d.index) ? [255, 0, 0] : [0, 0, 255];
      },
      getLineColor: [0, 0, 0],
      updateTriggers: {
        getFillColor: [filteredIndices],
        getRadius: [radiusMultiplier],
      },
    }),
  ];

  const mapStyle =
    'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';

  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="deckgl h-full w-full">
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          layers={layers}
          style={{ position: 'relative' }}
          widgets={[
            new FullscreenWidget({
              placement: 'top-right',
              opacity: 0.8,
            }),
            new AiAssistantWidget({
              modelProvider: 'openai',
              model: 'gpt-4o',
              apiKey: process.env.OPENAI_API_KEY || '',
              welcomeMessage: 'Hello, how can I help you today?',
              instructions,
              tools: functionTools,
            }),
          ]}
        >
          <Map reuseMaps mapStyle={mapStyle} />
        </DeckGL>
      </div>
    </div>
  );
}
