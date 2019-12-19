import React, {Component} from 'react';
import {Animated,TextInput,Alert,Dimensions, ScrollView,View,Image, StatusBar, Text,  Platform,Keyboard, StyleSheet, Linking,WebView,ToastAndroid, TouchableOpacity,LayoutAnimation,KeyboardAvoidingView,Button,ImageBackground,FlatList,AsyncStorage,TouchableHighlight,AppState} from 'react-native';
import {ScrollableTabView , ScrollableTabBar,DefaultTabBar,} from '@valdio/react-native-scrollable-tabview';
import * as MailComposer from 'expo-mail-composer';
import * as FileSystem from 'expo-file-system';
import HomeScreen from '../screens/HomeScreen';
import * as WebBrowser from 'expo-web-browser';
// import Calender from '../screens/Calender';
import { Ionicons,FontAwesome,FontAwesome5 } from '@expo/vector-icons';
import Constants from 'expo-constants';
import Modal from 'react-native-modalbox';
import Model from 'react-native-model';
import TabBar from '../components/TabBar';
import TimelineCard from '../components/TimelineCard';
import DatePicker from 'react-native-datepicker';
const { width } = Dimensions.get('window');
import { withNavigationFocus } from 'react-navigation';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';


export default class ExploreCampaign extends Component {

     static navigationOptions =  ({ navigation }) => {
            const { params = {} } = navigation.state
               return {header:null,}
                   }


    constructor(props) {
            super(props);
            this.state = {
                email:'test1@gmail.com',
                mobile:'8745645364',
                inputtext:'',
                date:(new Date()),
                CampaignExp:[],
                CampaignData:[],
                SERVER_URL:'',
                sessionid:'',
                csrf:'',
                Save:[],
                Save1:[],
                appState:AppState.currentState,
                SaveFollowUp:[],
                SaveFollow:[],
                SaveFollowNote:[],
                isOpen:false,
                notes:'',
                went:false,
                isOpen2:false,
                ContactNumber:[],
                modalVisible: false,
            };
            Keyboard.addListener('keyboardDidHide',this.showKeyboard)
            Keyboard.addListener('keyboardDidShow', this.hideKeyboard)
      }


    showKeyboard =()=>{
            this.setState({keyboardOpen : false})
            this.setState({scrollHeight:this.state.scrollHeight+500})
            setTimeout(()=>{
              if (this.refs == undefined || this.refs._scrollView == undefined || this.refs._scrollView.scrollToEnd == undefined){
                return
              }
              this.refs._scrollView.scrollToEnd({animated: true});
            }, 500);
    }

    hideKeyboard =(e)=>{
            this.setState({keyboardOpen : true})
            this.setState({keyboardHeight:e.endCoordinates.height+40});
            try{
              this.setState({scrollHeight:this.state.scrollHeight-500})
            }catch(e){}
             finally{}
             setTimeout(()=>{
               if (this.refs == undefined || this.refs._scrollView == undefined || this.refs._scrollView.scrollToEnd == undefined) {
                 return
               }
               this.refs._scrollView.scrollToEnd({animated: true});
             }, 500);
       }

       componentDidMount=async()=>{
             const campaignpk= await AsyncStorage.getItem('campaignpk');
             console.log(campaignpk,'campaignpkExplore')
             this.getCampaignEX();
             this.getCampaignData();
             // AppState.addEventListener('change', this._handleAppStateChange);
       }


        // componentWillUnmount() {
        //   AppState.removeEventListener('change', this._handleAppStateChange);
        // }
        //
        // _handleAppStateChange = (nextAppState) => {
        //   if (this.state.appState.match(/inactive|background/) &&  nextAppState === 'active') {
        //     this.getCampaignEX();
        //
        //   }
        //   this.setState({appState: nextAppState});
        // };


        hideMenu = (mobile) => {
              this[`menu${mobile}`].hide();
        };

        showMenu = (mobile,directNumber,altNumber,altNumber2) => {
              this[`menu${mobile,directNumber,altNumber,altNumber2}`].show();
        };

       getCampaignData=async()=>{
             const campaignpk= await AsyncStorage.getItem('campaignpk');
             const SERVER_URL = await AsyncStorage.getItem('SERVER_URL');
             const sessionid = await AsyncStorage.getItem('sessionthis.getCampaignEX();id');
             const csrf = await AsyncStorage.getItem('csrf');
             this.setState({SERVER_URL:SERVER_URL,sessionid:sessionid,csrf:csrf});
             console.log(SERVER_URL,'rrrrrrrrrr');
               await fetch(SERVER_URL+'/api/marketing/campaign/'+campaignpk+'/',{
                 method:'GET',
                 headers: {
                    "Cookie" :"csrf="+csrf+";"+"sessionid=" + sessionid +";",
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Referer': SERVER_URL,
                 }
               }).then((response) =>{
                 console.log(response,"CampaignDataresponse")
                 if(response.status == '200'){
                  return response.json()
                 }
               }).then((json) => {
                   this.setState({ CampaignData: json,});
                   console.log(this.state.CampaignData,"this.state.CampaignData")
               })
          }

