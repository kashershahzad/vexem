import React from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import Icons from '../../../components/Icons';
import { colors } from '../../../utils/colors';
import { imgUrl } from '../../../utils/constants';

const FileDisplayer = ({ onPress, loader, file, onClose, type }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.close} onPress={onClose}>
        <Icons name={'close'} color={colors.white} size={30} />
      </TouchableOpacity>
      <View style={styles.box}>
        <View>
          {loader ? (
            <View style={styles.loader}>
              <ActivityIndicator color={colors.white} size={40} />
            </View>
          ) : type === 'application/pdf' ? (
            <View>
              <Icons
                name={'file-pdf'}
                family={'FontAwesome5'}
                color={colors.white}
                size={40}
              />
            </View>
          ) : (
            <Image source={{ uri: imgUrl + file }} style={styles.img} />
          )}
        </View>
        <CustomText
          label={file}
          marginTop={10}
          fontFamily={fonts.semiBold}
          fontSize={17}
          textAlign={'center'}
          color={colors.white}
          paddingHorizontal={30}
        />
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <CustomText
            label={file}
            fontFamily={fonts.semiBold}
            color={colors.black}
            numberOfLines={1}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: loader ? colors.grey : colors.primaryColor },
          ]}
          onPress={onPress}
          disabled={loader}>
          <Icons
            name="send"
            family={'FontAwesome'}
            color={colors.white}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FileDisplayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000000B3',
    zIndex: 11,
    height: '100%',
    position: 'absolute',
    width: '100%',
  },
  box: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    width: 200,
    height: 200,
    resizeMode: 'stretch',
    borderRadius: 20,
  },
  input: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.lightGrey,
    width: '80%',
    height: 52,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 10,
  },
  sendButton: {
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primaryColor,
  },
  loader: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: '#0000009E',
    borderRadius: 20,
    top: 0,
  },
  close: {
    right: 20,
    position: 'absolute',
    top: 20,
    padding: 5,
    zIndex: 1,
  },
});
