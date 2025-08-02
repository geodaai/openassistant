// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

/**
 * GeoJSON Demo Script
 * 
 * This script demonstrates how the place search results are transformed into GeoJSON format
 * and how they can be used with various mapping and geospatial tools.
 */

import { transformPlacesToGeoJSON } from '../src/placeSearch';

// Sample place data (similar to what would be returned from Foursquare API)
const samplePlaces = [
  {
    id: 'coffee-shop-1',
    name: 'Starbucks Coffee',
    location: {
      latitude: 40.7589,
      longitude: -73.9851,
      address: '123 Broadway',
      city: 'New York',
      state: 'NY',
      country: 'US',
      postalCode: '10001',
    },
    categories: [
      {
        id: '13032',
        name: 'Coffee Shop',
        icon: 'https://ss3.4sqi.net/img/categories_v2/food/coffeeshop_32.png',
      },
    ],
    distance: 150,
    rating: 4.2,
    price: 2,
    phone: '+1-555-123-4567',
    website: 'https://starbucks.com',
    hours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '07:00', close: '23:00' },
      sunday: { open: '07:00', close: '22:00' },
    },
    verified: true,
    popularity: 85,
  },
  {
    id: 'restaurant-1',
    name: 'Joe\'s Pizza',
    location: {
      latitude: 40.7590,
      longitude: -73.9852,
      address: '456 7th Avenue',
      city: 'New York',
      state: 'NY',
      country: 'US',
      postalCode: '10001',
    },
    categories: [
      {
        id: '13065',
        name: 'Pizza Place',
        icon: 'https://ss3.4sqi.net/img/categories_v2/food/pizza_32.png',
      },
    ],
    distance: 200,
    rating: 4.5,
    price: 1,
    phone: '+1-555-987-6543',
    hours: {
      monday: { open: '11:00', close: '23:00' },
      tuesday: { open: '11:00', close: '23:00' },
      wednesday: { open: '11:00', close: '23:00' },
      thursday: { open: '11:00', close: '23:00' },
      friday: { open: '11:00', close: '00:00' },
      saturday: { open: '11:00', close: '00:00' },
      sunday: { open: '12:00', close: '22:00' },
    },
    verified: true,
    popularity: 92,
  },
  {
    id: 'hotel-1',
    name: 'Times Square Hotel',
    location: {
      latitude: 40.7591,
      longitude: -73.9853,
      address: '789 Times Square',
      city: 'New York',
      state: 'NY',
      country: 'US',
      postalCode: '10001',
    },
    categories: [
      {
        id: '19009',
        name: 'Hotel',
        icon: 'https://ss3.4sqi.net/img/categories_v2/travel/hotel_32.png',
      },
    ],
    distance: 300,
    rating: 4.1,
    price: 4,
    phone: '+1-555-456-7890',
    website: 'https://timessquarehotel.com',
    hours: {
      monday: { open: '00:00', close: '23:59' },
      tuesday: { open: '00:00', close: '23:59' },
      wednesday: { open: '00:00', close: '23:59' },
      thursday: { open: '00:00', close: '23:59' },
      friday: { open: '00:00', close: '23:59' },
      saturday: { open: '00:00', close: '23:59' },
      sunday: { open: '00:00', close: '23:59' },
    },
    verified: true,
    popularity: 78,
  },
];

// Search metadata
const searchMetadata = {
  query: 'coffee restaurants hotels',
  location: { latitude: 40.7589, longitude: -73.9851, radius: 1000 },
  categories: ['13032', '13065', '19009'],
  sort: 'relevance',
};

// Transform to GeoJSON
const geojson = transformPlacesToGeoJSON(samplePlaces, searchMetadata);

// Display the results
console.log('🌍 GeoJSON Transformation Demo');
console.log('================================');
console.log(`Total places found: ${geojson.features.length}`);
console.log(`Search query: ${searchMetadata.query}`);
console.log(`Search location: ${searchMetadata.location.latitude}, ${searchMetadata.location.longitude}`);
console.log(`Search radius: ${searchMetadata.location.radius}m`);
console.log('');

console.log('📍 Places found:');
geojson.features.forEach((feature, index) => {
  const props = feature.properties;
  console.log(`${index + 1}. ${props.name}`);
  console.log(`   📍 ${props.address}, ${props.city}, ${props.state}`);
  console.log(`   📞 ${props.phone || 'No phone'}`);
  console.log(`   🌟 Rating: ${props.rating || 'N/A'}/5`);
  console.log(`   💰 Price: ${props.price ? '$'.repeat(props.price) : 'N/A'}`);
  console.log(`   📏 Distance: ${props.distance}m`);
  console.log(`   🏷️  Category: ${props.categories?.[0]?.name || 'N/A'}`);
  console.log('');
});

console.log('🗺️  GeoJSON Structure:');
console.log(`Type: ${geojson.type}`);
console.log(`Features: ${geojson.features.length}`);
console.log(`Properties: ${Object.keys(geojson.properties || {}).join(', ')}`);
console.log('');

console.log('📊 Sample GeoJSON Feature:');
const sampleFeature = geojson.features[0];
console.log(JSON.stringify(sampleFeature, null, 2));
console.log('');

console.log('🔧 Usage Examples:');
console.log('');
console.log('1. Leaflet.js:');
console.log('   L.geoJSON(geojsonData).addTo(map);');
console.log('');
console.log('2. Mapbox GL JS:');
console.log('   map.addSource("places", {');
console.log('     type: "geojson",');
console.log('     data: geojsonData');
console.log('   });');
console.log('');
console.log('3. QGIS:');
console.log('   Import the GeoJSON file directly into QGIS');
console.log('');
console.log('4. Python (GeoPandas):');
console.log('   import geopandas as gpd');
console.log('   gdf = gpd.read_file("places.geojson")');
console.log('');

console.log('✅ GeoJSON transformation complete!');
console.log('The data is now ready to be used with any mapping or geospatial tool.'); 