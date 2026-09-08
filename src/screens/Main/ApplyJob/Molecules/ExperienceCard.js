import { StyleSheet, View, Image } from 'react-native';
import { Images } from '../../../../assets/images';
import { colors } from '../../../../utils/colors';
import CustomText from '../../../../components/CustomText';
import fonts from '../../../../assets/fonts';
import moment from 'moment';

const ExperienceCard = ({ exp }) => {
  return (
    <View>
      <CustomText
        label={'Experience'}
        fontFamily={fonts.semiBold}
        fontSize={16}
        marginTop={20}
        marginBottom={10}
      />
      <View style={[styles.container, { marginBottom: 20 }]}>
        <CustomText
          label={exp?.workExp}
          fontFamily={fonts.semiBold}
          fontSize={14}
          color={colors.black}
        />
      </View>

      <View style={styles.container}>
        {exp?.useWorkExp?.map((item, i) => {
          const fromDate = moment(item?.fromDate);
          const toDate = moment(item?.todate);
          const duration = moment.duration(toDate.diff(fromDate));
          const years = duration.years();
          const months = duration.months();

          let experienceText = `${years} years`;
          if (months > 0) experienceText += ` ${months} months`;

          const formattedDateRange = `${fromDate.format('MMM YYYY')} - ${toDate.format('MMM YYYY')}`;

          return (
            <View style={styles.rowItem} key={i}>
              <Image
                source={Images.experiance}
                style={{ width: 21, height: 21, marginTop: 3 }}
              />
              <View style={styles.textContainer}>
                <CustomText
                  label={item?.position}
                  fontFamily={fonts.semiBold}
                  fontSize={14}
                  color={colors.black}
                />
                {item?.cName && (
                  <CustomText
                    label={item?.cName}
                    fontFamily={fonts.medium}
                    fontSize={14}
                    color={colors.black}
                  />
                )}
                {item?.Location && (
                  <CustomText
                    label={item?.Location}
                    fontFamily={fonts.medium}
                    fontSize={14}
                    color={colors.grey}
                  />
                )}
                <CustomText
                  label={`${formattedDateRange} (${experienceText})`}
                  fontFamily={fonts.medium}
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

export default ExperienceCard;

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
  yearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
