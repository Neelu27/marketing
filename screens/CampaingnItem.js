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
import { Switch } from 'react-native-switch';
import { Ionicons ,FontAwesome,MaterialCommunityIcons,Foundation } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
export default class CampaingnItem extends Component {
      constructor(props){
            super(props);
            this.state={
                SwitchOnValueHolder:true,
                data:[],
                first_name:'',
                userdetails:[],
                SERVER_URL:'',
                fetching_Status: false,
                limit:15,
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
                statuspersuing:"persuing",
                status:'',
                value:false,
                Status:[],

            }
            console.log(this.state.SERVER_URL,'SERVER_URL');
      }
      static navigationOptions =  ({ navigation }) => {
             const { params = {} } = navigation.state
                return {header:null,}
                    }

        getCampaignItem=async()=>{
          if(this.state.SwitchOnValueHolder == true){
            var status = 'persuing'
            console.log(status,'statusstatuspersuing');
            this.setState({status:status});
            console.log(this.state.status,'statusstatus');
            const campaignpk= await AsyncStorage.getItem('campaignpk');
            const SERVER_URL = await AsyncStorage.getItem('SERVER_URL');
            const sessionid = await AsyncStorage.getItem('sessionid');
            const csrf = await AsyncStorage.getItem('csrf');
            this.setState({SERVER_URL:SERVER_URL,sessionid:sessionid,csrf:csrf});
            console.log(SERVER_URL,'rrrrrrrrrr');
            try {
              await fetch(SERVER_URL+'/api/marketing/campaignItem/?limit='+this.state.limit+'&offset='+this.state.offset+'&campaign='+campaignpk+'&status='+status,{
                method:'GET',
                headers: {
                   "Cookie" :"csrf="+csrf+";"+"sessionid=" + sessionid +";",
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'Referer': SERVER_URL,
                }})
                .then((response) => {
                console.log(response.status,response,'CampainignData');

                if(response.status == '200' || response.status == '200'){
                  return response.json()
                }else{
                  return undefined
                }
              })
              .then((responseJson) => {
              console.log(responseJson,'CampainignData Responce');
              if(responseJson == undefined){
                this.setState({ list:[]})
                this.setState({listBackup: []})
                return
              }
              // var arr =  this.state.list
              // for (var i = 0; i < responseJson.results.length; i++) {
              //   arr.push(responseJson.results[i])
              // }
              this.setState({ list:responseJson.results})
              this.setState({listBackup: responseJson.results})
              })
              .catch((error) => {
                console.error(error);
              });
            } catch (error) {
                return
              }
          }else {   var status = 'interested'
           this.setState({status:'interested'});
            const campaignpk= await AsyncStorage.getItem('campaignpk');
            const SERVER_URL = await AsyncStorage.getItem('SERVER_URL');
            const sessionid = await AsyncStorage.getItem('sessionid');
            const csrf = await AsyncStorage.getItem('csrf');
            this.setState({SERVER_URL:SERVER_URL,sessionid:sessionid,csrf:csrf});
            console.log(SERVER_URL,'rrrrrrrrrr');
            try {
              await fetch(SERVER_URL+'/api/marketing/campaignItem/?limit='+this.state.limit+'&offset='+this.state.offset+'&campaign='+campaignpk+'&status='+status,{
                method:'GET',
                headers: {
                   "Cookie" :"csrf="+csrf+";"+"sessionid=" + sessionid +";",
                   'Accept': 'application/json',
                   'Content-Type': 'application/json',
                   'Referer': SERVER_URL,
                }})
                .then((response) => {
                console.log(response.status,response,'CampainignData');

                if(response.status == '200' || response.status == '200'){
                  return response.json()
                }else{
                  return undefined
                }
              })
              .then((responseJson) => {
              console.log(responseJson,'CampainignData Responce');
              if(responseJson == undefined){
                this.setState({ list:[]})
                this.setState({listBackup: []})
                return
              }
              var Status =[];
              for (var i = 0; i < responseJson.results.length; i++) {
                Status.push({status:responseJson.results[i].status});
              }
              this.setState({Status:Status});
              this.setState({ list:responseJson.results})
              this.setState({listBackup: responseJson.results})
              console.log(this.state.Status,"Status")
              })
              .catch((error) => {
                console.error(error);
              });
            } catch (error) {
                return
              }
          }

        }

        nextCampaignItem=async(value)=>{
          console.log(this.state.value,"this.state.valuenext")
            console.log(this.state.list,"this.state.statusnext")
          if(this.state.SwitchOnValueHolder ==true){
            if(this.state.offset==0&&this.state.status=='persuing'){
              this.setState({offset:this.state.offset+15})
              console.log(this.state.offset,'this.state.offsetnextCampaignItem');
              this.getCampaignItem();
            }
              this.setState({offset:this.state.offset+15})
              console.log(this.state.offset,'this.state.offsetnextCampaignItem+15');
              this.getCampaignItem();
          }else if(this.state.SwitchOnValueHolder ==false){
            if(this.state.offset==0&&this.state.status=='interested'){
              this.setState({offset:this.state.offset+15})
              console.log(this.state.offset,'this.state.offsetnextCampaignItem');
              this.getCampaignItem();
            }
              this.setState({offset:this.state.offset+15})
              console.log(this.state.offset,'this.state.offsetnextCampaignItem+15');
              this.getCampaignItem();
          }

        }

