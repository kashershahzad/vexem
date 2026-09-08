import { StyleSheet, View, Image } from 'react-native';
import { colors } from '../../../../utils/colors';
import CustomText from '../../../../components/CustomText';
import fonts from '../../../../assets/fonts';
import { Images } from '../../../../assets/images';

const PersonalInformationCard = ({ personalInformation }) => {
  const data = [
    {
      label: 'Full Name',
      value: personalInformation?.profilename,
      icon: Images.profileUser,
    },
    {
      label: 'Nationality',
      value: personalInformation?.nationality,
      icon: Images.Nationality,
    },
    { label: 'Date of Birth', value: personalInformation?.dob, icon: Images.Age },
    { label: 'Gender', value: personalInformation?.gender, icon: Images.Gender },
    {
      label: 'Visa Status',
      value: personalInformation?.visa,
      icon: Images.VisaStatus,
    },
    {
      label: 'Country Status',
      value: personalInformation?.country_status,
      icon: Images.CountryStatus,
    },
    {
      label: 'Driving License',
      value: personalInformation?.License,
      icon: Images.DrivingLicense,
    },
    {
      label: 'Job Type',
      value: personalInformation?.job_type,
      icon: Images.JobType,
    },
  ];
  return (
    <View>
      <CustomText
        label={'Personal Information'}
        fontFamily={fonts.semiBold}
        fontSize={16}
        marginTop={20}
        marginBottom={10}
      />
      <View style={styles.container}>
        <View style={styles.wrapper}>
          {data.map((item, i) => (
            <View style={styles.rowItem} key={i}>
              <Image source={item?.icon} style={{ width: 21, height: 21 }} />
              <View style={styles.textContainer}>
                <CustomText
                  label={item?.label}
                  fontFamily={fonts.semiBold}
                  fontSize={14}
                  color={colors.grey}
                />
                <CustomText
                  label={item?.value}
                  fontFamily={fonts.medium}
                  fontSize={14}
                  color={colors.black}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default PersonalInformationCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderColor: colors.grey2,
    borderWidth: 1,
    borderRadius: 7,
    padding: 15,
  },
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rowItem: {
    width: '40%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    marginLeft: 15,
  },
});