       getCampaignEX =async() => {
              const campaignpk= await AsyncStorage.getItem('campaignpk');
              const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
              const sessionid = await AsyncStorage.getItem('sessionid');
              const csrf = await AsyncStorage.getItem('csrf');
               fetch(SERVER_URL+'/api/marketing/getNextEntry/?id='+campaignpk, {
                 method: 'GET',
                 headers: {
                  "Cookie" :"csrf="+csrf+";sessionid=" + sessionid +";",
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'X-CSRFToken':csrf,
                  'Referer': SERVER_URL
                 }
               }).then((response) =>{
                 console.log(response,"CampaignExpresponse")
                 if(response.status == '200'){
                  return response.json()
                 }
               }).then((json) => {
                   this.setState({ CampaignExp: json,});
                   console.log(this.state.CampaignExp,"this.state.CampaignExp")
               })
          }

       openLink=async(item)=>{
             await WebBrowser.openBrowserAsync(item);
       }
       notInterested(){
             Alert.alert('Confirm', 'Are you sure ?',
              [{text: "Yes", onPress: () => {this.skiped();this.getCampaignEX();}},
                   {
                     text: 'No',
                     onPress: () => {return},
                     style: 'cancel',
                   },
                 ],{ cancelable: false })
       }

       qualify(){
             Alert.alert('Confirm', 'Are you sure ?',
              [{text: "Yes", onPress: () => {this.Qualify();this.getCampaignEX();}},
                   {
                     text: 'No',
                     onPress: () => {return},

                   },{text:'cancel', onPress: () => {return},style: 'cancel',}
                 ],{ cancelable: false })
       }

       skiped=async()=>{
             if(this.state.CampaignExp.status=="end"){
               return
             }
             var attempt=1;
             var attemptdata=attempt+this.state.CampaignExp.contact.attempt;
             var dataSend ={
               skipped	:true,
               attempted	:true,
             }
             const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
             const sessionid = await AsyncStorage.getItem('sessionid');
             const csrf = await AsyncStorage.getItem('csrf');
             fetch(SERVER_URL+'/api/marketing/campaignItem/'+this.state.CampaignExp.contact.pk+'/', {
               method: 'PATCH',
               headers: {
                 "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                 'Content-Type': 'application/json',
                 'X-CSRFToken':csrf,
                 'Referer':SERVER_URL,
                 },
               body:JSON.stringify(dataSend),
               }).then((response) =>{
                 console.log(response.status);
                 console.log(response.status,'KKKKKKKKKKKKKKKKKKPatch');
                 return response.json();
               }).then((json) => {
                 this.setState({Save:[json]});
                 console.log(json,'savedjson ');
                         var dataSend ={
                           campaign: this.state.CampaignExp.contact.campaign,
                           contact	:this.state.CampaignExp.contact.contact.pk,
                           typ:'closed'
                         }
                           fetch(SERVER_URL+'/api/marketing/campaignLogs/', {
                             method: 'POST',
                             headers: {
                               "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                               'Content-Type': 'application/json',
                               'X-CSRFToken':csrf,
                               'Referer':SERVER_URL,
                               },
                             body:JSON.stringify(dataSend),
                             }).then((response) =>{
                               console.log(response.status);
                               console.log(response.status,'KKKKKKKKKKKKKKKKKKPost');
                               return response.json();
                             }).then((json) => {
                               console.log(json,'saved datajson');
                               this.setState({Save1:[json]});
                               console.log(this.state.Save1,'saved data');
                               this.getCampaignEX();

                             })
                             .catch((error) => {
                               Alert.alert(error.message);
                             });

               })
               .catch((error) => {
                 Alert.alert(error.message);
               });

       }

       Qualify=async()=>{
             if(this.state.CampaignExp.status=="end"){
               return
             }
             var attempt=1;
             var attemptdata=attempt+this.state.CampaignExp.contact.attempt;
             var dataSend ={
               status	:'interested',
               attempted	:true,
             }
             const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
             const sessionid = await AsyncStorage.getItem('sessionid');
             const csrf = await AsyncStorage.getItem('csrf');
             fetch(this.state.SERVER_URL+'/api/marketing/campaignItem/'+this.state.CampaignExp.contact.pk+'/', {
               method: 'PATCH',
               headers: {
                 "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                 'Content-Type': 'application/json',
                 'X-CSRFToken':csrf,
                 'Referer':SERVER_URL,
                 },
               body:JSON.stringify(dataSend),
               }).then((response) =>{
                 console.log(response.status);
                 console.log(response.status,'KKKKKKKKKKKKKKKKKKPatch');
                 return response.json();
               }).then((json) => {
                 this.setState({Save:[json]});
                 console.log(json,'savedjson ');
                         var dataSend ={
                           campaign: this.state.CampaignExp.contact.campaign,
                           contact	:this.state.CampaignExp.contact.contact.pk,
                           typ:'converted'
                         }
                           fetch(SERVER_URL+'/api/marketing/campaignLogs/', {
                             method: 'POST',
                             headers: {
                               "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                               'Content-Type': 'application/json',
                               'X-CSRFToken':csrf,
                               'Referer':SERVER_URL,
                               },
                             body:JSON.stringify(dataSend),
                             }).then((response) =>{
                               console.log(response.status);
                               console.log(response.status,'KKKKKKKKKKKKKKKKKKPost');
                               return response.json();
                             }).then((json) => {
                               console.log(json,'saved datajson');
                               this.setState({Save1:[json]});
                               console.log(this.state.Save1,'saved data');
                               this.getCampaignEX();

                             })
                             .catch((error) => {
                               Alert.alert(error.message);
                             });

               })
               .catch((error) => {
                 Alert.alert(error.message);
               });

       }

