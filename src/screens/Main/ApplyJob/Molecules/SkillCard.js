import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '../../../../components/CustomButton';
import { colors } from '../../../../utils/colors';
import CustomText from '../../../../components/CustomText';
import fonts from '../../../../assets/fonts';

const SkillCard = ({skills}) => {
 

  return (
    <View>
      <CustomText
        label={'Skills'}
        fontFamily={fonts.semiBold}
        fontSize={16}
        marginTop={20}
        marginBottom={10}
      />
      <View style={styles.container}>
        {skills?.skills?.map((item, i) => (
          <CustomButton
            key={i}
            title={item}
            fontSize={14}
            width="auto"
            color={colors.black}
            customStyle={styles.button}
          />
        ))}
      </View>
    </View>
  );
};

export default SkillCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 10,
  },
  button: {
    paddingHorizontal: 15,
    backgroundColor: colors.white,
    borderColor: colors.grey2,
    borderWidth: 1,
    borderRadius: 7,
  },
});
