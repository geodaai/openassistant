// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { useState, useEffect } from 'react';
import { Feature, FeatureCollection } from 'geojson';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export type LeafletOutputData = {
  geoJsonData: FeatureCollection;
  mapBounds: [[number, number], [number, number]];
  zoom: number;
  colorBy?: string;
  colorType?: 'breaks' | 'unique';
  breaks?: number[];
  colors?: string[];
  uniqueValues?: (string | number)[];
  id?: string;
  theme?: string;
  showMore?: boolean;
  isExpanded?: boolean;
  isDraggable?: boolean;
};

export function isLeafletOutputData(data: unknown): data is LeafletOutputData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'geoJsonData' in data &&
    'mapBounds' in data
  );
}

// export function LeafletMapComponentContainer(props: LeafletOutputData) {
//   const [isExpanded, setIsExpanded] = useState(props.isExpanded);

//   const id = props.id || generateId();

//   const onDragStart = useDraggable({
//     id,
//     type: 'leaflet',
//     data: props,
//   });

//   const onExpanded = (flag: boolean) => {
//     setIsExpanded(flag);
//   };

//   return (
//     <ExpandableContainer
//       defaultWidth={isExpanded ? 600 : undefined}
//       defaultHeight={isExpanded ? 600 : 400}
//       draggable={props.isDraggable || false}
//       onDragStart={onDragStart}
//       onExpanded={onExpanded}
//     >
//       <LeafletMapComponent {...props} />
//     </ExpandableContainer>
//   );
// }

// Style variables
const styles = {
  container: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
  },
  legend: {
    position: 'absolute' as const,
    bottom: '1rem',
    right: '1rem',
    backgroundColor: 'white',
    padding: '0.5rem',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  legendTitle: {
    fontSize: '0.875rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  },
  legendItems: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
  },
  legendColor: {
    width: '1rem',
    height: '1rem',
    marginRight: '0.5rem',
  },
  legendLabel: {
    fontSize: '0.75rem',
  },
};

function Legend({
  breaks,
  colors,
  colorType,
  uniqueValues,
}: {
  breaks?: number[];
  colors: string[];
  colorType: 'breaks' | 'unique';
  uniqueValues?: (string | number)[];
}) {
  return (
    <div style={styles.legend}>
      <div style={styles.legendTitle}>Legend</div>
      <div style={styles.legendItems}>
        {colorType === 'breaks' && breaks
          ? breaks.map((breakValue, index) => (
              <div key={index} style={styles.legendItem}>
                <div
                  style={{
                    ...styles.legendColor,
                    backgroundColor: colors[index],
                  }}
                />
                <span style={styles.legendLabel}>
                  {index === 0
                    ? `≤ ${breakValue}`
                    : index === breaks.length - 1
                      ? `> ${breaks[index - 1]}`
                      : `${breaks[index - 1]} - ${breakValue}`}
                </span>
              </div>
            ))
          : colorType === 'unique' && uniqueValues
            ? uniqueValues.map((value, index) => (
                <div key={index} style={styles.legendItem}>
                  <div
                    style={{
                      ...styles.legendColor,
                      backgroundColor: colors[index],
                    }}
                  />
                  <span style={styles.legendLabel}>{value}</span>
                </div>
              ))
            : null}
      </div>
    </div>
  );
}

export function LeafletMapComponent(props: LeafletOutputData) {
  const [isMounted, setIsMounted] = useState(false);
  const {
    geoJsonData,
    mapBounds,
    zoom,
    colorBy,
    colorType,
    breaks,
    colors,
    uniqueValues,
  } = props;

  // get center from mapBounds
  const center: [number, number] = [
    (mapBounds[0][0] + mapBounds[1][0]) / 2,
    (mapBounds[0][1] + mapBounds[1][1]) / 2,
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // create a function to get color by colorBy and colorType
  const getColor = (f: Feature) => {
    try {
      if (colorBy && f.properties && colorBy in f.properties) {
        if (colorType === 'breaks' && breaks && colors) {
          const propertyValue = f.properties![colorBy];
          let left = 0;
          let right = breaks.length - 1;

          // Binary search to find the correct interval
          while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (propertyValue <= breaks[mid]) {
              right = mid - 1;
            } else {
              left = mid + 1;
            }
          }

          const breakIndex = Math.max(0, left - 1);
          // Ensure breakIndex is within valid range of colors array
          if (breakIndex >= 0 && breakIndex < colors.length) {
            return colors[breakIndex];
          }
          // Return default color if no valid break is found
          return '#3388ff';
        } else if (colorType === 'unique' && uniqueValues && colors) {
          const propertyValue = f.properties![colorBy] as string | number;
          const index = uniqueValues.indexOf(propertyValue);
          const color = colors[index];
          return color || '#3388ff';
        }
      }
    } catch (error) {
      console.error(error);
    }
    return '#3388ff';
  };

  // Helper function to get top 4 properties for tooltip
  const getTooltipContent = (feature: Feature) => {
    if (!feature.properties) return '';

    let tooltipContent = '';

    // Add colorBy value at the top if it exists
    if (colorBy && feature.properties[colorBy] !== undefined) {
      tooltipContent += `${colorBy}: ${feature.properties[colorBy]}<br/>`;
    }

    // Add other properties
    const properties = Object.entries(feature.properties)
      .filter(([key]) => key !== colorBy) // Exclude colorBy since we already added it
      .slice(0, 7) // Reduced to 7 since we might add colorBy
      .map(([key, value]) => `${key}: ${value}`)
      .join('<br/>');

    return tooltipContent + properties;
  };

  const style = (feature: Feature | undefined) => {
    if (!feature) {
      return {};
    }

    const geometryType = feature.geometry.type;
    const baseStyle = {
      weight: 1,
      opacity: 1,
      color: getColor(feature),
      fillOpacity: 0.7,
    };

    switch (geometryType) {
      case 'Point':
        return {
          ...baseStyle,
          radius: 6,
          fillColor: getColor(feature),
        };
      case 'LineString':
      case 'MultiLineString':
        return {
          ...baseStyle,
          weight: 3,
        };
      case 'Polygon':
      case 'MultiPolygon':
        return baseStyle;
      default:
        return baseStyle;
    }
  };

  const pointToLayer = (feature: Feature, latlng: L.LatLng) => {
    const marker = L.circleMarker(latlng, {
      radius: 6,
      fillColor: getColor(feature),
      color: '#3388ff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7,
    });

    if (feature.properties) {
      marker.bindTooltip(getTooltipContent(feature), {
        sticky: true,
        direction: 'top',
      });
    }

    return marker;
  };

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    if (feature.properties) {
      layer.bindTooltip(getTooltipContent(feature), {
        sticky: true,
        direction: 'top',
      });
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div
      style={{
        resize: 'both',
        overflow: 'auto',
        width: '100%',
        height: '300px',
      }}
    >
      <div style={styles.container}>
        <MapContainer
          center={center}
          zoom={zoom}
          maxBounds={props.mapBounds}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          <GeoJSON
            data={geoJsonData}
            style={style}
            pointToLayer={pointToLayer}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
        {colorBy && colorType && colors && (
          <Legend
            breaks={breaks}
            colors={colors}
            colorType={colorType}
            uniqueValues={uniqueValues}
          />
        )}
      </div>
    </div>
  );
}
