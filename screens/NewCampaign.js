import React,{Component} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,TextInput,Alert,Dimensions,AsyncStorage,Keyboard,
  TouchableOpacity,LayoutAnimation,KeyboardAvoidingView,
  View,Button,ImageBackground,FlatList,ToastAndroid,TouchableWithoutFeedback
} from 'react-native';

import { Card,SearchBar} from 'react-native-elements';
import Constants from 'expo-constants';
import DatePicker from 'react-native-datepicker';
import { Ionicons ,FontAwesome} from '@expo/vector-icons';
import { Switch } from 'react-native-switch';
import InputView from 'rn-autoheight-input'
import ButtonGroup from 'react-native-button-group';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import HomeScreen from '../screens/HomeScreen';
import { Dropdown } from 'react-native-material-dropdown';
import Autocomplete from 'react-native-autocomplete-input';
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';
import FlatlistSelect from '../components/FlatlistSelect';
import { Camera } from 'expo-camera';
import Modal from "react-native-modal";
import AutoTags from 'react-native-tag-autocomplete';
const IS_IOS = Platform.OS === 'ios';
const {  width } = Dimensions.get('window');
const ScreenHeight = Dimensions.get("window").height;
const customData = require('../Country/countries.json');


export default class NewCampaign extends Component {
  constructor (props) {
    super(props);
      this.state ={
          sessionid:'',
          csrf:'',
          SERVER_URL:'',
          type: Camera.Constants.Type.back,
          hasCameraPermission:null,
          imageDetails:null,
          selectedImage:null,
          textname:'',
          textmobile:'',
          textemail:'',
          textcountry:'',
          pincode:'',
          Country:[],
          Countries:[],
          textcompany:'',
          selectedCoupon:JSON.stringify([{code:'IN',value:'India'}]),
          PinCode:[],
          company_street:'',
          company_city:'',
          company_state:'',
          company_pincode:'',
          company_country:'',
          PinCode1:[],
          modalVisible:true,
          textsource:"",
          suggestions:[],
          tagsSelected:[],
          text:'',
          tags:[],
        }
      Keyboard.addListener('keyboardDidHide',this.showKeyboard)

      Keyboard.addListener('keyboardDidShow', this.hideKeyboard)
    };

    showKeyboard =()=>{
        this.setState({keyboardOpen : false})
        this.setState({scrollHeight:this.state.scrollHeight})
        setTimeout(()=> {
            if (this.refs == undefined || this.refs._scrollView == undefined || this.refs._scrollView.scrollToEnd == undefined) {
              return
            }
            this.refs._scrollView.scrollToEnd({animated: true});
          }, 500);
    }

    hideKeyboard =(e)=>{
        this.setState({keyboardOpen : true})
        this.setState({keyboardHeight: e.endCoordinates.height+30});
        try {
          this.setState({scrollHeight:this.state.scrollHeight-500})
        }catch(e){}
         finally{}
        setTimeout(()=> {
          if (this.refs == undefined || this.refs._scrollView == undefined || this.refs._scrollView.scrollToEnd == undefined) {
            return
          }
          this.refs._scrollView.scrollToEnd({animated: true});
        }, 500);
    }

    // showKeyboard =()=>{
    //     this.setState({keyboardOpen : false})
    //     this.setState({scrollHeight:this.state.scrollHeight+10})
    //     setTimeout(()=> {
    //         if (this.refs == undefined || this.refs._scrollView == undefined || this.refs._scrollView.scrollToEnd == undefined) {
    //           return
    //         }
    //         this.refs._scrollView.scrollToEnd({animated: true});
    //       }, 500);
    // }
    //
    // hideKeyboard =(e)=>{
    //     this.setState({keyboardOpen : true})
    //     this.setState({keyboardHeight: e.endCoordinates.height+30});
    //     try {
    //       this.setState({scrollHeight:this.state.scrollHeight-500})
    //     }catch(e){}
    //      finally{}
    //     setTimeout(()=> {
    //       if (this.refs == undefined || this.refs._scrollView == undefined || this.refs._scrollView.scrollToEnd == undefined) {
    //         return
    //       }
    //       this.refs._scrollView.scrollToEnd({animated: true});
    //     }, 500);
    // }

