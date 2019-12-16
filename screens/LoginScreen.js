import React, { Component }  from 'react';
import { Alert, ScrollView, StyleSheet, View, Text, TextInput, Picker, TouchableHighlight,TouchableOpacity, ImageBackground, Image,AsyncStorage,Keyboard,Linking,PermissionsAndroid,ToastAndroid,Dimensions} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Constants from 'expo-constants';
import SmsListener from 'react-native-android-sms-listener'
import GradientButton from "react-native-gradient-buttons";
import { FontAwesome } from '@expo/vector-icons';
// import Setting from '../constants/Setting';
import * as Expo from 'expo';
import * as Permissions from 'expo-permissions';


const { width } = Dimensions.get('window');
const height = width * 0.8
// const SERVER_URL = Setting.url;

export default  class LoginScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
          needOTP : false,
          username:'',
          sessionid:'',
          name:'',
          token:'',
          loginname:'',
          password:'',
          url:'',
      }
      Keyboard.addListener('keyboardDidHide',this.showKeyboard)
      Keyboard.addListener('keyboardDidShow', this.hideKeyboard)
      this.SMSReadSubscription = {};
      SmsListener.addListener(message => {
        console.info(message,'opppppppppppp')
      })
    }

    showKeyboard =()=>{
        this.setState({keyboardOpen : false})
        this.setState({scrollHeight:this.state.scrollHeight+500})
        setTimeout(()=> {
          if (this.refs == undefined || this.refs._scrollView == undefined || this.refs._scrollView.scrollToEnd == undefined) {
            return
          }
          this.refs._scrollView.scrollToEnd({animated: true});
        }, 500);
    }

    hideKeyboard =(e)=>{
        this.setState({keyboardOpen : true})
        this.setState({keyboardHeight:e.endCoordinates.height+30});
        try {
          this.setState({scrollHeight:this.state.scrollHeight-500})
        } catch (e) {} finally {}
        setTimeout(()=> {
          if (this.refs == undefined || this.refs._scrollView == undefined || this.refs._scrollView.scrollToEnd == undefined) {
            return
          }
          this.refs._scrollView.scrollToEnd({animated: true});
          }, 500);
      }

    componentWillUnmount() {
        this.SMSReadSubscription.remove();
    }
    // sendurl(){
    //   this.props.navigation.navigate('Setting',{user:{url:this.state.url}});
    // }

        async requestReadSmsPermission() {
        try {
          var granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_SMS,
            {
              title: "Auto Verification OTP",
              message: "need access to read sms, to verify OTP"
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("sms read permissions granted", granted);
            granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,{
                title: "Receive SMS",
                message: "Need access to receive sms, to verify OTP"
              }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log("RECEIVE_SMS permissions granted", granted);
            } else {
              console.log("RECEIVE_SMS permissions denied");
            }
          } else {
            console.log("sms read permissions denied");
          }
          } catch (err) {
            console.log(err);
          }
        }

    componentDidMount() {
        this.setState({url:'https://erpdemo.cioc.in'})
        // this.requestReadSmsPermission()
        this.SMSReadSubscription = SmsListener.addListener(message => {
          let verificationCodeRegex = /([\d]{4})/
          if (verificationCodeRegex.test(message.body)) {
          let verificationCode = message.body.match(verificationCodeRegex)[1]
          console.log(verificationCode)
            this.setState({OTP:verificationCode})
          }
        });
      }


    sendOtp() {
        console.log(this.state.mobileNo);
        if(this.state.mobileNo == undefined){
          ToastAndroid.show('Enter Correct Mobile No', ToastAndroid.SHORT);
        }else{
          var data = new FormData();
          data.append( "id", this.state.mobileNo );
          console.log(this.state.url,'ppppppppp');
          fetch(this.state.url + '/generateOTP/', {method: 'POST',body: data,}) .then((response) =>{
            console.log(response.status,'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh')
            console.log(this.state.mobileNo,'this.state.mobileNo');
            ToastAndroid.show('Otp send...', ToastAndroid.SHORT);
            if (response.status == '200'||response.status == 200 ){
              this.setState({ username: this.state.mobileNo })
              this.setState({ needOTP: true })
              return response.json()
            }
            else{
              ToastAndroid.show('Mobile no was incorrect...', ToastAndroid.SHORT);
            }})
          .then((responseJson) => {
            this.setState({ OTP: responseJson })
            console.log(responseJson,'otp ................');
          })
          .catch((error) => {
            // ToastAndroid.show('Mobile no was incorrect...............', ToastAndroid.SHORT);

          });
        }
    }


    logIn(){
        var serverURL = this.state.url;
        if(this.state.needOTP == false){
          console.log(this.state.username,this.state.otp ,'hhh')
          var data = new FormData();
           data.append( "username", this.state.username );
           data.append( "password", this.state.otp );
           fetch(this.state.url + '/login/?mode=api', {
             method: 'POST',
             body: data,
             headers : {
             }
           })
           .then((response) =>{
           console.log(response)
           if (response.status == 200){
             var sessionid = response.headers.get('set-cookie').split(';')[0].split('=')[1]
             this.setState({sessionid:sessionid})
             AsyncStorage.setItem("sessionid", JSON.stringify(sessionid))
             return response.json()
           }else{
             ToastAndroid.show('Incorrect Username or Password', ToastAndroid.SHORT);
             return
           }})
           .then((responseJson) => {
             console.log(responseJson,'kkkkkkkkkkkkkkkkkkkkkkkkkk ');
             AsyncStorage.setItem("csrf", responseJson.csrf_token)
             fetch(this.state.url + '/api/HR/users/?mode=mySelf&format=json', {
               headers: {
                  "Cookie" :"csrftoken="+responseJson.csrf_token+";sessionid=" + this.state.sessionid +";",
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
                 'Referer': this.state.url,
                 'X-CSRFToken': responseJson.csrf_token
               },
               method: 'GET'
                })
               .then((response) =>{
                 if (response.status !== 200) {
                  return;
                }
                else if(response.status == 200){
                 return response.json()
                }
              })
           .then((responseJson) => {
               console.log(responseJson,'mode sucesss');
             AsyncStorage.setItem("userpk", JSON.stringify(responseJson[0].pk))
             AsyncStorage.setItem("userpic",JSON.stringify(responseJson[0].profile))
             AsyncStorage.setItem("first_name",JSON.stringify(responseJson[0].first_name))
             AsyncStorage.setItem("last_name",JSON.stringify(responseJson[0].last_name))
             AsyncStorage.setItem("SERVER_URL", this.state.url)
             AsyncStorage.setItem("login", JSON.stringify(true)).then(res => {
                   return  this.props.navigation.navigate ('DefaultScreen')
               });
           })
         })
         .catch((error) => {
           ToastAndroid.show('Incorrect Username or Password', ToastAndroid.SHORT);
         });
       }else{
         var data = new FormData();
         data.append( "username", this.state.username );
         data.append( "otp", this.state.otp );
         fetch(this.state.url + '/login/?otpMode=True&mode=api', {
           method: 'POST',
           body: data,
           headers : {
           }
         })
         .then((response) =>{
           console.log(response.status, 'otpmode login');
           if (response.status == 200){
             var sessionid = response.headers.get('set-cookie').split(';')[0].split('=')[1]

             this.setState({sessionid:sessionid})
             AsyncStorage.setItem("sessionid", sessionid)
             return response.json()
           }
           else{
             ToastAndroid.show('Mobile no was incorrect...', ToastAndroid.SHORT);
           }})
           .then((responseJson) => {
             // console.log(responseJson.csrf_token,'kkkkkkkkkkkkkkkkkkkkkkkkkk');
             AsyncStorage.setItem("csrf", responseJson.csrf_token)
             AsyncStorage.setItem("SERVER_URL", this.state.url)
             console.log(AsyncStorage.setItem("SERVER_URL", this.state.url),'url');
             fetch(this.state.url + '/api/HR/users/?mode=mySelf&format=json', {
               headers: {
                  "Cookie" :"csrftoken="+responseJson.csrf_token+";sessionid=" + this.state.sessionid +";",
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
                 'Referer': this.state.url,
                 'X-CSRFToken': responseJson.csrf_token
               },
               method: 'GET'
              })
             .then((response) =>{
               if (response.status !== 200) {
                   ToastAndroid.show(' no was incorrect...', ToastAndroid.SHORT);
                 }
                 else if(response.status == 200){
                   return response.json()
                 }
               })
               .then((responseJson) => {
                 console.log(responseJson,'mode sucesss');
                 this.setState({needOTP:false})
                 AsyncStorage.setItem("userpk", JSON.stringify(responseJson[0].pk))

                 AsyncStorage.setItem("SERVER_URL", this.state.url)
                 console.log(this.state.url,'urllllllll');
                 AsyncStorage.setItem("login", JSON.stringify(true)).then(res => {
                 return  this.props.navigation.navigate('DefaultScreen',{sendurl:this.state.url});
             });
           })
         })
         .catch((error) => {
           ToastAndroid.show('Incorrect OTP', ToastAndroid.SHORT);
         });
       }
   }

    submit() {
    this.props.navigation.navigate('Tab')
    // fetch('http://192.168.1.6:8000/login', {
    //   method: 'POST',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     username: this.state.username,
    //     password: this.state.password,
    //   }),
    // }).then((response) => response.json())
    //     .then((responseJson) => {
    //     Alert.alert('here')
    //     this.props.navigation.navigate('Tab')
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    }
  render(){
     const {navigate} = this.props.navigation;
     return (
        <View style={{flex: 1,justifyContent:'center',marginBottom: this.state.keyboardOpen?this.state.keyboardHeight:10}}>
            <View style={{height:Constants.statusBarHeight,backgroundColor:'#2b79b0'}}></View>
            <View style={{marginTop: width*0.10,marginHorizontal:width*0.03}}>
                <View style={{flex:1,flexDirection: 'column',alignItems: 'center',paddingTop:width*0.15}}>
                      <Text style={{fontWeight: 'bold',fontSize: 40,color:'#2b79b0'}}> Login </Text>
                      <Text style={{fontSize: 10,}}> Great To See You Again </Text>
                </View>

                <View style={{flexDirection:"row",marginTop: width*0.3,paddingLeft:50,paddingRight:50}}>
                      <View style={{ flex: 1,flexDirection:"row",}}>
                          <TextInput style={{height: 40,borderBottomColor: 'black', borderBottomWidth: 1,width:width*0.68,paddingLeft:10}} placeholder="Enter url" placeholderTextColor='#000' secureTextEntry={false}   onChangeText={query => { this.setState({ url: query }); }}
                          value={this.state.url}/>
                      </View>
               </View>

              <View style={{flexDirection:"row",marginTop: 30,paddingLeft:width*0.05}}>
                    <View style={{ flex: 1,flexDirection:'row'}}>
                        <Text style={{color:'#000',fontSize:16,borderWidth:1,borderTopLeftRadius:7,width:width*0.14,borderBottomLeftRadius:7,borderColor:'#000',height:40,paddingVertical:9,paddingHorizontal:10,}}>+91</Text>
                        <TextInput style={{height: 40,width:width*0.47,borderBottomColor: 'black', borderBottomWidth: 1,borderTopColor: 'black', borderTopWidth: 1,fontSize:16,paddingLeft: 10}}
                          placeholder="Username/Mobile No"
                          placeholderTextColor="#707070"
                          onChangeText={query => { this.setState({ mobileNo: query });
                                              this.setState({ username: query }) }}
                                              value={this.state.username}/>

                        <TouchableOpacity onPress={() => this.sendOtp()}><Text style={{color:'#000',fontSize:16,width:width*0.25,borderWidth:1,borderTopRightRadius:7,borderBottomRightRadius:7,borderColor:'#000',height:40,paddingVertical:9,paddingHorizontal:10,}}> Get OTP</Text></TouchableOpacity>
                  </View>
              </View>
              <View style={{flexDirection:"row",marginTop: 21,paddingLeft:50,paddingRight:50}}>
                  <View style={{ flex: 1}}>
                      <TextInput style={{height: 40,borderBottomColor: 'black', borderBottomWidth: 1,width:width*0.68,paddingLeft:10}} placeholder="Password/OTP" placeholderTextColor='#000' secureTextEntry={true}   onChangeText={query => { this.setState({ otp: query }); }}
                        value={this.state.otp}/>
                  </View>
              </View>

              <View style={{flex:1,flexDirection:"row",alignItems: 'center',padding:50}}>
                  <TouchableOpacity  style={styles.submit} underlayColor='#cd3534' activeOpacity={0.2}>
                      <GradientButton
                         style={{ marginRight:40,
                         marginLeft:40,
                         marginTop:10,
                         paddingVertical:5,borderRadius:50, }}
                         textStyle={{ fontSize: 20 }}
                         text="Login"
                         height={50}
                         gradientBegin="#2b79b0"
                         gradientEnd="#22ade9"
                         gradientDirection="diagonal"
                         impact
                         onPressAction={() => this.logIn()}
                       />
                   </TouchableOpacity>
              </View>
        </View>
        <View style={{flex:1, justifyContent: 'flex-end',flexDirection:"column",alignItems: 'center',marginTop:20}}>
        </View>
    </View>
    );
  }
}

// LoginScreen.navigationOptions = {
//   title: 'Login',
// };

const styles = StyleSheet.create({
  submit:{
      marginRight:40,
      marginLeft:40,
      marginTop:10,
      paddingTop:10,
      paddingBottom:10,
      // backgroundColor:'#cd3534',
      borderRadius:50,
      // borderWidth: 1,
      // borderColor: '#000000'
  },

  imgBackground: {
          width: '100%',
          height: '100%',
          flex: 1
  },
  });