         makecall=async(mobile,directNumber,altNumber,altNumber2)=>{
                 if(this.state.CampaignExp.status=="end"){
                   return
                 }else{
                 var ContactNumber = []
                 ContactNumber.push({mobile:mobile,directNumber:directNumber,altNumber:altNumber,altNumber2:altNumber2})
                 this.setState({ContactNumber:ContactNumber});
                 console.log(ContactNumber,"ContactNumber")
                 if(ContactNumber.length ==0){
                     var attempt=1;
                     var attemptdata=attempt+this.state.CampaignExp.contact.attempt;
                     var dataSend ={
                       attempt	:attemptdata,
                       attempted	:true,
                     }
                     const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
                     const sessionid = await AsyncStorage.getItem('sessionid');
                     const csrf = await AsyncStorage.getItem('csrf');
                       fetch(SERVER_URL+'/api/marketing/campaignItem/'+this.state.CampaignExp.contact.pk+'/', {
                         method: 'PATCH',
                         headers: {
                           "Cookie" :"csrftoken="+csrf+";sessionid=" +sessionid +";",
                           'Content-Type': 'application/json',
                           'X-CSRFToken':csrf,
                           'Referer':SERVER_URL,
                           },
                         body:JSON.stringify(dataSend),
                         }).then((response) =>{
                           console.log(response.status);
                           console.log(response.status,'KKKKKKKKKKKKKKKKKKPatch');
                           return response.json();
                         }).then((json) => {
                           this.setState({Save:[json]});
                           console.log(json,'savedjson ');
                                var dataSend ={
                                campaign: this.state.CampaignExp.contact.campaign,
                                contact	:(this.state.CampaignExp.contact==null?'':this.state.CampaignExp.contact.contact.pk),
                                typ:'outbound'
                                }
                                fetch(SERVER_URL+'/api/marketing/campaignLogs/', {
                                    method: 'POST',
                                    headers: {
                                         "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                                         'Content-Type': 'application/json',
                                         'X-CSRFToken':csrf,
                                         'Referer':SERVER_URL,
                                    },
                                    body:JSON.stringify(dataSend),
                                    }).then((response) =>{
                                      console.log(response.status);
                                      console.log(response.status,'KKKKKKKKKKKKKKKKKKPost');
                                      this.props.navigation.navigate('ExploreCampaign',{
                                      went: true,
                                      })
                                      return response.json();
                                      }).then((json) => {
                                      console.log(json,'saved datajson');
                                      this.setState({Save1:[json]});
                                      console.log(this.state.Save1,'saved data');
                                      Linking.openURL('tel://'+directNumber)
                                      this.getCampaignEX();
                                      })
                                     .catch((error) => {
                                         Alert.alert(error.message);
                                    });
                         })
                         .catch((error) => {
                           Alert.alert(error.message);
                         });
                 }
                   else if(ContactNumber.length >= 1){
                     if(mobile==directNumber==altNumber==altNumber2){
                         const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
                         const sessionid = await AsyncStorage.getItem('sessionid');
                         const csrf = await AsyncStorage.getItem('csrf');
                           fetch(SERVER_URL+'/api/marketing/campaignItem/'+campaign.pk+'/', {
                             method: 'PATCH',
                             headers: {
                               "Cookie" :"csrftoken="+csrf+";sessionid=" +sessionid +";",
                               'Content-Type': 'application/json',
                               'X-CSRFToken':csrf,
                               'Referer':SERVER_URL,
                               },
                             body:JSON.stringify(dataSend),
                             }).then((response) =>{
                               console.log(response.status);
                               console.log(response.status,'KKKKKKKKKKKKKKKKKKPatch');
                               return response.json();
                             }).then((json) => {
                               this.setState({Save:[json]});
                               console.log(json,'savedjson ');
                                    var dataSend ={
                                    campaign: campaign.campaign,
                                    contact	:campaign.contact.pk,
                                    typ:'outbound'
                                    }
                                    fetch(SERVER_URL+'/api/marketing/campaignLogs/', {
                                        method: 'POST',
                                        headers: {
                                             "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                                             'Content-Type': 'application/json',
                                             'X-CSRFToken':csrf,
                                             'Referer':SERVER_URL,
                                        },
                                        body:JSON.stringify(dataSend),
                                        }).then((response) =>{
                                          console.log(response.status);
                                          console.log(response.status,'KKKKKKKKKKKKKKKKKKPost');
                                          this.props.navigation.navigate('CampaingnItemExplore',{
                                          went: true,
                                          })
                                          return response.json();
                                          }).then((json) => {
                                          console.log(json,'saved datajson');
                                          this.setState({Save1:[json]});

                                          Linking.openURL('tel://'+directNumber)

                                          })
                                         .catch((error) => {
                                             Alert.alert(error.message);
                                        });
                             })
                             .catch((error) => {
                               Alert.alert(error.message);
                             });
                           }else{
                               this.setState({isOpen2:true});
                               this.showMenu(mobile,directNumber,altNumber,altNumber2);
                     }
                  }else{
                    return
                  }
              }
            }

