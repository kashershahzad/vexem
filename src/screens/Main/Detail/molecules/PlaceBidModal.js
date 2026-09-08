import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import fonts from '../../../../assets/fonts';
import CustomButton from '../../../../components/CustomButton';
import CustomModal from '../../../../components/CustomModal';
import CustomText from '../../../../components/CustomText';
import Icons from '../../../../components/Icons';
import ApiRequest from '../../../../services/ApiRequest';
import { colors } from '../../../../utils/colors';
import { ToastMessage } from '../../../../utils/ToastMessage';

const PlaceBidModal = ({
  isVisible,
  onDisable,
  maxBid,
  id,
  auctionPrice,
  fetchData,
}) => {
  const [price, setPrice] = useState(auctionPrice);
  const [suggestionPrices, setSuggestionPrices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { token, loginUser } = useSelector(state => state.user);

  const handleFilterPress = async () => {
    setRefreshing(true);
    try {
      const dataToGet = {
        type: 'add_data',
        table_name: 'items_bids',
        user_id: token,
        item_id: id,
        amount: price,
      };
      const response = await ApiRequest(dataToGet);

      if (response.data.result) {
        fetchData();
        onDisable();
        ToastMessage('Bid Added');
        // setTimeout(() => {
        //   navigation.goBack();
        // }, 800);
      }else{
        ToastMessage(response.data.message);
      }
    } catch (error) {
      console.log(error, 'err in added bid');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const prices = [];
    for (let i = 1; i <= 5; i++) {
      prices.push(
        prices.length === 0
          ? Number(maxBid) + Number(price)
          : Number(prices[prices.length - 1]) + Number(maxBid),
      );
    }
    setSuggestionPrices(prices);
  }, [maxBid]);

  const incrementPrice = () => {
    setPrice(Number(price) + Number(maxBid));
  };

  const decrementPrice = () => {
    if (auctionPrice < price) {
      setPrice(Number(price) - Number(maxBid));
    }
  };

  const setSuggestionPrice = suggestionPrice => {
    setPrice(suggestionPrice);
  };

  return (
    <CustomModal isChange isVisible={isVisible} onDisable={onDisable}>
      <View style={styles.mainContainer}>
        <View style={{ marginVertical: 12, alignSelf: 'center' }}>
          <CustomText
            label="Place a Bid"
            fontFamily={fonts.bold}
            fontSize={16}
            textAlign="center"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionContainer}>
          {suggestionPrices.map((suggestionPrice, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.6}
              style={styles.suggestionBox}
              onPress={() => setSuggestionPrice(suggestionPrice)}>
              <CustomText
                label={'$'}
                fontSize={16}
                fontFamily={fonts.semiBold}
              />
              <CustomText
                label={`${suggestionPrice}`}
                fontSize={16}
                fontFamily={fonts.semiBold}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.priceContainer}>
          <TouchableOpacity onPress={decrementPrice} style={styles.iconButton}>
            <Icons
              name={'minus'}
              family={'FontAwesome'}
              size={12}
              color={colors.white}
            />
          </TouchableOpacity>
          <View style={styles.priceInput}>
            <CustomText label={'$'} fontSize={15} fontFamily={fonts.bold} />
            <CustomText
              label={price}
              fontSize={24}
              fontFamily={fonts.bold}
              numberOfLines={1}
            />
          </View>
          <TouchableOpacity onPress={incrementPrice} style={styles.iconButton}>
            <Icons
              name={'plus'}
              family={'FontAwesome'}
              size={12}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.currentTxt}>
          {loginUser?.user_lang === 'ar' ? (
            <View style={styles.row}>
              <View style={styles.row}>
                <CustomText label={'$'} />
                <CustomText label={`${maxBid}`} numberOfLines={1} />
              </View>
              <CustomText label={'Current bid :'} />
            </View>
          ) : (
            <View style={styles.row}>
              <CustomText label={'Bid Increment:'} />
              <View style={styles.row}>
                <CustomText label={'$'} />
                <CustomText label={`${maxBid}`} numberOfLines={1} />
              </View>
            </View>
          )}
        </View>
        <CustomButton
          title="Place Bid"
          marginBottom={10}
          onPress={handleFilterPress}
          disabled={refreshing || auctionPrice == price}
          loading={refreshing}
          customStyle={{
            backgroundColor:
              auctionPrice == price ? colors.grey : colors.primaryColor,
          }}
        />
      </View>
    </CustomModal>
  );
};

export default PlaceBidModal;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.white,
    padding: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: 20,
  },
  suggestionContainer: {
    marginVertical: 10,
  },
  suggestionBox: {
    backgroundColor: colors.lightGrey,
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.primaryColor,
    marginHorizontal: 8,
  },
  priceInput: {
    padding: 4,
    borderWidth: 1,
    paddingHorizontal: 34,
    borderRadius: 8,
    borderColor: colors.grey,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
    maxWidth: 210,
    justifyContent: 'center',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 5,
  },
  currentTxt: {
    marginTop: 12,
    marginBottom: 22,
    alignItems: 'center',
  },
});
