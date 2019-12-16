import React from 'react';
import {
  Image,Platform,ScrollView,StyleSheet,
  Text,TouchableOpacity,View,Slider,
  Dimensions, Alert, FlatList, AppState, BackHandler , AsyncStorage,ActivityIndicator,ToastAndroid,RefreshControl
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import  Constants  from 'expo-constants';
import { StackActions, NavigationActions } from 'react-navigation';

export default class DefaultScreen extends React.Component{

     componentWillMount(){
          AsyncStorage.getItem("login").then((value) => {
            var mainPage = value == null ? 'Login' : JSON.parse(value) == true ? 'Tab':'Login';
            var resetAction = StackActions.reset({
              index: 0,
              actions: [NavigationActions.navigate({ routeName: mainPage, })],
            });
            this.props.navigation.dispatch(resetAction);
          })
        }


    render(){
        return(
          <View style={{flex:1,backgroundColor:"#f2f2f2"}}></View>
      );
    }
  }
