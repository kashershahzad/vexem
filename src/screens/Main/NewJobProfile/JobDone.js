import { StyleSheet, Text, View } from 'react-native';
import ImageFastWrapper from '../../../components/ImageFast';
import { Images } from '../../../assets/images';
import CustomText from '../../../components/CustomText';
import fonts from '../../../assets/fonts';
import ScreenWrapper from '../../../components/ScreenWrapper';
import { colors } from '../../../utils/colors';
import CustomButton from '../../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import Icons from '../../../components/Icons';

const JobDone = ({ route }) => {
  const navigation = useNavigation();
  const jobdone = route.params?.jobdone;
  const apply = route.params?.apply;

  return (
    <ScreenWrapper
      footerUnScrollable={() => (
        <View style={{ paddingHorizontal: 20 }}>
          <CustomButton
            title={'Next'}
            marginBottom={20}
            onPress={() =>
              jobdone
                ? navigation.navigate('NewJobProfile')
                : apply
                ? navigation.navigate('Home')
                : navigation.navigate('NewJobProfile')
            }
          />
        </View>
      )}>
      <View style={styles.container}>
        <Icons
          name={'checkmark-circle'}
          family={'Ionicons'}
          color={'#03cfa4'}
          size={200}
        />
        <CustomText
          label={'Congratulations'}
          fontSize={20}
          fontFamily={fonts.semiBold}
          color={colors.primaryColor}
        />
        <CustomText
          label={
            jobdone
              ? 'Job Profile Updated successfully'
              : apply
              ? 'Applied to job successfully'
              : 'Your Job Profile has been created'
          }
          textTransform={'capitalize'}
          fontSize={16}
          fontFamily={fonts.semiBold}
          marginTop={20}
        />
      </View>
    </ScreenWrapper>
  );
};

export default JobDone;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
