import * as WebBrowser from 'expo-web-browser';
import React,{Component} from 'react';
import wamp from 'wamp.js2';
import {Linking} from 'react-native'
import {
  Image,Platform,ScrollView,
  StyleSheet,AsyncStorage,ActivityIndicator,
  Text,TextInput,Dimensions,Alert,
  TouchableOpacity,TouchableWithoutFeedback,
  View,Button,ImageBackground,FlatList
} from 'react-native';
import { Card ,SearchBar , Icon,Badge} from 'react-native-elements';
import Draggable from 'react-native-draggable';
import Constants from 'expo-constants';
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';

import { Ionicons ,FontAwesome,MaterialCommunityIcons,Foundation } from '@expo/vector-icons';
const { width } = Dimensions.get('window');
export default class HomeScreen extends Component {
      constructor(props){
            super(props);
            this.state={
                data:[],
                first_name:'',
                userdetails:[],
                SERVER_URL:'',
                fetching_Status: false,
                limit:12,
                offset:0,
                text:'',
                list:[],
                listBackup:[],
                search: '',
                isLoading: true,
                page: 0,
                seed: 1,
                refreshing: false,
                connection : new wamp.Connection({url: 'wss://ws.syrow.com:8080/ws', realm: 'default'}),

            }
            console.log(this.state.SERVER_URL,'SERVER_URL');
      }

      getUserAsync = async () => {
            const SERVER_URL = await AsyncStorage.getItem('SERVER_URL');
            console.log(SERVER_URL,'llllllllllll');
            const userToken = await AsyncStorage.getItem('userpk');
            const sessionid = await AsyncStorage.getItem('sessionid');
            this.setState({SERVER_URL:SERVER_URL,sessionid:sessionid});
            if(userToken == null){
              return
            }
            fetch(SERVER_URL + '/api/HR/users/'+ userToken + '/', {
              headers: {
                 "Cookie" :"sessionid=" + sessionid +";",
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
                 'Referer': SERVER_URL,
              }
            }).then((response) => response.json())
              .then((responseJson) => {
                // console.log(responseJson,'ppppppppppp');
                this.setState({ userdetails: responseJson})
                this.setState({ first_name: responseJson.first_name})
                this.setState({ email: responseJson.email})
                this.setState({ lname: responseJson.last_name})
                // console.log(this.state.first_name,'lllllllllllllllllllllllllllll');

                this.state.connection.open();

              })
              .catch((error) => {
                console.error(error);
              });
        }

        logout=()=>{
              new Promise((resolve, reject) => {
                Alert.alert('Confirm', 'Are you sure want to Logout?',
                  [{text: "Yes", onPress: () => {
                        try {
                           AsyncStorage.removeItem('userpk')
                           AsyncStorage.removeItem('sessionid')
                           AsyncStorage.removeItem('csrf')
                           AsyncStorage.removeItem('cart')
                           AsyncStorage.removeItem('SERVER_URL')
                           AsyncStorage.setItem("login", JSON.stringify(false))

                           this.props.navigation.navigate('Login')
                           console.log('success......')
                         }catch (error) {
                           return console.log('logout failed...')
                         }
                       }},
                       {
                         text: 'No',
                         onPress: () => {return},
                         style: 'cancel',
                       },
                     ],{ cancelable: false })
                   })
               }




        searchContact = (query)=>{
            this.setState({text:query,});
        }



        componentDidMount=async()=> {
            this.getUserAsync();
            this.getCampaignData();
            this.state.connection.onopen = (session)=>{
               this.setState({session : session});
                // 1) subscribe to a topic
                console.log('subscribing to' ,"erp.marketing.chat");
               session.subscribe('erp.marketing.' + this.state.userdetails.username, this.callBackHandler).then(
               (sub) => {
                 console.log("subscription done ")
               },
               (err) => {
                 console.log("failed to subscribe: service.support.chat"+err);
               });
           };
           this.state.connection.onclose = (reason, details)=> {
               console.log("Connection lost: " + reason);
            }
        }

