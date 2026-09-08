import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import fonts from '../../../assets/fonts';
import CustomText from '../../../components/CustomText';
import Header from '../../../components/Header';
import Icons from '../../../components/Icons';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { colors } from '../../../utils/colors';

const JobSubCategory = ({ route }) => {
  const navigation = useNavigation();
  const type = route?.params?.jobtype;

  const recruit = [
    {
      name: 'All in jobs',
    },
    {
      name: 'Design',
    },
    {
      name: 'Beauty / Salon',
    },
    {
      name: 'Automobile',
    },
    {
      name: 'Cleaner / Housekeeper',
    },
    {
      name: 'Construction',
    },
    {
      name: 'Content Writer',
    },
    {
      name: 'Cook / Chef',
    },
    {
      name: 'Customer Service / Call Centre',
    },
  ];

  const Seeker = [
    {
      name: 'All in jobs',
    },
    {
      name: 'HR / Admin',
    },
    {
      name: 'Information Technology (IT)',
    },
    {
      name: 'Marketing / Advertising ',
    },
    {
      name: 'Real Estate',
    },
    {
      name: 'Engineering',
    },
    {
      name: 'Data Management & Analysis',
    },
    {
      name: 'Content Writer',
    },
    {
      name: 'Construction',
    },
  ];

  return (
    <>
      <ScreenWrapper
        paddingHorizontal={0.1}
        statusBarColor="white"
        headerUnScrollable={() => <Header title={type} />}>
        {type == 'Recruiter' ? (
          <View style={{ marginTop: 10 }}>
            {recruit.map((_, index) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Recruiter')}
                activeOpacity={0.6}
                key={index}
                style={styles.main_map}>
                <CustomText
                  label={_?.name}
                  fontFamily={fonts.regular}
                  fontSize={16}
                />
                <View style={styles.icn}>
                  <Icons family={'AntDesign'} name={'right'} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={{ marginTop: 10 }}>
            {Seeker.map((_, index) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Seeker')}
                activeOpacity={0.6}
                key={index}
                style={styles.main_map}>
                <CustomText
                  label={_?.name}
                  fontFamily={fonts.regular}
                  fontSize={16}
                />
                <View style={styles.icn}>
                  <Icons family={'AntDesign'} name={'right'} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScreenWrapper>
    </>
  );
};

export default JobSubCategory;

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 5,
  },
  main_map: {
    backgroundColor: colors.white,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomColor: colors?.mainBg,
    borderBottomWidth: 2,
    // marginTop: 20,
  },

  icn: {
    backgroundColor: colors.mainBg,
    width: 32,
    height: 32,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
