import React, { useState, useEffect } from 'react';
import { generateId } from '@openassistant/utils';
import { Feature, FeatureCollection } from 'geojson';
import L from 'leaflet';

import { ExpandableContainer } from '../common/expandable-container';
import { useDraggable } from '../hooks/use-draggable';

import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export type LeafletOutputData = {
  geoJsonData: FeatureCollection;
  mapBounds: [[number, number], [number, number]];
  colorBy?: string;
  colorType?: 'breaks' | 'unique';
  breaks?: number[];
  colors?: string[];
  valueColorMap?: Record<string | number, string>;
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

export function LeafletMapComponent(props: LeafletOutputData) {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const id = props.id || generateId();

  const onDragStart = useDraggable({
    id,
    type: 'leaflet',
    data: props,
  });

  const onExpanded = (flag: boolean) => {
    setIsExpanded(flag);
  };

  return (
    <ExpandableContainer
      defaultWidth={isExpanded ? 600 : undefined}
      defaultHeight={isExpanded ? 600 : 400}
      draggable={props.isDraggable || false}
      onDragStart={onDragStart}
      onExpanded={onExpanded}
    >
      <LeafletMap {...props} />
    </ExpandableContainer>
  );
}

export function LeafletMap(props: LeafletOutputData) {
  const [isMounted, setIsMounted] = useState(false);
  const {
    geoJsonData,
    mapBounds,
    colorBy,
    colorType,
    breaks,
    colors,
    valueColorMap,
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
      if (
        colorBy &&
        colors &&
        f.properties &&
        colorBy in f.properties
      ) {
        if (colorType === 'breaks' && breaks) {
          const breakIndex = breaks.findIndex(
            (breakValue) => f.properties![colorBy] <= breakValue
          );
          return colors[breakIndex];
        } else if (colorType === 'unique' && valueColorMap) {
          const color = valueColorMap[f.properties![colorBy]];
          return color;
        }
      }
    } catch (error) {
      console.error(error);
    }
    return '#3388ff';
  };

  const style = (feature: Feature | undefined) => {
    if (!feature) {
      return {};
    }

    const geometryType = feature.geometry.type;

    switch (geometryType) {
      case 'Point':
        return {
          radius: 6,
          fillColor: getColor(feature),
          color: '#3388ff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
        };
      case 'LineString':
      case 'MultiLineString':
        return {
          weight: 3,
          opacity: 1,
          color: getColor(feature),
          dashArray: '3',
        };
      case 'Polygon':
      case 'MultiPolygon':
        return {
          weight: 2,
          opacity: 1,
          color: getColor(feature),
          dashArray: '3',
          fillOpacity: 0.7,
        };
      default:
        return {
          weight: 2,
          opacity: 1,
          color: '#3388ff',
          dashArray: '3',
          fillOpacity: 0.7,
        };
    }
  };

  const pointToLayer = (feature: Feature, latlng: L.LatLng) => {
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: getColor(feature),
      color: '#3388ff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7,
    });
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={13}
        maxBounds={props.mapBounds}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <GeoJSON data={geoJsonData} style={style} pointToLayer={pointToLayer} />
      </MapContainer>
    </div>
  );
}