        callBackHandler = (args)=>{
            if(args[0].type == "call"){
                console.log("make a call")
                Linking.openURL('tel:${'+ args[0].data +'}')
            }
        }

        getCampaignData=async()=>{
            const SERVER_URL = await AsyncStorage.getItem('SERVER_URL');
            const sessionid = await AsyncStorage.getItem('sessionid');
            const csrf = await AsyncStorage.getItem('csrf');
            this.setState({SERVER_URL:SERVER_URL,sessionid:sessionid,csrf:csrf});
            console.log(SERVER_URL,'rrrrrrrrrr');
            try {
              await fetch(SERVER_URL+'/api/marketing/campaign/?&search=',{
                method:'GET',
                headers: {
                   "Cookie" :"csrf="+csrf+";"+"sessionid=" + sessionid +";",
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'Referer': SERVER_URL,
                }})
                .then((response) => {
                // console.log(response.status,response,'CampainignData');

                if(response.status == '200' || response.status == '200'){
                  return response.json()
                }else{
                  return undefined
                }
              })
              .then((responseJson) => {
              // console.log(responseJson,'CampainignData Responce');
              if(responseJson == undefined){
                this.setState({ list:[], isLoading: false ,offset:this.state.offset+10})
                this.setState({listBackup: []})
                return
              }
              var arr =  this.state.list
              for (var i = 0; i < responseJson.length; i++) {
                arr.push(responseJson[i])
              }
              this.setState({ list:arr, isLoading: false ,offset:this.state.offset+10})
              this.setState({listBackup: arr})
              })
              .catch((error) => {
                console.error(error);
              });
            } catch (error) {
                return
              }
        }


        contactRefresh = ()=>{
            this.setState({offset:0,limit:10})
            fetch(this.state.SERVER_URL+'/api/marketing/campaign/?&search='+this.state.offset+'&limit='+this.state.limit,{
              headers: {
                 "Cookie" :"sessionid=" + this.state.sessionid +";",
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
                 'Referer': this.state.SERVER_URL,
              }})
              .then((response) => {
              console.log(response.status,response,'rerenderrrrrrr');

              if(response.status == '200' || response.status == 200){
                return response.json()
              }else{
                return undefined
              }
             })
             .then((responseJson) => {
              if(responseJson == undefined){
               return
             }
            var arr =  this.state.list
            for (var i = 0; i < responseJson.length; i++) {
              arr.push(responseJson[i])
             }
            this.setState({ list:responseJson, isLoading: false ,offset:this.state.offset+10})
            this.setState({listBackup: responseJson})
            }).catch((error) => {
                console.error(error);
              });
      }

      searchContact = (query)=>{
            this.setState({text:query,});
            if(query.length == 0){
              this.setState({list: this.state.listBackup})
              return
            }
            console.log(query,'queryyy');
            fetch(this.state.SERVER_URL+'/api/marketing/campaign/?&name='+query,{
              headers: {
                 "Cookie" :"sessionid=" + this.state.sessionid +";",
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
                 'Referer': this.state.SERVER_URL,
              }
              }).then((response) => {
                if(response.status == '200' || response.status == 200){
                  return response.json()
                }else{
                  return undefined
                }
              })
              .then((responseJson) => {
                if(responseJson == undefined){
                  this.setState({list: []})
                  return
                }
                this.setState({list: responseJson})
              })
              .catch((error) => {
                this.setState({list: []})
                return
              });
          }


        filterList = text => {
             var newData = this.state.listBackup;
             newData = this.state.listBackup.filter(item => {
               const itemData = item.name.toLowerCase();
               const textData = text.toLowerCase();
               return itemData.indexOf(textData) > -1;
             });
             this.setState({
               query: text,
               list: newData,
               text:text,
             });
       };


         Render_Footer=()=>{
             return (
              <View style={{flex:1,justifyContent:'center'}} >
                  <TouchableOpacity
                      activeOpacity = { 0.7 }
                      style={{paddingVertical:8,paddingHorizontal:8,alignSelf:'center'}}
                      onPress = { this.getCampaignData }
                      >
                      <Text style={{color:'#125891',textStyle:'underline'}}>Load More </Text>
                        {( this.state.fetching_Status)?<ActivityIndicator color = "#3bb3c8" style = {{ marginLeft: 6 }} />
                            :null}
                  </TouchableOpacity>
              </View>
            )
        }