            mobile=async(mobile)=>{
                if(this.state.CampaignExp.status=="end"){
                  return
                }
                var attempt=1;
                var attemptdata=attempt+this.state.CampaignExp.contact.attempt;
                var dataSend ={
                  attempt	:attemptdata,
                  attempted	:true,
                }
                const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
                const sessionid = await AsyncStorage.getItem('sessionid');
                const csrf = await AsyncStorage.getItem('csrf');
                  fetch(SERVER_URL+'/api/marketing/campaignItem/'+this.state.CampaignExp.contact.pk+'/', {
                    method: 'PATCH',
                    headers: {
                      "Cookie" :"csrftoken="+csrf+";sessionid=" +sessionid +";",
                      'Content-Type': 'application/json',
                      'X-CSRFToken':csrf,
                      'Referer':SERVER_URL,
                      },
                    body:JSON.stringify(dataSend),
                    }).then((response) =>{
                      console.log(response.status);
                      console.log(response.status,'KKKKKKKKKKKKKKKKKKPatch');
                      return response.json();
                    }).then((json) => {
                      this.setState({Save:[json]});
                      console.log(json,'savedjson ');
                              var dataSend ={
                                campaign: this.state.CampaignExp.contact.campaign,
                                contact	:this.state.CampaignExp.contact.contact.pk,
                                typ:'outbound'
                              }
                                fetch(SERVER_URL+'/api/marketing/campaignLogs/', {
                                  method: 'POST',
                                  headers: {
                                    "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken':csrf,
                                    'Referer':SERVER_URL,
                                    },
                                  body:JSON.stringify(dataSend),
                                  }).then((response) =>{
                                    console.log(response.status);
                                    console.log(response.status,'KKKKKKKKKKKKKKKKKKPost');
                                    this.props.navigation.navigate('ExploreCampaign',{
                                      went: true,
                                    })
                                    return response.json();
                                  }).then((json) => {
                                    console.log(json,'saved datajson');
                                    this.setState({Save1:[json]});
                                    console.log(this.state.Save1,'saved data');
                                    Linking.openURL('tel://'+mobile)
                                    this.hideMenu(mobile);
                                    this.getCampaignEX();
                                  })
                                  .catch((error) => {
                                    Alert.alert(error.message);
                                  });
                    })
                    .catch((error) => {
                      Alert.alert(error.message);
                    });
            }

            Dno=async(number)=>{
                if(this.state.CampaignExp.status=="end"){
                  return
                }
                var attempt=1;
                var attemptdata=attempt+this.state.CampaignExp.contact.attempt;
                var dataSend ={
                  attempt	:attemptdata,
                  attempted	:true,
                }
                const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
                const sessionid = await AsyncStorage.getItem('sessionid');
                const csrf = await AsyncStorage.getItem('csrf');
                  fetch(SERVER_URL+'/api/marketing/campaignItem/'+this.state.CampaignExp.contact.pk+'/', {
                    method: 'PATCH',
                    headers: {
                      "Cookie" :"csrftoken="+csrf+";sessionid=" +sessionid +";",
                      'Content-Type': 'application/json',
                      'X-CSRFToken':csrf,
                      'Referer':SERVER_URL,
                      },
                    body:JSON.stringify(dataSend),
                    }).then((response) =>{
                      console.log(response.status);
                      console.log(response.status,'KKKKKKKKKKKKKKKKKKPatch');
                      return response.json();
                    }).then((json) => {
                      this.setState({Save:[json]});
                      console.log(json,'savedjson ');
                              var dataSend ={
                                campaign: this.state.CampaignExp.contact.campaign,
                                contact	:this.state.CampaignExp.contact.contact.pk,
                                typ:'outbound'
                              }
                                fetch(SERVER_URL+'/api/marketing/campaignLogs/', {
                                  method: 'POST',
                                  headers: {
                                    "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken':csrf,
                                    'Referer':SERVER_URL,
                                    },
                                  body:JSON.stringify(dataSend),
                                  }).then((response) =>{
                                    console.log(response.status);
                                    console.log(response.status,'KKKKKKKKKKKKKKKKKKPost');
                                    this.props.navigation.navigate('ExploreCampaign',{
                                      went: true,
                                    })
                                    return response.json();
                                  }).then((json) => {
                                    console.log(json,'saved datajson');
                                    this.setState({Save1:[json]});
                                    console.log(this.state.Save1,'saved data');
                                    Linking.openURL('tel://'+number)
                                      this.hideMenu(number);
                                    this.getCampaignEX();
                                  })
                                  .catch((error) => {
                                    Alert.alert(error.message);
                                  });
                    })
                    .catch((error) => {
                      Alert.alert(error.message);
                    });
            }

