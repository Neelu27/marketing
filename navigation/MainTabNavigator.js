import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator ,createAppContainer,} from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import DefaultScreen from '../screens/DefaultScreen';
import ExploreCampaign from '../screens/ExploreCampaign';
import TabBar from '../components/TabBar';
// import Calender from '../screens/Calender';
import TimelineCard from '../components/TimelineCard';
import CampaingnItem from '../screens/CampaingnItem';
import CampaingnItemExplore from '../screens/CampaingnItemExplore';
import CampaingnItemTimeLine from '../components/CampaingnItemTimeLine';
import NewCampaign from '../screens/NewCampaign';
import FlatlistSelect from '../components/FlatlistSelect';
import CameraScreen from '../screens/CameraScreen';
// import Country from'../screens/Country';
// const initialNavigator = createStackNavigator(
//   {
//     Home: HomeScreen,
//     Detail: DetailsScreen,
//   },
//   {
//     initialRouteName: "Home"
//   });
// export default initialNavigator;
const HomeStack = createStackNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: {
      header: null,
    },
  }
});

HomeStack.navigationOptions = {
    tabBarLabel: 'Contact',
    tabBarOptions: {
        activeTintColor: "#2b79b0",
        inactiveTintColor: '#ccc',
        activeBackgNestedCardroundColor: '#ffffff',
        inactiveBackgroundColor: '#ffffff',
    },
    tabBarIcon: ({focused, tintColor }) => (
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios'? `ios-call${focused ? '' : '-outline'}`: 'md-call'}
        active={tintColor}
        inactive={tintColor}
      />
    ),
};

const navigate = createStackNavigator({
    DefaultScreen:{
          screen: DefaultScreen,
          navigationOptions: {
          header: null,
         }
       },
    Login:{
          screen: LoginScreen,
          navigationOptions: {
          header: null,
        }
       },

   Tab:{
         screen: HomeScreen,
         navigationOptions: {
         header: null,
        }
     },
     ExploreCampaign,
     TabBar,
     // Calender,
     TimelineCard,
     CampaingnItem,
     CampaingnItemExplore,
     CampaingnItemTimeLine,
     NewCampaign,
     FlatlistSelect,
     CameraScreen,
     // Country,
},

{ initialRouteName:'DefaultScreen' });
export default createAppContainer(navigate);
