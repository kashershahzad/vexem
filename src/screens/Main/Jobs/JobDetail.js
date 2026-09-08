import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../../../assets/fonts';
import { Images } from '../../../assets/images';
import CustomButton from '../../../components/CustomButton';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ImageFast from '../../../components/ImageFast';
import ScreenWrapper from '../../../components/ScreenWrapper';
import Swiper from '../../../components/Swipper';
import TextSpaceBetween from '../../../components/TextSpaceBetween';
import { colors } from '../../../utils/colors';

const JobDetail = ({ navigation, route }) => {
  return (
    <ScreenWrapper
      scrollEnabled
      statusBarColor="white"
      paddingBottom={4}
      paddingHorizontal={0.1}
      headerUnScrollable={() => (
        <View>
          <Header />
        </View>
      )}
      footerUnScrollable={() => (
        <View
          style={{
            flexDirection: 'row',
            padding: 8,
            justifyContent: 'space-between',
          }}>
          <CustomButton width="48%" title={'Chat'} iconColor={'white'} />
          <CustomButton
            width="48%"
            title={'See CV Details'}
            iconColor={'white'}
          />
        </View>
      )}>
      <View style={styles.feature}>
        <Image source={Images.feature} style={styles.featureIcon} />
        <TouchableOpacity style={styles.like}>
          <Icons family={'AntDesign'} name={'hearto'} color={'#dddddd'} />
        </TouchableOpacity>
      </View>
      <Swiper
        images={[
          'https://hips.hearstapps.com/hmg-prod/images/dw-burnett-pcoty22-8260-1671143390.jpg',
          'https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&height=600&width=1200&fit=bounds',
        ]}
      />

      <View style={{ paddingHorizontal: 14 }}>
        <CustomText
          fontFamily={fonts.semiBold}
          fontSize={16}
          label={'Beautician Available for work'}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <CustomText
            label={'AED $2000 - $5000'}
            fontSize={18}
            fontFamily={fonts.bold}
            color={colors.primaryColor}
          />
        </View>

        <View
          style={{
            borderBottomColor: '#dddddd',
            borderBottomWidth: 1,
            paddingBottom: 10,
          }}>
          <TextSpaceBetween
            leftText={'Abu Dhabi, Khalifa City, Khalifa City '}
            rightText={'1 Nov'}
            forwardArrow={false}
            leftImage={Images.location}
          />
        </View>

        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <CustomText
                label={'Work Experience'}
                marginTop={10}
                color={'#000'}
                fontFamily={fonts.regular}
              />
              <CustomText
                label={'5 -- 10 year'}
                marginBottom={10}
                color={colors.black}
                fontFamily={fonts.bold}
              />
            </View>
            <View>
              <CustomText
                label={'Education'}
                marginTop={10}
                color={'#000'}
                fontFamily={fonts.regular}
              />
              <CustomText
                label={'Master Degree'}
                marginBottom={10}
                color={colors.black}
                fontFamily={fonts.bold}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View>
              <CustomText
                label={'Work Experience'}
                marginTop={10}
                color={'#000'}
                fontFamily={fonts.regular}
              />
              <CustomText
                label={'5 -- 10 year'}
                marginBottom={10}
                color={colors.black}
                fontFamily={fonts.bold}
              />
            </View>
            <View>
              <CustomText
                label={'Education'}
                marginTop={10}
                color={'#000'}
                fontFamily={fonts.regular}
              />
              <CustomText
                label={'Master Degree'}
                marginBottom={10}
                color={colors.black}
                fontFamily={fonts.bold}
              />
            </View>
          </View>
          <CustomText
            label={'Education'}
            marginTop={10}
            color={'#000'}
            fontFamily={fonts.regular}
          />
          <CustomText
            label={'Master Degree'}
            marginBottom={10}
            color={colors.black}
            fontFamily={fonts.bold}
          />
        </View>

        <CustomText
          label={'Description'}
          marginTop={10}
          marginBottom={10}
          fontFamily={fonts.bold}
        />

        <CustomText
          label={
            'Upon arrival, your senses will be rewarded with the pleasant scent of lemongrass oil used to clean the natural wood found throughout the room creating a relaxing atmosphere within the space.A wonderful serenity has taken possession of myentire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine. I am so happy,my dear friend, so absorbed in the exquisite'
          }
        />

        <CustomText
          label={'Location'}
          fontSize={16}
          fontFamily={fonts.bold}
          marginTop={16}
          marginBottom={10}
        />
        <CustomText label={'Address :'} fontSize={12} />

        <TextSpaceBetween
          leftImage={Images.location}
          leftText={'Abu Dhabi, Khalifa City, Khalifa City A'}
          forwardArrow={false}
        />
        <ImageFast
          source={Images.map}
          style={{
            width: '100%',
            height: 200,
            marginBottom: 18,
            marginTop: 10,
            borderRadius: 10,
          }}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            borderColor: colors.black,
            marginVertical: 12,
          }}>
          <ImageFast
            source={{
              uri: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
            }}
            style={{ height: 42, width: 42, borderRadius: 99 }}
          />
          <View style={{ marginLeft: 8, width: '78%' }}>
            <CustomText
              label={'Robin Aleson'}
              fontSize={16}
              fontFamily={fonts.bold}
            />
            <CustomText
              label={'robinaleson@gmail.com'}
              fontSize={12}
              color={colors.grey}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default JobDetail;

const styles = StyleSheet.create({
  image: {
    height: 230,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  mapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    // justifyContent: 'space-around',
    marginTop: 14,
  },
  featureIcon: {
    height: 30,
    width: 74,
  },
  feature: {
    position: 'absolute',
    zIndex: 9999,
    top: 20,
    left: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '95%',
  },
  button: {
    padding: 8,
    width: '32%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },

  like: {
    backgroundColor: colors?.white,
    padding: 5,
    borderRadius: 60,
  },
});