            altNumber=async(number)=>{
                if(this.state.CampaignExp.status=="end"){
                  return
                }
                var attempt=1;
                var attemptdata=attempt+this.state.CampaignExp.contact.attempt;
                var dataSend ={
                  attempt	:attemptdata,
                  attempted	:true,
                }
                const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
                const sessionid = await AsyncStorage.getItem('sessionid');
                const csrf = await AsyncStorage.getItem('csrf');
                  fetch(SERVER_URL+'/api/marketing/campaignItem/'+this.state.CampaignExp.contact.pk+'/', {
                    method: 'PATCH',
                    headers: {
                      "Cookie" :"csrftoken="+csrf+";sessionid=" +sessionid +";",
                      'Content-Type': 'application/json',
                      'X-CSRFToken':csrf,
                      'Referer':SERVER_URL,
                      },
                    body:JSON.stringify(dataSend),
                    }).then((response) =>{
                      console.log(response.status);
                      console.log(response.status,'KKKKKKKKKKKKKKKKKKPatch');
                      return response.json();
                    }).then((json) => {
                      this.setState({Save:[json]});
                      console.log(json,'savedjson ');
                              var dataSend ={
                                campaign: this.state.CampaignExp.contact.campaign,
                                contact	:this.state.CampaignExp.contact.contact.pk,
                                typ:'outbound'
                              }
                                fetch(SERVER_URL+'/api/marketing/campaignLogs/', {
                                  method: 'POST',
                                  headers: {
                                    "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken':csrf,
                                    'Referer':SERVER_URL,
                                    },
                                  body:JSON.stringify(dataSend),
                                  }).then((response) =>{
                                    console.log(response.status);
                                    console.log(response.status,'KKKKKKKKKKKKKKKKKKPost');
                                    this.props.navigation.navigate('ExploreCampaign',{
                                      went: true,
                                    })
                                    return response.json();
                                  }).then((json) => {
                                    console.log(json,'saved datajson');
                                    this.setState({Save1:[json]});
                                    console.log(this.state.Save1,'saved data');
                                    Linking.openURL('tel://'+number)
                                    this.hideMenu(number);
                                    this.getCampaignEX();
                                  })
                                  .catch((error) => {
                                    Alert.alert(error.message);
                                  });
                    })
                    .catch((error) => {
                      Alert.alert(error.message);
                    });
            }


            altNumber2=async(number)=>{
                if(this.state.CampaignExp.status=="end"){
                  return
                }
                var attempt=1;
                var attemptdata=attempt+this.state.CampaignExp.contact.attempt;
                var dataSend ={
                  attempt	:attemptdata,
                  attempted	:true,
                }
                const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
                const sessionid = await AsyncStorage.getItem('sessionid');
                const csrf = await AsyncStorage.getItem('csrf');
                  fetch(SERVER_URL+'/api/marketing/campaignItem/'+this.state.CampaignExp.contact.pk+'/', {
                    method: 'PATCH',
                    headers: {
                      "Cookie" :"csrftoken="+csrf+";sessionid=" +sessionid +";",
                      'Content-Type': 'application/json',
                      'X-CSRFToken':csrf,
                      'Referer':SERVER_URL,
                      },
                    body:JSON.stringify(dataSend),
                    }).then((response) =>{
                      console.log(response.status);
                      console.log(response.status,'KKKKKKKKKKKKKKKKKKPatch');
                      return response.json();
                    }).then((json) => {
                      this.setState({Save:[json]});
                      console.log(json,'savedjson ');
                              var dataSend ={
                                campaign: this.state.CampaignExp.contact.campaign,
                                contact	:this.state.CampaignExp.contact.contact.pk,
                                typ:'outbound'
                              }
                                fetch(SERVER_URL+'/api/marketing/campaignLogs/', {
                                  method: 'POST',
                                  headers: {
                                    "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken':csrf,
                                    'Referer':SERVER_URL,
                                    },
                                  body:JSON.stringify(dataSend),
                                  }).then((response) =>{
                                    console.log(response.status);
                                    console.log(response.status,'KKKKKKKKKKKKKKKKKKPost');
                                    this.props.navigation.navigate('ExploreCampaign',{
                                      went: true,
                                    })
                                    return response.json();
                                  }).then((json) => {
                                    console.log(json,'saved datajson');
                                    this.setState({Save1:[json]});
                                    console.log(this.state.Save1,'saved data');
                                    Linking.openURL('tel://'+number)
                                    this.hideMenu(number);
                                    this.getCampaignEX();
                                  })
                                  .catch((error) => {
                                    Alert.alert(error.message);
                                  });
                    })
                    .catch((error) => {
                      Alert.alert(error.message);
                    });
            }

            CallFollowup=async()=>{
                  if(this.state.CampaignExp.status=="end"){
                    return
                  }
                  var dataSend ={
                  campaign:this.state.CampaignExp.contact.campaign,
                  data:this.state.notes,
                  contact:this.state.CampaignExp.contact.contact.pk,
                  followupDate:this.state.date,
                  typ:'followup',
                }
                  const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
                  const sessionid = await AsyncStorage.getItem('sessionid');
                  const csrf = await AsyncStorage.getItem('csrf');
                  fetch(SERVER_URL+'/api/marketing/campaignLogs/', {
                    method: 'POST',
                    headers: {
                      "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                      'Content-Type': 'application/json',
                      'X-CSRFToken':csrf,
                      'Referer':SERVER_URL,
                      },
                    body:JSON.stringify(dataSend),
                    }).then((response) =>{
                      console.log(response.status);
                      console.log(response.status,'KKKKKKKKKKKKKKKKKKPatch');
                      return response.json();
                    }).then((json) => {
                      this.setState({SaveFollow:[json]});
                      console.log(json,'savedjson SaveFollow ');

                                  var dataSend ={
                                    attempted	:true,
                                    followUp:true,
                                    followUpDate:this.state.date,
                                  }
                                fetch(SERVER_URL+'/api/marketing/campaignItem/'+this.state.CampaignExp.contact.pk+'/', {
                                  method: 'PATCH',
                                  headers: {
                                    "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                                    'Content-Type': 'application/json',
                                    'X-CSRFToken':csrf,
                                    'Referer':SERVER_URL,
                                    },
                                  body:JSON.stringify(dataSend),
                                  }).then((response) =>{
                                    console.log(response.status);
                                    console.log(response.status,'KKKKKKKKKKKKKKKKKKPost');
                                    this.props.navigation.navigate('ExploreCampaign',{
                                      wentcallfollowup: true,
                                    })
                                    return response.json();
                                  }).then((json) => {
                                    console.log(json,'saved datajson');
                                    this.setState({SaveFollowUp:[json]});
                                    console.log(this.state.SaveFollowUp,'saved data SaveFollow');
                                    this.setState({notes:'',isOpen:false});
                                      this.getCampaignEX();
                                  })
                                  .catch((error) => {
                                    Alert.alert(error.message);
                                  });
                    })
                    .catch((error) => {
                      Alert.alert(error.message);
                    });
            }

