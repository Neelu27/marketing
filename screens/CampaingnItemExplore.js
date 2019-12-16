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
import CampaingnItemTimeLine from '../components/CampaingnItemTimeLine';


export default class CampaingnItemExplore extends Component {

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
                CampaignItemExp:[],
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


        hideMenu = (mobile) => {
              this[`menu${mobile}`].hide();
        };

        showMenu = (mobile,directNumber,altNumber,altNumber2) => {
              this[`menu${mobile,directNumber,altNumber,altNumber2}`].show();
        };

       openLink=async(item)=>{
             await WebBrowser.openBrowserAsync(item);
       }



            makecall=async(mobile,directNumber,altNumber,altNumber2,campaign)=>{
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
                       this.showMenu(mobile,directNumber,altNumber,altNumber2);
                     }
                  }else{
                    return
                  }
            }

            mobile=async(mobile,campaign)=>{
                var attempt=1;
                var attemptdata=attempt+campaign.attempt;
                var dataSend ={
                  attempt	:attemptdata,
                  attempted	:true,
                }
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

                                    Linking.openURL('tel://'+mobile)
                                    this.hideMenu(mobile);

                                  })
                                  .catch((error) => {
                                    Alert.alert(error.message);
                                  });
                    })
                    .catch((error) => {
                      Alert.alert(error.message);
                    });
            }

            Dno=async(number,campaign)=>{
                var attempt=1;
                var attemptdata=attempt+campaign.attempt;
                var dataSend ={
                  attempt	:attemptdata,
                  attempted	:true,
                }
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

                                    Linking.openURL('tel://'+number)
                                      this.hideMenu(number);

                                  })
                                  .catch((error) => {
                                    Alert.alert(error.message);
                                  });
                    })
                    .catch((error) => {
                      Alert.alert(error.message);
                    });
            }

            altNumber=async(number,campaign)=>{
                var attempt=1;
                var attemptdata=attempt+campaign.attempt;
                var dataSend ={
                  attempt	:attemptdata,
                  attempted	:true,
                }
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

                                    Linking.openURL('tel://'+number)
                                    this.hideMenu(number);

                                  })
                                  .catch((error) => {
                                    Alert.alert(error.message);
                                  });
                    })
                    .catch((error) => {
                      Alert.alert(error.message);
                    });
            }


            altNumber2=async(number,campaign)=>{
                var attempt=1;
                var attemptdata=attempt+campaign.attempt;
                var dataSend ={
                  attempt	:attemptdata,
                  attempted	:true,
                }
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

                                    Linking.openURL('tel://'+number)
                                    this.hideMenu(number);

                                  })
                                  .catch((error) => {
                                    Alert.alert(error.message);
                                  });
                    })
                    .catch((error) => {
                      Alert.alert(error.message);
                    });
            }


            Save=async(campaign)=>{
                  var dataSend ={
                  campaign:campaign.campaign,
                  data:this.state.inputtext,
                  contact:campaign.contact.pk,
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

                          this.props.navigation.navigate('CampaingnItemExplore',{
                            wentBack: true,
                          })

                      return response.json();
                    }).then((json) => {

                      this.setState({SaveFollowNote:[json]});
                      console.log(json,'savedjson SaveFollow ');
                      this.setState({inputtext:''});


                  })
                    .catch((error) => {
                      Alert.alert(error.message);
                  });
            }





      render() {
        const campaignitem = this.props.navigation.getParam('campaignitem',null);
        console.log(campaignitem,'campaignitem');
        console.log(JSON.stringify(campaignitem));
        console.log(campaignitem.item.name,'campaignitem.item.contact.name');
        const campaign = this.props.navigation.getParam('campaign',null);
        console.log(campaign,'campaigncampaign');
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
                                    <Text>about</Text>
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
                              <Text style={{fontSize:26,color:'#000000'}}>{campaignitem.item.name}</Text>
                          </View>
                    </View>
                </View>
                <View style={{paddingHorizontal:15,backgroundColor:'#ffffff'}} >
                    <View style={{flexDirection:'column',}}><TouchableOpacity onPress={()=>this.model()} activeOpacity={1}>
                          <View style={{flexDirection:'row',paddingTop:0,paddingLeft:6}}>
                                <Text style={{fontSize:16,color:'#000000',paddingLeft:0}}>{campaignitem.item.companyName}</Text>
                          </View>
                          <View style={{flexDirection:'row',paddingTop:3,paddingBottom:2}}>
                                <Text style={{fontSize:16,color:'#000',paddingTop:8,paddingBottom:4,paddingRight:6}}>{campaignitem.item.city}</Text>
                                <Text style={{fontSize:16,color:'#000',paddingTop:8,paddingBottom:4,paddingHorizontal:0}}>{campaignitem.item.country}</Text>
                          </View></TouchableOpacity>
                          <View style={{flexDirection:'row',paddingVertical:5,paddingLeft:2,justifyContent:'space-between'}}>
                                <TouchableOpacity onPress={()=>this.openLink(campaignitem.item.website)}>
                                    <Text style={{fontSize:16,color:'#000000',paddingLeft:2}}>{campaignitem.item.website}</Text>
                                </TouchableOpacity>
                                <View>

                                      <View style={{backgroundColor:'transparent',borderRadius:0.5,height:14,width:20,justifyContent:'center',alignItems:'center'}}>
                                          <TouchableOpacity  onPress={()=>Linking.openURL('mailto:'+campaignitem.item.email)}>
                                          <FontAwesome name={"envelope-o"} size={20} color={'#9a1c1c'}underlayColor={'#fff'} reverseColor={'#fff'} iconStyle={{backgroundColor:'#fff'}} backgroundColor={'#fff'}/></TouchableOpacity>
                                      </View>

                                </View>

                          </View>
                    </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',borderWidth:1,borderColor:'#1a689a'}}>

                </View>
                <View style={{flex:1,backgroundColor:'#d4e2f0',marginBottom: this.state.keyboardOpen?this.state.keyboardHeight:0}}>
                       <ScrollView style={{paddingBottom:80}}>
                                <CampaingnItemTimeLine navigation={this.props.navigation}/>
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
                        onPress={()=>this.Save(campaign.item)}>
                               <FontAwesome name={'save'} size={28} color='#0d87bb'/>
                        </TouchableOpacity>

                      </View>
               </View>


               {!this.state.keyboardOpen&&
                      <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={()=>{this.makecall(JSON.stringify(campaignitem.item.mobile)
                                        ,JSON.stringify(campaignitem.item.directNumber)
                                        ,JSON.stringify(campaignitem.item.altNumber)
                                        ,JSON.stringify(campaignitem.item.altNumber2)
                                      ,JSON.stringify(campaign.item))}}
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
                            {campaignitem.item!=null&&
                            <Menu ref={ref => (this[`menu${JSON.stringify(campaignitem.item.mobile)
                                                   ,JSON.stringify(campaignitem.item.directNumber)
                                                   ,JSON.stringify(campaignitem.item.altNumber)
                                                   ,JSON.stringify(campaignitem.item.altNumber2)}`] = ref)}
                            style={{marginBottom:400}}dropup={true}>

                                {campaignitem.item.mobile!=null&&
                                <MenuItem textStyle={{fontSize:24}}onPress={()=>{this.mobile(campaignitem.item.mobile,campaign.item)}}>
                                  {campaignitem.item.mobile}</MenuItem>}

                                {campaignitem.item.directNumber!=null&&
                                <MenuItem textStyle={{fontSize:24}} onPress={()=>{this.Dno(campaignitem.item.directNumber,campaign.item)}}>
                                  {campaignitem.item.directNumber}</MenuItem>}

                                {campaignitem.item.altNumber!=null&&
                                 <MenuItem textStyle={{fontSize:24}} onPress={()=>{this.altNumber(campaignitem.item.altNumber,campaign.item)}}>
                                   {campaignitem.item.altNumber}</MenuItem>}

                                {campaignitem.item.altNumber2!=null&&
                                  <MenuItem textStyle={{fontSize:24}} onPress={()=>{this.altNumber2(campaignitem.item.altNumber2,campaign.item)}}>
                                    {campaignitem.item.altNumber2}</MenuItem>}

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


// {!this.state.keyboardOpen&&
//        <TouchableOpacity
//              activeOpacity={0.7}
//              onPress={()=>this.setState({isOpen:true})}
//              style={{ position: 'absolute',
//                       width: 45,
//                       height: 45,
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       right: 100,
//                       bottom: 100,
//                       backgroundColor: '#1a689a',
//                       zIndex: 1,
//                       borderRadius:25,}}>
//              {/* <FontAwesome name="calendar" size={25} color="#fff"  /> */}
//              <FontAwesome
//              size={25}
//              color='#ffffff'
//              name='calendar'
//              />
//          </TouchableOpacity>
//   }

{/* <Modal
style={styles.modal3}
position={'right'}
ref={'modal3'}
isOpen={this.state.isOpen2}
onClosed={()=>{
this.setState({isOpen2:false})
}}
>
<View style={{flexDirection:'row',justifyContent:'space-between',margin:20,paddingTop:10,}}>
   <Text style={{fontSize:18,alignSelf:'flex-start',marginLeft:10,paddingTop:10}}>Contacts No  </Text>
   <TouchableOpacity style={{alignSelf:'flex-end',marginRight:10,paddingTop:10}}onPress={()=>this.setState({isOpen2:false})}>
       <Text style={{fontSize:18,}}>X</Text>
   </TouchableOpacity>
</View>
  <View style={{flexDirection:'column', marginLeft:20,marginRight:20,paddingTop:10}}>
    {this.state.CampaignExp.contact!=null&&<View style={{flexDirection:'column',}}>
      {this.state.CampaignExp.contact.contact.mobile!=null&&
        <View style={{flexDirection:'row'}}>
             <TouchableOpacity onPress={()=>this.mobile(this.state.CampaignExp.contact.contact.mobile)}>
             <Text style={{paddingTop:6,paddingBottom:2,fontSize:26,paddingHorizontal:10,width:width*0.5,alignSelf:'flex-start'}}>{this.state.CampaignExp.contact.contact.mobile}</Text></TouchableOpacity>
        </View>}
           {this.state.CampaignExp.contact.contact.directNumber!=null&&
          <View style={{flexDirection:'row'}}>
                 <TouchableOpacity onPress={()=>this.Dno(this.state.CampaignExp.contact.contact.directNumber)}>
               <Text style={{paddingTop:6,paddingBottom:2,fontSize:26,paddingHorizontal:10,width:width*0.5,alignSelf:'flex-start'}}>{this.state.CampaignExp.contact.contact.directNumber}</Text></TouchableOpacity>
          </View>}
            {this.state.CampaignExp.contact.contact.altNumber!=null&&
          <View style={{flexDirection:'row'}}>

               <TouchableOpacity onPress={()=>this.altNumber(this.state.CampaignExp.contact.contact.altNumber)}>
               <Text style={{paddingTop:6,paddingBottom:2,fontSize:26,paddingHorizontal:10,width:width*0.5,alignSelf:'flex-start'}}>{this.state.CampaignExp.contact.contact.altNumber}</Text></TouchableOpacity>
         </View>}
          {this.state.CampaignExp.contact.contact.altNumber2!=null&&
         <View style={{flexDirection:'row'}}>

                 <TouchableOpacity onPress={()=>this.altNumber2(this.state.CampaignExp.contact.contact.altNumber2)}>
               <Text style={{paddingTop:6,paddingBottom:2,fontSize:26,paddingHorizontal:10,width:width*0.5,alignSelf:'flex-start'}}>{this.state.CampaignExp.contact.contact.altNumber2}</Text></TouchableOpacity>
         </View>}</View>}

  </View>
</Modal> */}