    static navigationOptions =  ({ navigation }) => {
        const { params = {} } = navigation.state
        return {header:null,}
         //   return {
         //     title: 'Create a New Contact',
         //     headerStyle: {
         //       backgroundColor: '#122932',
         //       height: 45
         //     },
         //     headerTintColor: '#fff',
         //     headerTitleStyle: {
         //       alignSelf: 'center',
         //       marginLeft:5,
         //    }
         // }
      };
      componentDidMount(){
          this.getSource();

        console.log(JSON.stringify(customData),'customData');
        this.state.Country = customData;
        console.log(this.state.Country,'this.state.Country');
        var Countries  = [];
             for(var i = 0; i < this.state.Country.length; i++) {
                  Countries.push({value:this.state.Country[i].name,code:this.state.Country[i].code,title:this.state.Country[i].name})
                  if(this.state.Country[i].name=="India"){
                      this.state.textcountry=this.state.Country[i].name
                  }
              }
              console.log(this.state.textcountry,'hhhhhhhhhhhtextCountry')
             this.setState({Countries:Countries,})
             console.log(this.state.textcountry,'hhhhhhhhhhh')
      }

      cameraPermission=async()=>{
              const { status } = await Permissions.askAsync(Permissions.CAMERA);
                 this.setState({ hasCameraPermission: status === 'granted' });
          }
      setCameraImage =  (image,) => {
              this.setState({selectedImage:image.uri,imageDetails:image})
              this.setState({dp:true})
          }

      StatusListShow = (textcountry,index) =>{
            console.log(textcountry,'textcountry');
            if(textcountry==null && index==null){
              this.setState({textcountry:'',textcountryTitle:'',statuslist:false})
              return
            }
            this.setState({textcountry:this.state.Countries[index].value,dataSelect:index,});
            this.setState({textcountryTitle:this.state.Countries[index].title,dattagsaSelect:index});
            this.setState({statuslist: true})
        }

      getPincode1 = async(company_pincode)=>{
          this.setState({company_pincode:company_pincode})
          const SERVER_URL = await AsyncStorage.getItem('SERVER_URL');
          const sessionid = await AsyncStorage.getItem('sessionid');
          const csrf = await AsyncStorage.getItem('csrf');
          this.setState({sessionid:sessionid,csrf:csrf,SERVER_URL:SERVER_URL})
          try {
            console.log(this.state.company_pincode,this.state.company_pincode)
            if(this.state.company_pincode.length==6){
            await fetch(SERVER_URL+'/api/ERP/genericPincode/?pincode='+this.state.company_pincode,{
              method: 'GET',
              headers: {
                  "Cookie" :"csrf="+csrf+";sessionid=" + sessionid +";",
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'X-CSRFToken':csrf,
                  'Referer': SERVER_URL
                },
              }).then((response) => response.json())
                .then((responseJson) => {
                    this.setState({PinCode1:responseJson})
                    this.setState({company_pincode:company_pincode})
                    for (var i = 0; i < this.state.PinCode1.length; i++) {
                      this.setState({company_city:this.state.PinCode1[i].city})
                      this.setState({company_state:this.state.PinCode1[i].state})
                      this.setState({company_country:this.state.PinCode1[i].country})
                    }
                    console.log(this.state.company_city,' city  address data')
                    console.log(this.state.PinCode1,'address data')
                 })
                .catch((error) => {
                  console.error(error);
                });}
             }catch (error) {
               return
            }
        }

      setModalVisible(visible) {
          console.log('clickedddddddddd');
          this.state.textsource=this.state.text;
          console.log(this.state.textsource,"kkk");
          if(this.state.textsource!=''){
            this.setState({modalVisible: visible});
          }
      }

