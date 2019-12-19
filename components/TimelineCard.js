import * as WebBrowser from 'expo-web-browser';
import React,{Component} from 'react';
import {
  Image,Platform,ScrollView,
  StyleSheet,Animated,WebView,
  Text,TextInput,Dimensions,AsyncStorage,
  TouchableOpacity,TouchableWithoutFeedback,
  View,Button,ImageBackground,FlatList,Linking,
} from 'react-native';
import { Card } from 'react-native-elements';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import Constants from 'expo-constants';
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';
import { Ionicons ,FontAwesome } from '@expo/vector-icons';
import Carousel from 'react-native-carousel';
const { width } = Dimensions.get('window');
import TimeAgo from 'react-native-timeago';
import HTMLView from 'react-native-htmlview';
// import HTML from 'react-native-render-html';
export default class TimelineCard extends Component {
      constructor(props){
          super(props);
          this.state={
              isHorizontal:true,
              scrollX: new Animated.Value(0),
              list:[{first_name:'Admin',last_name:'CIOC',created:new Date(),duration:'10 min',notes:'meeting ',typ:'call',data:'gfghjghgfhjf',doc:'www.cioc.in'},
                      {first_name:'Admin',last_name:'CIOC',created:new Date('10/10/2019'),duration:'7 min',notes:'meeting ',typ:'note',data:'gfghjghgfhjf',doc:''},
                      {first_name:'Admin',last_name:'CIOC',created:new Date('12/8/2019'),duration:'',notes:'meeting ',typ:'note',data:'gfghjghgfhjf',doc:require('../assets/images/img_avatar_card.png')},
                      {first_name:'Admin',last_name:'CIOC',created:new Date('12/9/2019'),duration:'10 min',notes:'meeting ',typ:'call',data:'gfghjghgfhjf',doc:''},
                      {first_name:'Admin',last_name:'CIOC',created:new Date(),duration:'10 min',notes:'meeting ',typ:'call',data:'gfghjghgfhjf',doc:'www.cioc.in'},],
              CampaignExp:[],
              CampaignUser:[],

          }
      }

    openDoc = async (item) => {
         // Linking.openURL(item.doc);
         await WebBrowser.openBrowserAsync(item.doc);
         // <WebView
         //   source={{uri:item.doc}}
         //   style={{marginTop: 20}}
         // />
      }

      getuser=async()=>{
          const SERVER_URL=await AsyncStorage.getItem('SERVER_URL');
          const sessionid = await AsyncStorage.getItem('sessionid');
          const userToken = await AsyncStorage.getItem('userpk');
          const csrf = await AsyncStorage.getItem('csrf');
           fetch(SERVER_URL+'/api/HR/users/'+userToken+'/', {
             method: 'GET',
             headers: {
              "Cookie" :"csrf="+csrf+";sessionid=" + sessionid +";",
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'X-CSRFToken':csrf,
              'Referer': SERVER_URL
             }
           }).then((response) =>{
             console.log(response,"CampaignUserpresponse")
             if(response.status == '200'){
              return response.json()
             }
           }).then((json) => {
               this.setState({ CampaignUser: json});
               console.log(this.state.CampaignUser,"this.state.CampaignUser")
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
                console.log(response,"CampaignExLogspresponse")
                if(response.status == '200'){
                 return response.json()
                }
              }).then((json) => {
                  this.setState({ CampaignExp: json});
                  console.log(this.state.CampaignExp,"this.state.CampaignExpLogs")
              })
         }

      componentDidMount=async()=>{
          this.getCampaignEX();
          this.getuser();
      }

      componentWillReceiveProps({navigation}) {
        console.log(navigation,'rrrrrrrrrrrrrrrr');
        var update = navigation.getParam('wentBack',null)
        if(update == true){
          this.getCampaignEX()
        }
        var update1 = navigation.getParam('went',null)
        if(update1 == true){
          this.getCampaignEX()
        }
        var update2 = navigation.getParam('wentcallfollowup',null)
        if(update2 == true){
          this.getCampaignEX()
        }

    }