        PrevCampaignItem=async(value)=>{
            console.log(this.state.value,"this.state.value")
            console.log(this.state.status,"this.state.status")
          if(this.state.SwitchOnValueHolder == true){
            this.setState({offset:this.state.offset-15})
            console.log(this.state.offset,'this.state.offsetPrevCampaignItem-15');
            if(this.state.offset==0){
              return
            }else{
              console.log(this.state.offset,'this.state.offsetPrevCampaignItem');
              this.getCampaignItem();
            }
          }else if(this.state.SwitchOnValueHolder ==false){
            this.setState({offset:this.state.offset-15})
            console.log(this.state.offset,'this.state.offsetPrevCampaignItem-15');
            if(this.state.offset==0){
              return
            }else{
              console.log(this.state.offset,'this.state.offsetPrevCampaignItem');
              this.getCampaignItem();
            }
          }

        }

      next=async(item)=>{
          AsyncStorage.setItem('campaignitempk',JSON.stringify(item.pk));
          console.log(item.pk,"item.pk");
          this.props.navigation.navigate('CampaingnItemExplore',{campaignitem:{item:item.contact}});
          this.props.navigation.navigate('CampaingnItemExplore',{campaign:{item:item}});
      }

      componentDidMount=async()=>{
          this.getCampaignItem();
      }
      ShowAlert = (value) =>{
        if(value == true){
          this.state.SwitchOnValueHolder=value;
          this.getCampaignItem()
        }else{
          this.state.SwitchOnValueHolder=value;
          this.getCampaignItem()
        }

            //   if(this.state.SwitchOnValueHolder == true){
            //     console.log(this.state.SwitchOnValueHolder,'SwitchOnValueHoldertrue')
            //     this.setState({status:'persuing'})
            //     this.getCampaignItem()
            //   }
            //
            //
            //   else if(this.state.SwitchOnValueHolder == false){
            //   console.log(this.state.SwitchOnValueHolder,'SwitchOnValueHolderfalse')
            //   this.setState({status:'interested'})
            //   this.getCampaignItem()
            // }


      };

  render(){

    return(
      <View style={{ flex: 1}}>
          <View style={{height:Constants.statusBarHeight,backgroundColor:'#b31423'}}></View>
          <ScrollView style={{marginBottom:48}}>
          <FlatList
              data={this.state.list}
              extraData={this.state}
              style={{paddingBottom:100}}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item, index})=>(
               <TouchableWithoutFeedback onPress={()=>this.next(item)}>
                    <Card containerStyle={{flex:1,flexDirection:'column',borderWidth:0.2,backgroundColor:'#fafdff',padding:0,paddingBottom:0}}>
                          <View style={{padding:8,paddingHorizontal:15,flexDirection:'column'}}>
                              <Text style={{fontSize:20,color:'#000000',paddingLeft:8}}>{item.contact==null?'':item.contact.name}</Text>
                              <Text style={{fontSize:20,color:'#000000',paddingLeft:8}}>{item.contact==null?'':item.contact.email}</Text>
                          </View>
                    </Card>
              </TouchableWithoutFeedback>
              )}
            /></ScrollView>
              <View style={{flex:0.2,position:'absolute',bottom:0,left:0,right:0,borderWidth:0,backgroundColor:'#b31423'}}>
                  <View style={{flexDirection:'row',marginBottom:0,paddingTop:8,paddingBottom:8,paddingHorizontal:8,justifyContent:'space-between'}}>
                      <TouchableOpacity style={{borderWidth:0,backgroundColor:'transparent'}} onPress={()=>this.PrevCampaignItem()}>
                            <Text style={{paddingVertical:4,paddingHorizontal:6,fontSize:16,color:'#ffffff'}}>Prev</Text>
                      </TouchableOpacity>
                      <Switch
                            value={this.state.SwitchOnValueHolder}
                            onValueChange={(value) => {this.ShowAlert(value);this.setState({value:value});}}
                            height={25}
                            width={width*0.6}
                            containerStyle={{width:width*0.6,height:25,borderWidth:0}}
                            backgroundActive={'#ffffff'}
                            backgroundInactive={'#ffffff'}
                            circleActiveColor={'#6f6f6f'}
                            circleInActiveColor={'#6f6f6f'}
                            circleBorderWidth={0}/>
                     <TouchableOpacity style={{borderWidth:0,backgroundColor:'transparent'}}onPress={()=>this.nextCampaignItem(this.state.value)}>
                            <Text style={{paddingVertical:4,paddingHorizontal:6,fontSize:16,color:'#ffffff'}}>Next</Text>
                     </TouchableOpacity>
                </View>
            </View>
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