      SaveComAdd=async ()=>{
             var textsource=this.state.tagsSelected.map((i)=>{
                return i.name
             })

             // (this.state.tagsSelected!=null?this.state.tagsSelected[0].name:this.state.textsource)
             var dataSend={
               referenceId:null,
               addrs:null,
               directNumber:null,
               altNumber:null,
               altNumber2:null,
               website:null,
               socialLink:null,
               about:null,
               lang:null,
               name:this.state.textname,
               email:this.state.textemail,
               mobile:this.state.textmobile,
               companyName:this.state.textcompany,
               source:this.state.textsource,
               tags:this.state.tags,

               apiKey:"titan@1234",
               state:this.state.company_state,
               pinCode:this.state.company_pincode,
               country:this.state.textcountry,
               city:this.state.company_city,
             }
             const SERVER_URL = await AsyncStorage.getItem('SERVER_URL');
             const sessionid = await AsyncStorage.getItem('sessionid');
             const csrf = await AsyncStorage.getItem('csrf');
             this.setState({sessionid:sessionid,csrf:csrf,SERVER_URL:SERVER_URL});
             console.log(sessionid,csrf,dataSend,'dataSend');
             console.log(FlatlistSelect.obj,"FlatlistSelect");

               fetch(SERVER_URL+'/api/marketing/contacts/', {
                 method: 'POST',
                 headers: {
                   "Cookie" :"csrftoken="+csrf+";sessionid=" + sessionid +";",
                   'Content-Type': 'application/json',
                   'X-CSRFToken':csrf,
                   'Referer': SERVER_URL,
                 },
                 body:JSON.stringify(dataSend),
               }).then((response) =>{
                 console.log(response.status,'KKKKKKKKKKKKKKKKKK');
                 if(response.status == '200'||response.status == '201'){

                   this.setState({textname:'',textemail:'',textmobile:'',textcompany:'',textcountry:'',company_street:'',company_state:'',company_pincode:'',company_country:'',company_city:''})
                   return response.json();

                 }
               }).then((json) => {
                   console.log(json,'response added company address');
                   // var CompAdd =[]
                   // for(var i=0;i<json.length;i++){
                   //     CompAdd.push({pk:json[i].pk})
                   // }
                   // this.setState({CompAdd:CompAdd});
               })
               .catch((error) => {
                 console.log(error)
               });
           }
           handleDelete = index => {
                let tagsSelected = this.state.tagsSelected;
                tagsSelected.splice(index, 1);
                this.setState({ tagsSelected });
             }

             handleAddition = suggestion => {
                  if(this.state.tagsSelected.length==0){
                    this.setState({ tagsSelected: this.state.tagsSelected.concat([suggestion]) });
                    this.state.tagsSelected=this.state.tagsSelected.concat([suggestion])
                    console.log(this.state.tagsSelected,'this.state.tagsSelected')
                  }

               }


          getSource = async () => {

               const SERVER_URL = await AsyncStorage.getItem('SERVER_URL');
               const sessionid = await AsyncStorage.getItem('sessionid');
               const csrf = await AsyncStorage.getItem('csrf');
               console.log(sessionid,csrf);
               this.setState({sessionid:sessionid,csrf:csrf,SERVER_URL:SERVER_URL})
               await fetch(SERVER_URL+'/api/marketing/getSources/',{
                 method: 'GET',
                     headers: {
                         "Cookie" :"csrf="+csrf+";sessionid=" + sessionid +";",
                         'Accept': 'application/json',
                         'Content-Type': 'application/json',
                         'X-CSRFToken':csrf,
                         'Referer': SERVER_URL,

                       },
                   }).then((response) => response.json())
                     .then((responseJson) => {
                       console.log(responseJson,'dataaaaaaaa suggestions1')
                       console.log(this.state.suggestions,'gfhjgjuytyutyrterew suggestions');
                       var suggestions  = []
                           for (var i = 0; i < responseJson.length; i++) {
                             suggestions.push({name:responseJson[i].source,})
                           }
                           this.setState({suggestions:suggestions,})
                           console.log(this.state.suggestions,'gfhjgjuytyutyrterew meeting suggestions');
                     })
                     .catch((error) => {
                       console.error(error)
                       return
                     });

             };
   getObj=(select)=>{
     console.log(select,'uuuuuuuuuuu')
     // this.setState({tags:select})
     this.state.tags=select
     console.log(this.state.tags,'uuuuuuuuuuutags')
   }

