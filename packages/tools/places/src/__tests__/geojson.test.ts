// SPDX-License-Identifier: MIT
// Copyright contributors to the openassistant project

import { transformPlacesToGeoJSON } from '../placeSearch';

describe('transformPlacesToGeoJSON', () => {
  it('should transform place data to GeoJSON format', () => {
    const mockPlaces = [
      {
        id: 'test-place-1',
        name: 'Test Coffee Shop',
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
          address: '123 Test St',
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
        rating: 4.5,
        price: 2,
        phone: '+1-555-123-4567',
        website: 'https://testcoffee.com',
      },
      {
        id: 'test-place-2',
        name: 'Test Restaurant',
        location: {
          latitude: 40.7590,
          longitude: -73.9852,
          address: '456 Test Ave',
          city: 'New York',
          state: 'NY',
          country: 'US',
          postalCode: '10001',
        },
        distance: 200,
        rating: 4.2,
        price: 3,
      },
    ];

    const searchMetadata = {
      query: 'coffee',
      location: { latitude: 40.7589, longitude: -73.9851, radius: 1000 },
    };

    const result = transformPlacesToGeoJSON(mockPlaces, searchMetadata);

    // Verify GeoJSON structure
    expect(result.type).toBe('FeatureCollection');
    expect(result.features).toHaveLength(2);
    expect(result.properties).toBeDefined();
    expect(result.properties?.totalFeatures).toBe(2);
    expect(result.properties?.searchMetadata).toEqual(searchMetadata);
    expect(result.properties?.generatedAt).toBeDefined();

    // Verify first feature
    const firstFeature = result.features[0];
    expect(firstFeature.type).toBe('Feature');
    expect(firstFeature.id).toBe('test-place-1');
    expect(firstFeature.geometry.type).toBe('Point');
    expect(firstFeature.geometry.coordinates).toEqual([-73.9851, 40.7589]);
    expect(firstFeature.properties.name).toBe('Test Coffee Shop');
    expect(firstFeature.properties.address).toBe('123 Test St');
    expect(firstFeature.properties.rating).toBe(4.5);
    expect(firstFeature.properties.categories).toHaveLength(1);

    // Verify second feature
    const secondFeature = result.features[1];
    expect(secondFeature.geometry.coordinates).toEqual([-73.9852, 40.7590]);
    expect(secondFeature.properties.name).toBe('Test Restaurant');
  });

  it('should handle places without optional fields', () => {
    const mockPlaces = [
      {
        id: 'minimal-place',
        name: 'Minimal Place',
        location: {
          latitude: 40.7589,
          longitude: -73.9851,
        },
      },
    ];

    const result = transformPlacesToGeoJSON(mockPlaces);

    expect(result.features).toHaveLength(1);
    const feature = result.features[0];
    expect(feature.properties.name).toBe('Minimal Place');
    expect(feature.properties.address).toBeUndefined();
    expect(feature.properties.rating).toBeUndefined();
  });

  it('should handle empty places array', () => {
    const result = transformPlacesToGeoJSON([]);

    expect(result.type).toBe('FeatureCollection');
    expect(result.features).toHaveLength(0);
    expect(result.properties?.totalFeatures).toBe(0);
  });

  it('should include all place properties in feature properties', () => {
    const mockPlace = {
      id: 'complete-place',
      name: 'Complete Place',
      location: {
        latitude: 40.7589,
        longitude: -73.9851,
        address: 'Complete Address',
        city: 'Complete City',
        state: 'Complete State',
        country: 'Complete Country',
        postalCode: 'Complete Postal',
      },
      categories: [{ id: '1', name: 'Category 1' }],
      chains: [{ id: '1', name: 'Chain 1' }],
      distance: 100,
      phone: 'Complete Phone',
      website: 'Complete Website',
      rating: 5.0,
      price: 4,
      hours: { open: true },
      description: 'Complete Description',
      email: 'complete@example.com',
      attributes: { wifi: true },
      photos: [{ id: '1', url: 'photo1.jpg' }],
      popularity: 100,
      verified: true,
      socialMedia: { twitter: '@complete' },
      stats: { checkins: 1000 },
      tastes: { sweet: 0.8 },
      tips: [{ text: 'Great place!' }],
      dateCreated: '2023-01-01',
      dateRefreshed: '2023-01-02',
      dateClosed: null,
      extendedLocation: { neighborhood: 'Complete Neighborhood' },
      hoursPopular: { monday: 'busy' },
      link: 'Complete Link',
      menu: { items: ['item1'] },
      placemakerUrl: 'Complete URL',
      storeId: 'Complete Store ID',
      relatedPlaces: { parent: { id: 'parent' } },
    };

    const result = transformPlacesToGeoJSON([mockPlace]);

    const feature = result.features[0];
    const properties = feature.properties;

    // Verify all properties are included
    expect(properties.id).toBe('complete-place');
    expect(properties.name).toBe('Complete Place');
    expect(properties.address).toBe('Complete Address');
    expect(properties.city).toBe('Complete City');
    expect(properties.state).toBe('Complete State');
    expect(properties.country).toBe('Complete Country');
    expect(properties.postalCode).toBe('Complete Postal');
    expect(properties.categories).toEqual([{ id: '1', name: 'Category 1' }]);
    expect(properties.chains).toEqual([{ id: '1', name: 'Chain 1' }]);
    expect(properties.distance).toBe(100);
    expect(properties.phone).toBe('Complete Phone');
    expect(properties.website).toBe('Complete Website');
    expect(properties.rating).toBe(5.0);
    expect(properties.price).toBe(4);
    expect(properties.hours).toEqual({ open: true });
    expect(properties.description).toBe('Complete Description');
    expect(properties.email).toBe('complete@example.com');
    expect(properties.attributes).toEqual({ wifi: true });
    expect(properties.photos).toEqual([{ id: '1', url: 'photo1.jpg' }]);
    expect(properties.popularity).toBe(100);
    expect(properties.verified).toBe(true);
    expect(properties.socialMedia).toEqual({ twitter: '@complete' });
    expect(properties.stats).toEqual({ checkins: 1000 });
    expect(properties.tastes).toEqual({ sweet: 0.8 });
    expect(properties.tips).toEqual([{ text: 'Great place!' }]);
    expect(properties.dateCreated).toBe('2023-01-01');
    expect(properties.dateRefreshed).toBe('2023-01-02');
    expect(properties.dateClosed).toBe(null);
    expect(properties.extendedLocation).toEqual({ neighborhood: 'Complete Neighborhood' });
    expect(properties.hoursPopular).toEqual({ monday: 'busy' });
    expect(properties.link).toBe('Complete Link');
    expect(properties.menu).toEqual({ items: ['item1'] });
    expect(properties.placemakerUrl).toBe('Complete URL');
    expect(properties.storeId).toBe('Complete Store ID');
    expect(properties.relatedPlaces).toEqual({ parent: { id: 'parent' } });
  });
}); 