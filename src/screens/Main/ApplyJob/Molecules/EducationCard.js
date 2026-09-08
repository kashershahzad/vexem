import { StyleSheet, View, Image } from 'react-native';
import { Images } from '../../../../assets/images';
import { colors } from '../../../../utils/colors';
import CustomText from '../../../../components/CustomText';
import fonts from '../../../../assets/fonts';

const EducationCard = ({ education }) => {

 console.log(education?.certificates);
 
  return (
    <View>
      <CustomText
        label={'Education'}
        fontFamily={fonts.semiBold}
        fontSize={16}
        marginTop={20}
        marginBottom={10}
      />

      <View style={styles.container}>
        <View style={styles.rowItem}>
          <Image source={Images.JobType} style={{ width: 21, height: 21 }} />
          <View style={styles.textContainer}>
            <CustomText
              label={education?.education}
              fontFamily={fonts.semiBold}
              fontSize={14}
              color={colors.black}
            />
            {education?.course && (
              <CustomText
                label={education?.course}
                fontFamily={fonts.medium}
                fontSize={14}
                color={colors.grey}
              />
            )}
            <CustomText
              label={education?.institute}
              fontFamily={fonts.medium}
              fontSize={14}
              color={colors.grey}
            />
            <CustomText
              label={education?.institute_year}
              fontFamily={fonts.semiBold}
              fontSize={14}
              color={colors.black}
            />
          </View>
        </View>

        {education?.certificates?.map((item, i) => {
          return (
            <View style={styles.rowItem} keu={i}>
              <Image
                source={Images.Certificates}
                style={{ width: 21, height: 21 }}
              />

              <View style={styles.textContainer}>
                <CustomText
                  label={"Certificate"}
                  fontFamily={fonts.semiBold}
                  fontSize={14}
                  color={colors.black}
                />
                <CustomText
                  label={item?.course}
                  fontFamily={fonts.medium}
                  fontSize={14}
                  color={colors.grey}
                />
                <CustomText
                  label={item?.date}
                  fontFamily={fonts.semiBold}
                  fontSize={14}
                  color={colors.black}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default EducationCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderColor: colors.grey2,
    borderWidth: 1,
    borderRadius: 7,
    padding: 15,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  textContainer: {
    marginLeft: 15,
    flexGrow: 1,
  },
});
