import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { openCamera, openPicker } from 'react-native-image-crop-picker';
import React, { useState } from 'react';

import CustomModal from './CustomModal';
import CustomText from './CustomText';
import Icons from './Icons';

import { Images } from '../assets/images';
import fonts from '../assets/fonts';
import { colors } from '../utils/colors';

const UploadImage = props => {
  const [image, setImage] = useState('');
  const [imageModal, setImageModal] = useState(false);

  const takePhotoFromCamera = () => {
    try {
      const options = {
        mediaType: 'photo',
        cropping: false,
        ...(Platform.OS === 'ios' && {
          width: 1000,
          height: 800,
          freeStyleCropEnabled: true,
        }),
        ...props.options,
      };
      setImageModal(false);
      setTimeout(async () => {
        const result = await openCamera(options);

        if (result) {
          setImage(result);
          props.handleChange(result);
        }
      }, 500);
    } catch (error) {
      console.log('takePhotoFromCamera error', error);
    }
  };

  const takePhotoFromLibrary = async () => {
    try {
      const options = {
        mediaType: 'photo',
        cropping: false,
        multiple: props.multiple,
        maxFiles: 20,
        ...(Platform.OS === 'ios' && {
          width: 1000,
          height: 800,  
          freeStyleCropEnabled: true,
        }),
        freeStyleCropEnabled: true,
        ...props.options,
      };
      setImageModal(false);
      setTimeout(async () => {
        const result = await openPicker(options);
        if (result) {
          setImage(result);
          props.handleChange(result);
        }
      }, 1000);
    } catch (error) {
      console.log('takePhotoFromLibrary error', error);
    }
  };

  const ModalIcons = ({ source, title, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={source}
            style={{ width: 70, height: 70, resizeMode: 'contain' }}
          />
          <CustomText
            label={title}
            fontFamily={fonts.semiBold}
            marginTop={10}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={!props.renderButton && styles.container}>
      {!props.renderButton ? (
        <>
          <View style={props.imageContainer}>
            <Image
              source={
                image
                  ? { uri: image.uri }
                  : props.image
                  ? { uri: props.image }
                  : props.placeholder || {
                      uri: 'https://wtwp.com/wp-content/uploads/2015/06/placeholder-image.png',
                    }
              }
              style={styles.image}
            />
          </View>
          {!props.disabled && (
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.iconStyle, props.iconStyle]}
              onPress={() => setImageModal(true)}>
              <Icons
                family="Entypo"
                name="camera"
                color={props.iconColor || 'black'}
                size={17}
              />
            </TouchableOpacity>
          )}
        </>
      ) : (
        props.renderButton(() => setImageModal(true))
      )}
      <CustomModal
        isChange
        isVisible={imageModal}
        transparent={true}
        onDisable={() => setImageModal(false)}
        backgroundColor="transparent">
        <View style={styles.mainContainer}>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              marginBottom: 30,
            }}>
            <CustomText
              label="Choose Picture From"
              fontSize={18}
              fontFamily={fonts.bold}
              alignSelf="center"
              containerStyle={{ flex: 1 }}
            />
            <Icons
              family="Entypo"
              name="circle-with-cross"
              size={25}
              color={colors.black}
              onPress={() => setImageModal(false)}
            />
          </View>
          <View style={styles.modalIconContainer}>
            <ModalIcons
              source={Images.gallery}
              title="Gallery"
              onPress={takePhotoFromLibrary}
            />
            <ModalIcons
              source={Images.camera}
              title="Camera"
              onPress={takePhotoFromCamera}
            />
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

export default UploadImage;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
    width: '100%',
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  iconStyle: {
    position: 'absolute',
    bottom: 15,
    right: 5,
    borderRadius: 50,
    backgroundColor: 'white',
    borderWidth: 0,
    padding: 5,
  },
  container: {
    alignSelf: 'center',
  },
  modalContainer: {
    height: '30%',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingTop: 15,
  },
  modalIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  emptyView: {
    width: 60,
    height: 6,
    borderRadius: 100,
    backgroundColor: colors.emptyView,
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
});
