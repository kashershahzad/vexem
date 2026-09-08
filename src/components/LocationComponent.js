import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Images } from '../assets/images';
import { mapStyle } from '../constants/mapData';
import { COLORS } from '../utils/colors';

const LocationComponent = ({
  lat,
  lng,
  showMarkerOnTap = false,
  onLocationChange,
}) => {
  const _map = useRef(null);
  const [markerCoords, setMarkerCoords] = useState({
    latitude: lat,
    longitude: lng,
  });

  useEffect(() => {
    if (_map.current) {
      _map.current.animateToRegion({
        latitude: markerCoords?.latitude || lat,
        longitude: markerCoords?.longitude || lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [lat, lng]);

  const handleMapPress = e => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setMarkerCoords({ latitude, longitude });
    onLocationChange({ latitude, longitude });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={_map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        rotateEnabled={true}
        zoomEnabled={true}
        customMapStyle={mapStyle}
        onPress={showMarkerOnTap ? handleMapPress : null}>
        <Marker coordinate={markerCoords}>
          <Image
            source={Images.pin}
            style={{
              width: 32,
              height: 40,
              tintColor: COLORS.primaryColor,
            }}
            resizeMode="contain"
          />
        </Marker>
      </MapView>
    </View>
  );
};

export default LocationComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
    borderRadius: 20,
  },
  map: {
    flex: 0.85,
    width: '100%',
    height: 220,
  },
});
