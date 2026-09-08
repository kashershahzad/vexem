import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ChangeLanguage from '../screens/Auth/ChangeLanguage';
import ApplyJob from '../screens/Main/ApplyJob';
import ApplicantProfile from '../screens/Main/ApplyJob/ApplicantProfile';
import JobApplication from '../screens/Main/ApplyJob/JobApplication';
import JobApplicationList from '../screens/Main/ApplyJob/JobApplicationList';
import ProfileIntro from '../screens/Main/ApplyJob/ProfileIntro';
import Categories from '../screens/Main/Categories';
import ChatList from '../screens/Main/Chat';
import ChatScreen from '../screens/Main/Chat/ChatScreen';
import CreateNews from '../screens/Main/CreateNews';
import BlogsCat from '../screens/Main/CreateNews/BlogsCat';
import NewsLanguage from '../screens/Main/CreateNews/NewsLanguage';
import Detail from '../screens/Main/Detail';
import EditProfile from '../screens/Main/EditProfile';
import Filter from '../screens/Main/Filter';
import JobCategory from '../screens/Main/Jobs/JobCategory';
import JobDetail from '../screens/Main/Jobs/JobDetail';
import JobInfo from '../screens/Main/Jobs/JobInfo';
import JobSubCategory from '../screens/Main/Jobs/JobSubCategory';
import Recruiter from '../screens/Main/Jobs/Recruiter';
import Seeker from '../screens/Main/Jobs/Seeker';
import AdsLocation from '../screens/Main/Listing/AdsLocation';
import CreateAd from '../screens/Main/Listing/CreateAd';
import CreateOfferAd from '../screens/Main/Listing/CreateOfferAd';
import CustomFields from '../screens/Main/Listing/CustomFields';
import SubCategories from '../screens/Main/Listing/SubCategories';
import SubSubCategory from '../screens/Main/Listing/SubSubCategory';
import SubSubSubCategory from '../screens/Main/Listing/SubSubSubCategory';
import JobDone from '../screens/Main/NewJobProfile/JobDone';
import NewJobProfile from '../screens/Main/NewJobProfile/NewJobProfile';
import News from '../screens/Main/News';
import BlogDetails from '../screens/Main/News/BlogDetails';
import Events from '../screens/Main/News/Events';
import FavouritesNews from '../screens/Main/News/FavouritesNews';
import FilterNews from '../screens/Main/News/FilterNews';
import NewsDetails from '../screens/Main/News/NewsDetails';
import Notifications from '../screens/Main/Notifications';
import PremiumScreen from '../screens/Main/PremiumScreen';
import AboutUs from '../screens/Main/Profile/ProfileScreens/AboutUs';
import Bookmark from '../screens/Main/Profile/ProfileScreens/Bookmark';
import ChangePassword from '../screens/Main/Profile/ProfileScreens/ChangePassword';
import ContactUs from '../screens/Main/Profile/ProfileScreens/ContactUs';
import Favorite from '../screens/Main/Profile/ProfileScreens/Favorite';
import FeaturedAd from '../screens/Main/Profile/ProfileScreens/FeaturedAd';
import MyOfferAds from '../screens/Main/Profile/ProfileScreens/MyOfferAds';
import PrivacyPolicy from '../screens/Main/Profile/ProfileScreens/PrivacyPolicy';
import Terms from '../screens/Main/Profile/ProfileScreens/Terms';
import VerifyDocuments from '../screens/Main/Profile/ProfileScreens/VerifyDocuments';
import Setting from '../screens/Main/Profile/Setting';
import ReportAd from '../screens/Main/ReportAd';
import Result from '../screens/Main/Result';
import UserAdd from '../screens/Main/Result/UserAdd';
import StoreDetails from '../screens/Main/StoreDetails';
import OfferAdDetails from '../screens/Main/StoreDetails/OfferAdDetails';
import StorePage from '../screens/Main/StoreDetails/StorePage';
import SuccessScreen from '../screens/Main/Sucess';
import TransHistory from '../screens/Main/TransHistory';
import TabStack from './TabStack';
import SubCategoriesNew from '../screens/Main/Listing/SubCategoriesNew';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="TabStack"
      >
      <Stack.Screen name="TabStack" component={TabStack} />
      <Stack.Screen name="News" component={News} />
      <Stack.Screen name="Result" component={Result} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="SubCategories" component={SubCategories} />
      <Stack.Screen name="SubSubCategory" component={SubSubCategory} />
      <Stack.Screen name="SubSubSubCategory" component={SubSubSubCategory} />
      <Stack.Screen name="CreateAd" component={CreateAd} />
      <Stack.Screen name="AdsLocation" component={AdsLocation} />
      <Stack.Screen name="CustomFields" component={CustomFields} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="NewsDetails" component={NewsDetails} />
      <Stack.Screen name="BlogDetails" component={BlogDetails} />
      <Stack.Screen name="FilterNews" component={FilterNews} />
      <Stack.Screen name="Events" component={Events} />
      <Stack.Screen name="FeaturedAd" component={FeaturedAd} />
      <Stack.Screen name="Favorite" component={Favorite} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <Stack.Screen name="TransHistory" component={TransHistory} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="Terms" component={Terms} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="AboutUs" component={AboutUs} />
      <Stack.Screen name="Bookmark" component={Bookmark} />
      <Stack.Screen name="PremiumScreen" component={PremiumScreen} />
      <Stack.Screen name="Filter" component={Filter} />
      <Stack.Screen name="JobCategory" component={JobCategory} />
      <Stack.Screen name="JobSubCategory" component={JobSubCategory} />
      <Stack.Screen name="Recruiter" component={Recruiter} />
      <Stack.Screen name="Seeker" component={Seeker} />
      <Stack.Screen name="JobDetail" component={JobDetail} />
      <Stack.Screen name="CreateOfferAd" component={CreateOfferAd} />
      <Stack.Screen name="JobInfo" component={JobInfo} />
      <Stack.Screen name="BlogsCat" component={BlogsCat} />
      <Stack.Screen name="CreateNews" component={CreateNews} />
      <Stack.Screen name="NewsLanguage" component={NewsLanguage} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="StoreDetails" component={StoreDetails} />
      <Stack.Screen name="OfferAdDetails" component={OfferAdDetails} />
      <Stack.Screen name="MyOfferAds" component={MyOfferAds} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ApplyJob" component={ApplyJob} />
      <Stack.Screen name="NewJobProfile" component={NewJobProfile} />
      <Stack.Screen name="ReportAd" component={ReportAd} />
      <Stack.Screen name="JobApplication" component={JobApplication} />
      <Stack.Screen name="JobApplicationList" component={JobApplicationList} />
      <Stack.Screen name="ApplicantProfile" component={ApplicantProfile} />
      <Stack.Screen name="StorePage" component={StorePage} />
      <Stack.Screen name="ProfileIntro" component={ProfileIntro} />
      <Stack.Screen name="JobDone" component={JobDone} />
      <Stack.Screen name="Chat" component={ChatList} />
      <Stack.Screen name="VerifyDocuments" component={VerifyDocuments} />
      <Stack.Screen name="Setting" component={Setting} />
      <Stack.Screen name="UserAdd" component={UserAdd} />
      <Stack.Screen name="FavouritesNews" component={FavouritesNews} />


      {/* New */}
      {/* <Stack.Screen name="SubCategoriesNew" component={SubCategoriesNew} /> */}
    </Stack.Navigator>
  );
};

export default MainStack;
