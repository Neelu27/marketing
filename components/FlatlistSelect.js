// import * as WebBrowser from 'expo-web-browser';
// import React,{Component} from 'react';
// import {
//   Image,Platform,ScrollView,
//   StyleSheet,Animated,WebView,
//   Text,TextInput,Dimensions,AsyncStorage,
//   TouchableOpacity,TouchableWithoutFeedback,
//   View,Button,ImageBackground,FlatList,Linking,
// } from 'react-native';
// import { Card } from 'react-native-elements';
// import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
// import Constants from 'expo-constants';
// import DatePicker from 'react-native-datepicker';
// import CheckBox from 'react-native-check-box';
// import { Ionicons ,FontAwesome } from '@expo/vector-icons';
// import Carousel from 'react-native-carousel';
// const { width } = Dimensions.get('window');
// import TimeAgo from 'react-native-timeago';
// import HTMLView from 'react-native-htmlview';
// // import HTML from 'react-native-render-html';
// export default class FlatlistSelect extends Component {
//       constructor(props){
//           super(props);
//           this.state={
//               isHorizontal:true,
//               scrollX: new Animated.Value(0),
//               list:[{name:'test',selected:'false',id:1},
//                     {name:'test',selected:'false',id:2},
//                     {name:'test',selected:'false',id:3},
//                     {name:'test',selected:'false',id:4},
//                     {name:'test',selected:'false',id:5},
//                     {name:'test',selected:'false',id:6},
//                     {name:'test',selected:'false',id:7},
//                     {name:'test',selected:'false',id:8},
//                     {name:'test',selected:'false',id:9},
//                     {name:'test',selected:'false',id:10},
//                     {name:'test',selected:'false',id:11},
//                           {name:'test',selected:'false',id:12},
//                           {name:'test',selected:'false',id:13},
//                           {name:'test',selected:'false',id:14},
//                           {name:'test',selected:'false',id:15},
//                           {name:'test',selected:'false',id:16},
//                           {name:'test',selected:'false',id:17},
//                           {name:'test',selected:'false',id:18},
//                           {name:'test',selected:'false',id:19},
//                           {name:'test',selected:'false',id:20},],
//
//               selected:true,
//           }
//       }
//
//       Selected=async(selected)=>{
//           console.log(selected,'selected',this.state.selected);
//           this.state.selected=selected
//           console.log(this.state.selected,'this.state.select');
//           // this.state.selected=true
//           console.log(this.state.selected,'this.state.select');
//
//       }
//
//
//
//
//       componentWillReceiveProps({navigation}) {
//         console.log(navigation,'rrrrrrrrrrrrrrrr');
//         var update = navigation.getParam('wentBack',null)
//         if(update == true){
//           this.getCampaignEX()
//         }
//
//
//     }
//
//   render(){
//
//
//       return(
//           <View style={{ flex: 1,backgroundColor:'#d4e2f0',marginBottom:50}}>
//           <FlatList
//               data={this.state.list}
//               showsVerticalScrollIndicator={false}
//               numColumns={3}
//               horizontal ={false}
//               extraData={this.state}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({item, index})=>(
//                <TouchableWithoutFeedback  style={{paddingBottom:60,backgroundColor:'#ffffff'}} onPress={()=>{this.Selected(item.selected);}}>
//                    <Card containerStyle={{flex:1,flexDirection:'column',borderWidth:0.2,padding:0,paddingBottom:0,borderRadius:50,backgroundColor:this.state.selected!=item.selected?'#ffffff':'#000000'}}>
//                           <View style={{padding:8,paddingHorizontal:15}}>
//                               <Text style={{fontSize:22,color:'#000000',paddingLeft:8}}>{item.name}</Text>
//                           </View>
//                       </Card>
//               </TouchableWithoutFeedback>
//               )}
//             />
//         </View>
//       );
//   }
// }
//
// const styles = StyleSheet.create({
//
//    lineStyle:{
//        borderWidth: 0.15,
//        borderColor:'#bebdbd',
//        shadowOpacity:0.2,shadowRadius: 0,elevation: 0.2,
//   },
//   lineStyle1:{
//        borderWidth: 0.15,
//        borderColor:'#bebdbd',
//
//   },
//   TouchableOpacityStyle: {
//        position: 'absolute',
//        width: 45,
//        height: 45,
//        alignItems: 'center',
//        justifyContent: 'center',
//        right: 30,
//        bottom: 30,
//        backgroundColor: '#2b79b0',
//        zIndex: 1,
//        borderRadius:25,
//    },
//    viewDiv :{
//        paddingHorizontal:5
//    }
// });




import React from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Text,AsyncStorage,
} from 'react-native';
import Constants from 'expo-constants';

const DATA = [{id: 1,title: 'First Item',},
              {id: 2,title: 'Second Item',},
              {id: 3,title: 'Third Item',},
              {id: 4,title: 'test',},
              {id: 5,title: 'Second test',},
              {id: 6,title: 'Rahul',},
              {id: 7,title: 'Campaign',},
              {id: 8,title: 'Second Item Test',},
              {id: 9,title: 'rtye',},
              {id: 10,title: 'First Itemtest',},
              {id: 11,title: 'Second ',},
              {id: 12,title: 'Itemtest',},
              {id: 13,title: 'First Item',},
              {id: 14,title: 'SecondItem',},
              {id: 15,title: 'Third Item',},
              {id: 16,title: 'First Item',},
              {id: 17,title: 'Second Item',},
              {id: 18,title: 'Third Item',},
              {id: 19,title: 'Item',},
              {id: 20,title: 'Second Item',},
              {id: 21,title: 'Third Item',},
              {id: 22,title: 'First Item',},
              {id: 23,title: 'Second ',},
              {id: 24,title: 'Third Item',},
              {id: 18,title: 'Third Item',},
              {id: 19,title: 'First Item',},
              {id: 20,title: 'Second Item',},
              {id: 21,title: ' Item',},
              {id: 22,title: 'First Item',},
              {id: 23,title: 'Second Item',},
              {id: 24,title: 'Third Item',},];

function Item({ id, title, selected, onSelect, }) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(id)}
      style={[
        styles.item,
        { backgroundColor: selected ? '#1a689a' : '#d6d7d7' },
      ]}
    >
      <Text style={[styles.title,{ color: selected ? '#ffffff' : '#000000' },]}>{title}</Text>
    </TouchableOpacity>
  );
}

 const App = ({getObj})=>{
  const [selected, setSelected] = React.useState(new Map());

  const onSelect = React.useCallback(
    id => {
      const newSelected = new Map(selected);
      newSelected.set("id",id,id,!selected.get(id));

      setSelected(newSelected);
      console.log(id,'newSelected');
      passObj(Object.fromEntries(newSelected))
    },
    [selected]
  );
  const obj = Object.fromEntries(selected);

  passObj=(obj)=>{
    getObj(obj)
  }
  console.log(JSON.stringify(obj),'obj');
  console.log(obj,'objSelected');

  return (

      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <Item
            id={item.id}
            title={item.title}
            selected={!!selected.get(item.id)}
            onSelect={onSelect}
          />
        )}
        numColumns={3}

        horizontal ={false}
        keyExtractor={item => item.id}
        extraData={selected}
      />

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#dddddd',
    borderWidth:0,
    padding:4,
    borderRadius:70,
    marginHorizontal:4,
    marginTop:6,marginBottom:6
  },
  title: {
    fontSize: 16,
    textAlign:'center',
    paddingVertical:4,
    paddingHorizontal:15,
  },
});

export default App
