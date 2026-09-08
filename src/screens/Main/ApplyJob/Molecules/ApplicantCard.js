import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import ImageFastWrapper from '../../../../components/ImageFast';
import { Images } from '../../../../assets/images';
import CustomText from '../../../../components/CustomText';
import fonts from '../../../../assets/fonts';
import Icons from '../../../../components/Icons';
import { colors } from '../../../../utils/colors';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { imgUrl } from '../../../../utils/constants';

const ApplicantCard = ({ alldata, jobData, onChnage, onChnageGenral, tab }) => {
  const navigation = useNavigation();

  const handleEmailPress = async email => {
    const url = `mailto:${email}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'No email app available to send the message.');
    }
  };

  const handlePhonePress = async phoneNumber => {
    const url = `tel:${phoneNumber}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Phone call not supported on this device.');
    }
  };

  const handleWhatsAppPress = async phone => {
    const url = `whatsapp://send?phone=${phone}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'WhatsApp is not installed on this device.');
    }
  };

  return (
    <View style={styles.ApplicantCard}>
      <View style={{ flexDirection: 'row' }}>
        {alldata?.status === 'waitlist' && tab === 2 ? (
          <TouchableOpacity onPress={onChnageGenral} style={styles.tick}>
            <Icons
              name={'done'}
              family={'MaterialIcons'}
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onChnage}
            style={[styles.tick, { backgroundColor: '#C1C1C1' }]}>
            <Icons
              name={'add'}
              family={'Ionicons'}
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
        )}

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
          }}>
   
          <ImageFastWrapper
            source={
              jobData.image?.startsWith('http')
                ? {uri: jobData.image}
                : jobData.image
                ? {uri :`${imgUrl}${jobData.image}`}
                : Images.profileUser
            }
            style={{ width: 50, height: 50, borderRadius: 100 }}
            resizeMode={jobData?.image ? 'cover' : 'contain'}
          />
          <View>
            <CustomText
              label={jobData?.profilename || 'Fayaz Ahmed'}
              fontFamily={fonts.semiBold}
              fontSize={16}
              marginTop={10}
            />

            <View style={styles.details}>
              {[
                { label: 'Experience', value: jobData?.workExp },
                { label: 'Qualification', value: jobData?.education || 'None' },
                { label: 'Status', value: jobData?.country_status },
              ].map((item, index) => (
                <View style={styles.detailRow} key={index}>
                  <Text style={styles.detailLabel}> {item.label} </Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { width: index === 1 ? 150 : '' },
                    ]}
                    numberOfLines={1}>
                    {' '}
                    : {item.value}
                  </Text>
                </View>
              ))}
            </View>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{'Gender'} </Text>
                <Text style={styles.detailValue}> : {jobData?.gender}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{'Nationality'} </Text>
                <Text style={styles.detailValue}>: {jobData?.nationality}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          gap: 8,
          width: '100%',
        }}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => handleEmailPress(alldata?.profile?.email)} // replace with your email
        >
          <Icons
            name={'email'}
            family={'MaterialCommunityIcons'}
            size={20}
            color={colors.white}
          />
          <CustomText
            label={'Email'}
            fontFamily={fonts.semiBold}
            color={colors.white}
            fontSize={14}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => handlePhonePress(alldata?.profile?.phone)}>
          <Icons
            name={'call'}
            family={'Ionicons'}
            size={20}
            color={colors.white}
          />
          <CustomText
            label={'Call'}
            fontFamily={fonts.semiBold}
            color={colors.white}
            fontSize={14}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => handleWhatsAppPress(alldata?.profile?.phone)}>
          <Icons
            name={'whatsapp'}
            family={'FontAwesome'}
            size={20}
            color={colors.white}
          />
          <CustomText
            label={'Whatsapp'}
            fontFamily={fonts.semiBold}
            color={colors.white}
            fontSize={14}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() =>
            navigation.navigate('ApplicantProfile', { profiledata: alldata })
          }>
          <ImageFastWrapper
            source={Images.profileView}
            resizeMode={'contain'}
            style={{ height: 20, width: 20 }}
          />
          <CustomText
            label={'View'}
            fontFamily={fonts.semiBold}
            color={colors.white}
            fontSize={14}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ApplicantCard;

const styles = StyleSheet.create({
  ApplicantCard: {
    backgroundColor: '#fff',
    marginTop: 20,
    padding: 10,
    borderRadius: 7,
  },

  tick: {
    backgroundColor: '#A38CB6',
    height: 30,
    width: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 99999,
    right: 10,
    top: 5,
  },
  details: {
    marginTop: 5,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailLabel: {
    width: 85,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: '#7A7979',
  },
  detailValue: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: '#000',
  },

  btn: {
    backgroundColor: '#A38CB6',
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 5,
  },
});