    render(){

        return(

          <View style={{flex:1,}}>

            <View style={{height:Constants.statusBarHeight,backgroundColor:'#1a689a'}}></View>


          <ScrollView style={{marginBottom:this.state.keyboardOpen?this.state.keyboardHeight:0}}>
                <View style={{flexDirection:'column',padding:8,marginHorizontal:10,marginTop:10,}}>
                       <View style={{flexDirection:'column',marginBottom:0}}>
                          <Text style={{paddingBottom:2,fontSize:16}}>Name</Text>
                          <TextInput style={{height:30,paddingLeft:6,padding:4,  borderWidth: 0.2,fontSize:16,backgroundColor:'#ffffff'}}
                            onChangeText={(textname) => this.setState({textname})}
                            value={this.state.textname}>
                          </TextInput>
                      </View>
                      <View style={{flexDirection:'column',marginBottom:0}}>
                           <Text style={{paddingTop:6,paddingBottom:2, fontSize:16}}>Mobile</Text>
                           <TextInput style={{height:30,paddingLeft:6,padding:4,   borderWidth: 0.2,fontSize:16,backgroundColor:'#ffffff'}}
                              onChangeText={(textmobile) => this.setState({textmobile})}
                              keyboardType='numeric'
                              value={this.state.textmobile}>
                           </TextInput>
                      </View>
                      <View style={{flexDirection:'column',marginBottom:0}}>
                          <Text style={{paddingTop:6,paddingBottom:2,fontSize:16}}>Email</Text>
                          <TextInput style={{height:30,paddingLeft:6,padding:4,   borderWidth: 0.2,fontSize:16,backgroundColor:'#ffffff'}}
                              onChangeText={(textemail) => this.setState({textemail})}
                              value={this.state.textemail}>
                          </TextInput>
                      </View>
                      <View style={{flexDirection:'column',marginBottom:0}}>
                          <Text style={{paddingTop:6,paddingBottom:2,fontSize:16}}>Company</Text>
                          <TextInput style={{height:30,paddingLeft:6,padding:4,   borderWidth: 0.2,fontSize:16,backgroundColor:'#ffffff'}}
                              onChangeText={(textcompany) => this.setState({textcompany})}
                              value={this.state.textcompany}>
                          </TextInput>
                      </View>
                      <View style={{flexDirection:'column',marginBottom:0}}>
                          <Text style={{paddingTop:6,paddingBottom:2,fontSize:16}}>Country</Text>
                          <Dropdown
                              data={this.state.Countries}
                              onChangeText={(textcountry,index)=>{ this.StatusListShow(textcountry,index)}}
                              value={this.state.textcountry}
                              dropdownOffset={{top:0}}
                              containerStyle={{ borderWidth:0.4,paddingLeft:10,height:30,backgroundColor:'#fafdff',justifyContent:'center',borderColor:'#000',paddingTop:4,width:width*0.9,marginBottom:4}}
                              rippleCentered={true}
                              inputContainerStyle={{ borderBottomColor: 'transparent',fontSize:20 ,}}
                              pickerStyle={{ borderRadius:10,marginTop:width*0.14,paddingHorizontal:20,width:width*0.5,marginLeft:width*0.4,marginRight:width*0.1,}}
                              />
                     </View>
                     {this.state.textcountry == "India"&&
                     <View style={{flexDirection:'column',}}>
                          <Text style={{paddingTop:6,paddingBottom:2,fontSize:16}}>Pincode</Text>
                          <TextInput style={{height:30,paddingLeft:6,padding:4,   borderWidth: 0.2,fontSize:16,backgroundColor:'#ffffff'}}
                            keyboardType='numeric'
                            onChangeText={(company_pincode)=>this.getPincode1(company_pincode)}
                            value={this.state.company_pincode}
                            defaultValue={this.state.company_pincode.toString()}>
                          </TextInput>
                    </View> }
                    {this.state.PinCode1.length>0&&<View>
                    <View style={{flexDirection:'column',}}>
                          <Text style={{height:30,paddingLeft:6,padding:4,   borderWidth: 0,fontSize:16,backgroundColor:'#ffffff'}}>
                            City:-{this.state.company_city}
                          </Text>
                    </View>
                    <View style={{flexDirection:'column',}}>
                          <Text style={{height:30,paddingLeft:6,padding:4,   borderWidth: 0,fontSize:16,backgroundColor:'#ffffff'}}>
                            State:-{this.state.company_state}
                          </Text>
                    </View>
                    <View style={{flexDirection:'column',}}>
                          <Text style={{height:30,paddingLeft:6,padding:4,   borderWidth: 0,fontSize:16,backgroundColor:'#ffffff'}}>
                            Country:-{this.state.company_country}
                          </Text>
                   </View></View>}



                </View>
              </ScrollView>
                {!this.state.keyboardOpen&&<ScrollView style={{marginHorizontal:width*0.03,height:ScreenHeight*0.5}} >

                    <FlatlistSelect getObj={(select)=>this.getObj(select)} />
                    <View style={{paddingBottom:100}}></View>

                </ScrollView>}

                {!this.state.keyboardOpen&&
                <View style={{flexDirection:'row',borderWidth:0,justifyContent:'space-between',position:'absolute',bottom:0}}>
                      <TouchableOpacity
                            style={{flex:0.5,flexDirection: 'row',alignItems: 'center',justifyContent: 'center',backgroundColor:'#1a689a',paddingHorizontal:0,paddingVertical:8,borderRadius: 0}}
                            onPress={() =>{this.props.navigation.navigate('CameraScreen',{onGoBack:(image)=>this.setCameraImage(image)})} }>
                            {this.state.selectedImage&&
                                       <View style={{marginTop:0,marginRight:5}}>
                                         <Image
                                           source={{ uri: this.state.selectedImage }}
                                           style={{ width: 20,height:20}}
                                         />
                                       </View>
                                     }
                            <FontAwesome name="camera" size={20} style={{marginRight:5,color:'#ffffff',textAlign: 'center',}} />
                            <Text style={{fontSize:16,color:'#ffffff',textAlign:'center',paddingHorizontal:4,paddingVertical:4}}>Scan</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>this.SaveComAdd()}
                            style={{flex:0.5,flexDirection: 'row',alignItems: 'center',justifyContent: 'center',backgroundColor:'#1a689a',paddingHorizontal:4,paddingVertical:8,borderRadius: 0}}
                            >
                            <FontAwesome name="save" size={20} style={{marginRight:5,color:'#ffffff',textAlign: 'center',}} />
                            <Text style={{fontSize:16,color:'#ffffff',textAlign:'center',paddingHorizontal:4,paddingVertical:4}}>Save</Text>
                      </TouchableOpacity>
              </View>}
              <Modal isVisible={this.state.modalVisible} animationIn="fadeIn" animationOut="fadeOut" hasBackdrop={true} backdropColor={'#a4acb5'} >
                    <View style={[styles.modalView,{paddingVertical:15,paddingHorizontal:6}]}>
                      <TouchableOpacity style={{alignSelf:'flex-end',paddingHorizontal:10}} onPress={()=>{this.setState({modalVisible:false});this.props.navigation.goBack();}}><Text>X</Text></TouchableOpacity>
                          <View style={{flexDirection:'column',justifyContent:'center',paddingHorizontal:15,paddingTop:15}}>
                              <View style={{justifyContent:'center',paddingHorizontal:15,}}>
                                    <TextInput style={{borderWidth:0.2,paddingHorizontal:5,}}
                                                onChangeText={(text)=>this.setState({text})}
                                                value={this.state.text}
                                                placeholder="Add source..">
                                    </TextInput>


                              </View>
                              {this.state.suggestions!=null&&
                                <ScrollView style={{paddingHorizontal:15,height:100}}>{this.state.suggestions.map((i)=>
                                  {return(
                                    <View style={{paddingHorizontal:5,paddingVertical:4,backgroundColor:'#e8e8e8'}}>
                                      <TouchableOpacity onPress={()=>this.setState({text:i.name})} style={{paddingHorizontal:5,paddingVertical:2,}}><Text>{i.name}</Text></TouchableOpacity>
                                    </View>
                                  )}
                                )}
                              </ScrollView>}
                          </View>
                          <View style={{}}>
                            <TouchableOpacity onPress={()=>{this.setModalVisible(!this.state.modalVisible)}}>
                              <Text  style={{fontSize:16,color:'#fff',fontWeight:'600',backgroundColor: "#1b3f4d",paddingVertical:3,paddingHorizontal: 15,alignSelf:'center',marginTop:15,borderRadius:3}}>Ok</Text>
                            </TouchableOpacity>
                          </View>
                      </View>
                  </Modal>

    </View>
    );
  }
}

const styles=StyleSheet.create({
    container: {
        flex:1,
        flexDirection:'column',
        margin:3,
        backgroundColor: 'transparent',
        padding:0,
  },

  root: {
        flex: 1,
        paddingTop: 0,
        backgroundColor:'#eee',
        flexDirection: 'column',
        justifyContent: 'flex-start',
  },
  AutoSuggest: {
       width: 300,
       paddingLeft: 10,
       fontSize: 12,
       backgroundColor: 'lightgrey',
       height: 40,
   },
   modalView: {
      backgroundColor: '#fff',
      marginHorizontal: width*0.05 ,
      borderRadius:5,
  },
  });

  {/* <TextInput
        style={{height:35,paddingLeft:6,padding:4,  borderWidth: 0.2,fontSize:16,backgroundColor:'#ffffff'}}
        onChangeText={(textsource) => this.setState({textsource})}
        value={this.state.textsource}>
  </TextInput> */}

  // height:ScreenHeight*0.85,

    // <TouchableOpacity style={{backgroundColor:'#134149',paddingHorizontal:5,borderRadius:3,paddingVertical:2}} onPress={()=>this.setState({textsource:this.state.text})}><Text style={{color:'#ffffff',}}>Add</Text></TouchableOpacity>