      next=async(item)=>{
          AsyncStorage.setItem('campaignpk',JSON.stringify(item.pk))
          console.log(item.pk,"item.pk")
          this.props.navigation.navigate('ExploreCampaign')
      }

      CampaingnItem=async(item)=>{
          AsyncStorage.setItem('campaignpk',JSON.stringify(item.pk))
          console.log(item.pk,"item.pk")
          this.props.navigation.navigate('CampaingnItem')
      }

  render(){

    return(
      <View style={{ flex: 1}}>
        <View style={{height:Constants.statusBarHeight,backgroundColor:'#b31423'}}></View>
        <View style={{  flexDirection: 'row',backgroundColor:'#b31423',borderWidth:0, height:50,justifyContent: 'space-between',alignItems:'flex-start',fontSize:20,paddingLeft:4,paddingTop:10,paddingBottom:6}}>
              <Text style={{fontSize:20,marginLeft:width*0.04,color:'#fff'}}>{this.state.first_name}</Text>
              <View style={{justifyContent:'center',alignSelf:'center'}}></View>
              <SearchBar
                    containerStyle={{padding:0,width:width*0.5,marginBottom:4,marginTop:0,color:'#ffffff',fontSize:14,borderWidth:0,backgroundColor:'transparent',height:30,borderTopWidth:0}}
                    inputContainerStyle={{padding:0,height:30,width:width*0.5,color:'#ffffff',fontSize:14,marginTop:0,marginBottom:2,backgroundColor:'#b31423'}}
                    inputStyle={{color:'#fff'}}
                    placeholder="Search here"
                    placeholderTextColor={'#ffffff'}
                    onChangeText={text => {this.searchContact(text);}}

                    value={this.state.text}
                    onEndThreshold={0}
                    textColor={'#ffffff'}
                    searchIcon={
                      <FontAwesome
                        reverse
                        name='search'
                        color='#fff'
                        size ={16}
                      />
                    }
                    clearIcon={<FontAwesome
                      reverse
                      name='close'
                      color='#fff'
                      onPress={() => {this.searchContact("");}}
                    />}
              />
              <TouchableOpacity style={{ marginHorizontal: 8 ,paddingTop:2,marginRight:width*0.04}} onPress={()=>this.logout()}>
                  <Text><Ionicons name="md-power" size={22} color="#fff" /></Text>
              </TouchableOpacity>
          </View>
          <FlatList
              data={this.state.list}
              extraData={this.state}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index})=>(
               <TouchableWithoutFeedback onPress={()=>this.next(item)}>
                    <Card containerStyle={{flex:1,flexDirection:'column',borderWidth:0.2,backgroundColor:'#fafdff',padding:0,paddingBottom:0}}>
                          <View style={{padding:8,paddingHorizontal:15}}>
                              <Text style={{fontSize:22,color:'#000000',paddingLeft:8}}>{item.name}</Text>


                              <View style={{flexDirection:'row',paddingVertical:4,justifyContent:'space-between'}}>
                                  <View style={{flexDirection:'row',paddingVertical:4}}>
                                    {/* <View style={{flexDirection:'row',borderWidth:0.5,borderRadius: 50,height:width*0.115,width:width*0.115,
                                    justifyContent: 'center',
                                    alignItems: 'center'}}>
                                          <Text style={{fontSize:18,color:'#000000',padding:0}}>{item.itemCount}</Text>

                                    </View>
                                    <FontAwesome name={'arrow-right'} size={14} style={{paddingHorizontal:10,paddingTop:width*0.045}}/>
                                    <View style={{flexDirection:'row',borderWidth:0.5,borderRadius:50,height:width*0.115,width:width*0.115,
                                    justifyContent: 'center',
                                    alignItems: 'center'}}>
                                          <Text style={{fontSize:18,color:'#000000',}}>{item.inProcess}</Text>
                                    </View>
                                    <FontAwesome name={'arrow-right'} size={14} style={{paddingHorizontal:10,paddingTop:width*0.045}}/>
                                    <View style={{flexDirection:'row',borderWidth:0.5,borderRadius:50,height:width*0.115,width:width*0.115,
                                    justifyContent: 'center',
                                    alignItems: 'center'}}>
                                          <Text style={{fontSize:18,color:'#000000'}}>{item.intersted}</Text>
                                    </View> */}

                                          <View style={{paddingHorizontal:10}}>
                                                <View style={{padding:4,borderWidth:0.2,borderRadius:40,backgroundColor:'transparent'}}>
                                                    <Ionicons name={'md-people'} size={24} color={'#000'}/>
                                                </View>
                                                <Badge
                                                     containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                                                     value={item.itemCount}
                                                     badgeStyle={{backgroundColor:'#ececec'}}
                                                     textStyle={{color:'#ff0000',fontSize:16}}
                                                     />
                                         </View>
                                         <FontAwesome name={'arrow-right'} size={14} style={{paddingHorizontal:5,paddingTop:8}}/>
                                         <View style={{paddingHorizontal:10}}>
                                              <View style={{padding:4,borderWidth:0.2,borderRadius:40,backgroundColor:'transparent'}}>
                                                  <Ionicons name={'md-people'} size={24} color={'#000'} />
                                              </View>
                                              <Badge
                                                    containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                                                    value={item.inProcess}
                                                    badgeStyle={{backgroundColor:'#ececec'}}
                                                    textStyle={{color:'#ff9900',fontSize:16}}/>
                                        </View>
                                        <FontAwesome name={'arrow-right'} size={14} style={{paddingHorizontal:5,paddingTop:8}}/>
                                        <View style={{paddingHorizontal:10}}>
                                             <View style={{padding:4,borderWidth:0.2,borderRadius:40,backgroundColor:'transparent'}}>
                                                  <Ionicons name={'md-people'} size={24}color={'#000'} /></View>
                                            <Badge
                                                  containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                                                  value={item.intersted}
                                                  badgeStyle={{backgroundColor:'#ececec',}}
                                                  textStyle={{color:'#188a31',fontSize:16}}/>
                                        </View>
                                  </View>
                                  <TouchableOpacity style={{backgroundColor:'transparent'}} onPress={()=>this.CampaingnItem(item)}>
                                        <FontAwesome name={'users'} size={22} color='#000000' style={{paddingHorizontal:10,paddingTop:width*0.045}}/>
                                  </TouchableOpacity>
                              </View>
                          </View>
                    </Card>
              </TouchableWithoutFeedback>
              )}
            />

            {!this.state.keyboardOpen&&
                   <TouchableOpacity
                         activeOpacity={0.7}
                         onPress={()=>this.props.navigation.navigate('NewCampaign')}
                         style={{ position: 'absolute',
                                  width: 45,
                                  height: 45,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  right: 40,
                                  bottom: 70,
                                  backgroundColor: '#1a689a',
                                  zIndex: 1,
                                  borderRadius:25,}}>
                         {/* <FontAwesome name="calendar" size={25} color="#fff"  /> */}
                         <FontAwesome
                         size={25}
                         color='#ffffff'
                         name='plus'
                         />
                     </TouchableOpacity>
              }
        </View>
    );
  }
}
const styles = StyleSheet.create({

   lineStyle:{
    borderWidth: 0.3,
    borderColor:'#b0b0b0',
    paddingLeft:120,
  },
TouchableOpacityStyle: {
   position: 'absolute',
   width: 45,
   height: 45,
   alignItems: 'center',
   justifyContent: 'center',
   right: 30,
   bottom: 30,
   backgroundColor: '#2b79b0',
   zIndex: 1,
   borderRadius:25,
 },
});

  // <Foundation name={'graph-bar'} size={22} color='#000000' style={{paddingHorizontal:10,paddingTop:width*0.045}}/>