  render(){

      const regex = /(<([^>]+)>)/ig;
      let regex1 = /<\s*p[^>]*>([^<]*)<\s*\/\s*p\s*>/
      const image='../assets/images/img_avatar_card.png';
      return(
          <View style={{ flex: 1,backgroundColor:'#d4e2f0',marginBottom:50}}>
              <FlatList
                  data={this.state.CampaignExp.logs}
                  extraData={this.state}
                  inverted
                  nestedScrollEnabled={true}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item, index})=>(
                    <TouchableWithoutFeedback >
                        <Card containerStyle={{flexDirection:'column',marginTop:5,marginLeft:0,marginRight:0,padding:0,borderWidth:0.2,backgroundColor:'#fafdff'}}>
                            <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'space-between',}}>
                                <View style={{height:width*0.08,width:width*0.08,justifyContent:'flex-start',alignItems:'flex-start',position:'absolute',left:width*0.025,top:width*0.025,bottom:width*0.015,borderWidth:0}}><Image
                                    source={require('../assets/images/img_avatar_card.png')} style={{width:'100%', height:'100%',borderRadius:50}}/>
                                </View>
                                <View style={{height:width*0.1,width:width*0.8,flexDirection:'row',position:'absolute',left:width*0.14,top:width*0.015,bottom:width*0.015,justifyContent:'space-between',alignItems:'center',borderWidth:0}}>
                                    <View style={{borderWidth:0,alignContent:'flex-start'}}>
                                        <Text style={{fontSize:17}}>{this.state.CampaignUser.first_name} {this.state.CampaignUser.last_name}</Text>
                                    </View>
                                    <View style={{borderWidth:0,alignContent:'center'}}>
                                        <Text style={{fontSize:16,color:'#747474',opacity:0}}>2 sec</Text>
                                    </View>
                                    <View style={{borderWidth:0,alignContent:'flex-end',flexDirection:'row'}}>
                                          {item.typ=="comment"&&<FontAwesome name={"comment-o"} size={20} color={'#0d87bb'} style={{paddingRight:2,paddingTop:0,}}/>}
                                          {item.typ=="outbound"&&<FontAwesome name={"phone"} size={20} color={'#2bb048'} style={{paddingRight:2,paddingTop:2,}}/>}
                                          {item.typ=="followup"&&<FontAwesome name={"calendar"} size={18} color={'#0d87bb'} style={{paddingRight:2,paddingTop:0,}}/>}
                                        <Ionicons name='md-time' size={17} style={{padding:2,paddingRight:4}}/>
                                        <TimeAgo time={item.created} interval={20000}/>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.lineStyle,{marginTop:width*0.1225}]}></View>


                            {/* {item.typ=="outbound"&&
                            <View style={{backgroundColor:'#ffffff',paddingHorizontal:10,paddingLeft:35}}>

                                  <View style={{flexDirection:'row'}}>

                                      <FontAwesome name={"clock-o"} size={18} color={'#000'} style={{paddingLeft:20,paddingTop:8,}}/>
                                      <Text style={{padding:4,paddingTop:6,paddingLeft:6,paddingRight:20, borderWidth:0,       fontSize:16,backgroundColor:'#ffffff',borderBottomWidth:0,justifyContent:'flex-start',
                                      textAlign:'auto',textAlignVertical:'top'}}>{item.data==null?'':item.data}
                                      </Text>
                                  </View>


                                <Text style={{padding:4,paddingTop:4,paddingLeft:30,paddingRight:20, borderWidth:0,  fontSize:16,backgroundColor:'#ffffff',borderBottomWidth:0,justifyContent:'flex-start',
                                    textAlign:'auto',textAlignVertical:'top'}}>{item.data==null?'':item.data.replace(regex,'')}
                                </Text>
                            </View>} */}

                            {item.typ=="comment"&&<View style={{paddingBottom:4}}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingLeft:35}}>
                                <Text style={{paddingTop:6,paddingLeft:20,paddingRight:20, borderWidth:0,  fontSize:16,backgroundColor:'transparent',borderBottomWidth:0,justifyContent:'flex-start',
                                    textAlign:'auto',textAlignVertical:'top'}}>{item.data==null?'':item.data.replace(regex, '')}
                                </Text>
                                {item.doc?
                                <TouchableOpacity style={{paddingTop:6,paddingRight:20}} onPress={()=>this.openDoc(item)}>
                                    <FontAwesome name={'paperclip'} size={17}/>
                                </TouchableOpacity>:<View></View>}
                            </View>
                            </View>
                          }
                          {item.typ=="followup"&&<View  style={{paddingBottom:4}}><View style={{flexDirection:'row',paddingHorizontal:10,paddingLeft:35}}>
                          <Text style={{paddingTop:6,paddingLeft:20,paddingRight:20, borderWidth:0,  fontSize:16,backgroundColor:'transparent',borderBottomWidth:0,justifyContent:'flex-start',
                              textAlign:'auto',textAlignVertical:'top'}}>{item.followupDate==null?'':item.followupDate.split('T')[0]}
                          </Text></View>
                          <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:10,paddingLeft:35}}>
                              <Text style={{paddingTop:6,paddingLeft:20,paddingRight:20, borderWidth:0,  fontSize:16,backgroundColor:'transparent',borderBottomWidth:0,justifyContent:'flex-start',
                                  textAlign:'auto',textAlignVertical:'top'}}>{item.data==null?'':item.data.replace(regex, '')}
                              </Text>

                              {item.doc?
                              <TouchableOpacity style={{paddingTop:6,paddingRight:20}} onPress={()=>this.openDoc(item)}>
                                  <FontAwesome name={'paperclip'} size={17}/>
                              </TouchableOpacity>:<View></View>}
                          </View>
                          </View>
                        }

                      </Card>
                </TouchableWithoutFeedback>
              )}
            />
        </View>
      );
  }
}

const styles = StyleSheet.create({

   lineStyle:{
       borderWidth: 0.15,
       borderColor:'#bebdbd',
       shadowOpacity:0.2,shadowRadius: 0,elevation: 0.2,
  },
  lineStyle1:{
       borderWidth: 0.15,
       borderColor:'#bebdbd',

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
   viewDiv :{
       paddingHorizontal:5
   }
});

// <View style={[styles.lineStyle1]}></View>
// <ScrollView  style={{shadowOpacity:0,shadowRadius: 0,elevation: 0,marginBottom:2,backgroundColor:'#fafdff'}}>
//     <NestedCard props={this.state.list} render={item.contacts}  navigation={this.props.navigation}></NestedCard>
// </ScrollView>