            Save=async()=>{
                  if(this.state.CampaignExp.status=="end"){
                    return
                  }
                  var dataSend ={
                  campaign:this.state.CampaignExp.contact.campaign,
                  data:this.state.inputtext,
                  contact:this.state.CampaignExp.contact.contact.pk,
                  typ:'comment',
                }
                  const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
                  const sessionid = await AsyncStorage.getItem('sessionid');
                  const csrf = await AsyncStorage.getItem('csrf');
                  fetch(SERVER_URL+'/api/marketing/campaignLogs/', {
                    method: 'POST',
                    headers: {
                      "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                      'Content-Type': 'application/json',
                      'X-CSRFToken':csrf,
                      'Referer':SERVER_URL,
                      },
                    body:JSON.stringify(dataSend),
                    }).then((response) =>{

                      console.log(response.status);
                      console.log(response.status,'KKKKKKKKKKKKKKKKKKPatch');

                          this.props.navigation.navigate('ExploreCampaign',{
                            wentBack: true,
                          })

                      return response.json();
                    }).then((json) => {
                      this.getCampaignEX();
                      this.setState({SaveFollowNote:[json]});
                      console.log(json,'savedjson SaveFollow ');
                      this.setState({inputtext:''});


                  })
                    .catch((error) => {
                      Alert.alert(error.message);
                  });
            }

            componentWillReceiveProps=async()=>{
                this.getCampaignEX();
            }
            isOpen(){
                this.setState({ isOpen: false });
            }

            componentWillReceiveProps({navigation}) {
                console.log(navigation,'rrrrrrrrrrrrrrrr');
                var update = navigation.getParam('wentBack',null)
                if(update == true){
                  this.getCampaignEX()
                }
                if(this.state.went==true){
                  this.getCampaignEX()
                }

          }

          // setModalVisible(visible) {
          //       console.log('clickedddddddddd');
          //       this.setState({modalVisible: visible});
          //   }

          model(){
              if(this.state.CampaignExp.contact!=null){
                  if(this.state.CampaignExp.contact.contact.about!=null){
                      this.setState({modalVisible:true});
                  }
                  else{
                      ToastAndroid.show('No Data Found', ToastAndroid.SHORT);
                  }
              }
          }

