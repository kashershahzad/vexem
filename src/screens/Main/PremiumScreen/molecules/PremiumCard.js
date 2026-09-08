import React from 'react';
import { StyleSheet, View } from 'react-native';
import fonts from '../../../../assets/fonts';
import CustomButton from '../../../../components/CustomButton';
import CustomText from '../../../../components/CustomText';
import Icons from '../../../../components/Icons';
import ImageFastWrapper from '../../../../components/ImageFast';

const PremiumCard = ({
  ads,
  days,
  index,
  price,
  type,
  buttonTitle,
  disabled,
  onPress,
  loading,
  width,
  source,
  description,
}) => {
  return (
    <View style={[styles.card, { width: width, marginTop: 14 }]}>
      <ImageFastWrapper
        source={source}
        style={{
          height: 125,
          width: 110,
          alignSelf: 'center',
          marginVertical: 14,
        }}
      />
      <CustomText alignSelf={'center'} textStyle={styles.topText}>
        {type}
      </CustomText>

      {/* {opportunities?.map((opportunity, index) => ( */}
      <View key={index} style={styles.opportunityRow}>
        <Icons
          name="check-underline"
          family={'MaterialCommunityIcons'}
          size={24}
          color="#00BA00"
          style={styles.icon}
        />
        <CustomText
          textStyle={styles.opportunityText}
          fontFamily={fonts.semiBold}>
          {`${ads}  Ads Listing `}
        </CustomText>
      </View>
      <View key={index} style={styles.opportunityRow}>
        <Icons
          name="check-underline"
          family={'MaterialCommunityIcons'}
          size={24}
          color="#00BA00"
          style={styles.icon}
        />
        <CustomText
          textStyle={styles.opportunityText}
          fontFamily={fonts.semiBold}>{`${days} Days`}</CustomText>
      </View>
      {/* ))} */}
      <CustomText
        label={description}
        textAlign={'center'}
        marginTop={12}
        marginLeft={10}
      />
      <CustomText
        label={price}
        alignSelf={'center'}
        fontSize={32}
        fontFamily={fonts.bold}
        marginTop={18}
        marginBottom={18}
      />
      <CustomButton
        title={buttonTitle}
        marginBottom={14}
        disabled={disabled}
        onPress={onPress}
        loading={loading}
      />
    </View>
  );
};

export default PremiumCard;

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 1,
  },
  topText: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  opportunityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
  opportunityText: {
    fontSize: 16,
    // color: '#475569',
  },
});
