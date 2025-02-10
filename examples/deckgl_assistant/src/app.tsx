import { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer } from '@deck.gl/layers';
import { Map } from 'react-map-gl/maplibre';
import { SAMPLE_DATASETS } from './dataset';

import { AiAssistant } from '@openassistant/ui';
import { histogramFunctionDefinition } from '@openassistant/echarts';
import {
  CallbackFunctionProps,
  CustomFunctionContext,
} from '@openassistant/core';
import { queryDuckDBFunctionDefinition } from '@openassistant/duckdb';

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

  // a llm tool to change the radius of the points
  function radiusFunctionDefinition(context: CustomFunctionContext<any>) {
    return {
      name: 'radius',
      description: 'Make the radius of the points larger or smaller',
      properties: {
        radiusMultiplier: {
          type: 'number',
          description: 'The multiplier for the radius of the points',
        },
      },
      required: ['radiusMultiplier'],
      callbackFunction: async (props: CallbackFunctionProps) => {
        const { functionName, functionArgs, functionContext } = props;
        const { radiusMultiplier } = functionArgs;

        const { changeRadius } = functionContext as {
          changeRadius: (radiusMultiplier: number) => void;
        };
        changeRadius(Number(radiusMultiplier));

        return {
          type: 'success',
          name: functionName,
          result: `Radius multiplier set to ${radiusMultiplier}`,
        };
      },
      callbackFunctionContext: context,
    };
  }

  function highlightPoints(indices: number[]) {
    // highlight the points
    setFilteredIndices(indices);
  }

  const filterByStateCallbackFunctionContext = {
    points: SAMPLE_DATASETS.myVenues,
  };

  function filterByStateCallback(props) {
    const { functionArgs, functionContext } = props;
    const { state, boundingBox } = functionArgs;
    const { points } = functionContext;
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
      type: 'success',
      result: `${filteredIndices.length} points are filtered by state ${state} and bounding box ${boundingBox}`,
    };
  }

  function filterByStateFunctionDefinition(
    callbackFunction,
    callbackFunctionContext
  ) {
    return {
      name: 'filterByState',
      description: 'Filter points by state',
      properties: {
        state: {
          type: 'string',
          description: 'The state to filter by',
        },
        boundingBox: {
          type: 'array',
          description:
            'The bounding box coordinates of the state. The format is [minLongitude, minLatitude, maxLongitude, maxLatitude]. If not provided, please try to use approximate bounding box of the state.00',
          items: {
            type: 'number',
          },
        },
      },
      required: ['state'],
      callbackFunction,
      callbackFunctionContext,
    };
  }

  // Define LLM tools
  const functionTools = [
    histogramFunctionDefinition({
      getValues: (datasetName: string, variableName: string) => {
        const dataset = SAMPLE_DATASETS[datasetName];
        return dataset.map((item) => item[variableName]);
      },
      onSelected: (datasetName: string, selectedIndices: number[]) => {
        console.log(datasetName, selectedIndices);
        setFilteredIndices([...selectedIndices]);
      },
      config: { isDraggable: true, theme: 'light' },
    }),
    radiusFunctionDefinition({
      changeRadius: (radiusMultiplier: number) => {
        console.log('changeRadius', radiusMultiplier);
        setRadiusMultiplier(radiusMultiplier);
      },
    }),
    filterByStateFunctionDefinition(
      filterByStateCallback,
      filterByStateCallbackFunctionContext
    ),
    queryDuckDBFunctionDefinition({
      getValues: (datasetName, variableName) => {
        const dataset = SAMPLE_DATASETS[datasetName];
        return dataset.map((row) => row[variableName]);
      },
      config: { isDraggable: true },
    }),
  ];

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
      <div className="w-[550px] h-[800px] m-4">
        <AiAssistant
          name="My Assistant"
          apiKey="your-api-key"
          version="v1"
          modelProvider="openai"
          model="gpt-4o"
          welcomeMessage="Hello, how can I help you today?"
          instructions={instructions}
          functions={functionTools}
        />
      </div>
      <div className="deckgl h-full w-full">
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          layers={layers}
          style={{ position: 'relative' }}
        >
          <Map reuseMaps mapStyle={mapStyle} />
        </DeckGL>
      </div>
    </div>
  );
}