      render() {
        return (
            <View style={{flex:1,marginBottom:0}}>

              <Modal
                      style={[styles.modalView,{marginBottom:100}]}
                      position={'center'}
                      ref={'modal3'}
                      isOpen={this.state.modalVisible}
                      onClosed={()=>{
                        this.setState({modalVisible:false})
                       }}
                       >
                      <View style={[{paddingVertical:15,paddingHorizontal:10,borderWidth:1,marginBottom:0,backgroundColor:'#ffffff'}]}>
                                    <Text>{this.state.CampaignExp.contact==null?'':this.state.CampaignExp.contact.contact.about}</Text>
                            <View style={{}}>
                                <TouchableOpacity onPress={()=>{this.setState({modalVisible:false})}}>
                                    <Text  style={{fontSize:16,color:'#000',fontWeight:'600',backgroundColor: "#1b3f4d",paddingVertical:3,paddingHorizontal: 8,alignSelf:'center',marginTop:15,borderRadius:3}}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
              </Modal>

                <View style={{height:Constants.statusBarHeight,backgroundColor:'#1a689a'}}></View>
                <View style={{backgroundColor: '#ffffff',}}>
                    <View style={{flexDirection:'row'}}>
                          <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={{paddingHorizontal:8,paddingTop:4}}>
                              <Ionicons name={"md-arrow-back"} size={25} color='#000000' />
                          </TouchableOpacity>
                          <View style={{flexDirection:'row',paddingLeft:6}}>
                              <Text style={{fontSize:26,color:'#000000'}}>{this.state.CampaignExp.contact==null?'':this.state.CampaignExp.contact.contact.name}</Text>
                          </View>
                    </View>
                </View>
                <View style={{paddingHorizontal:15,backgroundColor:'#ffffff'}} >
                    <View style={{flexDirection:'column',}}><TouchableOpacity onPress={()=>this.model()} activeOpacity={1}>
                          <View style={{flexDirection:'row',paddingTop:0,paddingLeft:6}}>
                                <Text style={{fontSize:16,color:'#000000',paddingLeft:0}}>{this.state.CampaignExp.contact==null?'':this.state.CampaignExp.contact.contact.companyName}</Text>
                          </View>
                          <View style={{flexDirection:'row',paddingTop:3,paddingBottom:2}}>
                                <Text style={{fontSize:16,color:'#000',paddingTop:8,paddingBottom:4,paddingRight:6}}>{this.state.CampaignExp.contact==null?'':this.state.CampaignExp.contact.contact.city}</Text>
                                <Text style={{fontSize:16,color:'#000',paddingTop:8,paddingBottom:4,paddingHorizontal:0}}>{this.state.CampaignExp.contact==null?'':this.state.CampaignExp.contact.contact.country}</Text>
                          </View></TouchableOpacity>
                          <View style={{flexDirection:'row',paddingVertical:5,paddingLeft:2,justifyContent:'space-between'}}>
                                <TouchableOpacity onPress={()=>this.openLink(this.state.CampaignExp.contact.contact.website)}>
                                    <Text style={{fontSize:16,color:'#000000',paddingLeft:2}}>{this.state.CampaignExp.contact==null?'':this.state.CampaignExp.contact.contact.website}</Text>
                                </TouchableOpacity>
                                {this.state.CampaignExp.contact!=null&&<View>
                                  {this.state.CampaignExp.contact.contact.email!=null&&this.state.CampaignExp.contact.contact.email!=undefined&&this.state.CampaignExp.contact.contact.email.length>1&&
                                      <View style={{backgroundColor:'transparent',borderRadius:0.5,height:14,width:20,justifyContent:'center',alignItems:'center'}}>
                                          <TouchableOpacity  onPress={()=>Linking.openURL('mailto:'+this.state.CampaignExp.contact.contact.email)}>
                                          <FontAwesome name={"envelope-o"} size={20} color={'#9a1c1c'}underlayColor={'#fff'} reverseColor={'#fff'} iconStyle={{backgroundColor:'#fff'}} backgroundColor={'#fff'}/></TouchableOpacity>
                                      </View>
                                    }
                                </View>}

                          </View>
                    </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <TouchableOpacity style={{width:width*0.5,backgroundColor:'#CC3D3D',alignItems:'center',}}
                         onPress={()=>this.notInterested()}>
                            <Text style={{fontSize:20,color:'#ffffff',alignSelf:'center',paddingVertical:10}}>Not Interested</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={{width:width*0.5,backgroundColor:'#1a689a',alignItems:'center',}}
                        onPress={()=>this.qualify()}>
                            <Text style={{fontSize:20,color:'#ffffff',alignSelf:'center',paddingVertical:10}}>Qualify</Text>
                      </TouchableOpacity>
                </View>
                <View style={{flex:1,backgroundColor:'#d4e2f0',marginBottom: this.state.keyboardOpen?this.state.keyboardHeight:0}}>
                       <ScrollView style={{paddingBottom:80}}>
                            <TimelineCard navigation={this.props.navigation}/>
                            <View style={{height:80}}></View>
                       </ScrollView>
                       <View style={{justifyContent:'space-between',backgroundColor:'#ffffff',paddingVertical:0,width:width*0.88,}}>
                            <TextInput style={{minHeight:width*0.17,width:width*0.88,paddingLeft:20,backgroundColor:'#ffffff',padding:0,paddingTop:4 ,paddingRight:10,borderTopWidth:0.2,borderRightWidth:0.2}}
                                      multiline={true}
                                      maxHeight={200}
                                      placeholder=""
                                      placeholderTextColor='#7a7575'
                                      onChangeText={(inputtext) => { this.setState({ inputtext:inputtext }); }}
                                      value={this.state.inputtext}/>

                        </View>
                        <View style={{flexDirection:'row',justifyContent:'space-between',backgroundColor:'#ffffff',position: 'absolute',right: width*0,width:width*0.12,bottom:0,height:width*0.17,borderTopWidth:0.2,}}>
                        <TouchableOpacity style={{position: 'absolute',right: width*0.002,width:width*0.112,
                        bottom: 15,backgroundColor:'#ffffff',alignItems:'center',paddingVertical:6,paddingHorizontal:4,borderWidth:0}}
                        onPress={()=>this.Save()}>
                               <FontAwesome name={'save'} size={28} color='#0d87bb'/>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={{position: 'absolute',right: width*0,width:width*0.12,
                        bottom: 10,backgroundColor:'#ffffff',alignItems:'flex-end',padding:15}}>
                               <FontAwesome name={'chevron-right'} size={20} />
                        </TouchableOpacity> */}
                      </View>
               </View>
               <Modal
                       style={styles.modal3}
                       position={'center'}
                       ref={'modal3'}
                       isOpen={this.state.isOpen}
                       onClosed={()=>{
                         this.setState({isOpen:false})
                        }}
                        >
                        <View style={{flexDirection:'row',justifyContent:'space-between',margin:20,paddingTop:100}}>
                            <Text style={{fontSize:18,alignSelf:'flex-start',marginLeft:10,paddingTop:10}}>CallFollowup</Text>
                            <TouchableOpacity style={{alignSelf:'flex-end',marginRight:10,paddingTop:10}}onPress={()=>this.isOpen()}>
                                <Text style={{fontSize:18,}}>X</Text>
                            </TouchableOpacity>
                        </View>
                           <View style={{flexDirection:'column', marginLeft:20,marginRight:20,paddingTop:10}}>
                             <DatePicker
                                   style={{width:width*0.9}}
                                   date={this.state.date}
                                   mode="datetime"
                                   minDate="2016-01-01 "
                                   maxDate="2050-01-01"
                                   confirmBtnText="Confirm"
                                   cancelBtnText="Cancel"
                                   showIcon={true}
                                   customStyles={{
                                       dateIcon: {
                                                position: 'absolute',
                                                right: 0,
                                                top: 4,
                                                marginLeft: 0,
                                              },
                                            dateInput: {
                                                marginRight: 0,
                                                backgroundColor: '#fff',
                                                fontSize:16,
                                                paddingLeft:20,
                                                alignItems:'flex-start',
                                                paddingHorizontal:10,
                                                color:'black',
                                                marginRight:4,
                                          }
                                   }}
                                   onDateChange={(date) => {this.setState({date})}}/>
                                 <Text style={{paddingTop:6,paddingBottom:2,fontSize:16}}>Notes</Text>
                                 <TextInput style={{height:150,paddingLeft:6,padding:4,   borderWidth: 0.2,fontSize:16,backgroundColor:'#ffffff'}}
                                   onChangeText={(notes)=>this.setState({notes:notes})}
                                   maxHeight={300}
                                   multiline={true}
                                   value={this.state.notes}>
                                 </TextInput>
                          </View>
                          <TouchableOpacity style={{backgroundColor:'#113d4e',alignSelf:'flex-end',marginTop:10,marginRight:20}} onPress={()=>this.CallFollowup()} ><Text style={{paddingTop:4,paddingLeft:4,paddingRight:4,color:'#fff',fontSize:16,paddingHorizontal:6,paddingVertical:6}}>Save </Text>
                         </TouchableOpacity>

                 </Modal>

                   {!this.state.keyboardOpen&&
                          <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={()=>this.setState({isOpen:true})}
                                style={{ position: 'absolute',
                                         width: 45,
                                         height: 45,
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         right: 100,
                                         bottom: 100,
                                         backgroundColor: '#1a689a',
                                         zIndex: 1,
                                         borderRadius:25,}}>
                                {/* <FontAwesome name="calendar" size={25} color="#fff"  /> */}
                                <FontAwesome
                                size={25}
                                color='#ffffff'
                                name='calendar'
                                />
                            </TouchableOpacity>
                     }
                   {!this.state.keyboardOpen&&
                          <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={()=>{this.state.CampaignExp.contact!=null&&this.makecall(JSON.stringify(this.state.CampaignExp.contact.contact.mobile)
                                            ,JSON.stringify(this.state.CampaignExp.contact.contact.directNumber)
                                            ,JSON.stringify(this.state.CampaignExp.contact.contact.altNumber)
                                            ,JSON.stringify(this.state.CampaignExp.contact.contact.altNumber2))}}
                                style={{ position: 'absolute',
                                         width: 45,
                                         height: 45,
                                         alignItems: 'center',
                                         justifyContent: 'center',
                                         right: 30,
                                         bottom: 100,
                                         backgroundColor: '#2bb048',
                                         zIndex: 1,
                                         borderRadius:25,}}>
                                {this.state.CampaignExp.contact!=null&&
                                <Menu ref={ref => (this[`menu${JSON.stringify(this.state.CampaignExp.contact.contact.mobile)
                                                       ,JSON.stringify(this.state.CampaignExp.contact.contact.directNumber)
                                                       ,JSON.stringify(this.state.CampaignExp.contact.contact.altNumber)
                                                       ,JSON.stringify(this.state.CampaignExp.contact.contact.altNumber2)}`] = ref)}
                                style={{marginBottom:400}}dropup={true}>

                                    {this.state.CampaignExp.contact.contact.mobile!=null&&
                                    <MenuItem textStyle={{fontSize:24}}onPress={()=>{this.mobile(this.state.CampaignExp.contact.contact.mobile)}}>
                                      {this.state.CampaignExp.contact.contact.mobile}</MenuItem>}

                                    {this.state.CampaignExp.contact.contact.directNumber!=null&&
                                    <MenuItem textStyle={{fontSize:24}} onPress={()=>{this.Dno(this.state.CampaignExp.contact.contact.directNumber)}}>
                                      {this.state.CampaignExp.contact.contact.directNumber}</MenuItem>}

                                    {this.state.CampaignExp.contact.contact.altNumber!=null&&
                                     <MenuItem textStyle={{fontSize:24}} onPress={()=>{this.altNumber(this.state.CampaignExp.contact.contact.altNumber)}}>
                                       {this.state.CampaignExp.contact.contact.altNumber}</MenuItem>}

                                    {this.state.CampaignExp.contact.contact.altNumber2!=null&&
                                      <MenuItem textStyle={{fontSize:24}} onPress={()=>{this.altNumber2(this.state.CampaignExp.contact.contact.altNumber2)}}>
                                        {this.state.CampaignExp.contact.contact.altNumber2}</MenuItem>}

                                </Menu>}
                                <Ionicons name="md-call" size={25} color="#fff"  />
                            </TouchableOpacity> }
          </View>
        );
    }
}
const styles=StyleSheet.create({
    modalView:{
      height:width*0.75,
      width:width*0.75,
      position:'absolute',
      right:width*0.0075,
      left:width*0.0075,
      bottom:width,
      backgroundColor:'transparent',
      alignSelf:'center',
      alignContent:'center',
      justifyContent:'center',
      backgroundColor:'#ffffff'
    }
});
