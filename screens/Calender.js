// import MiniCalendar from 'react-native-minicalendar';
// export default class Calender extends Component {
//   constructor(props){
//     super(props);
//     this.state={}
//   }
// render() {
//     return (
//       <View style={{
//       flex:1}}>
//         <View style={{width: 200}}>
//           <MiniCalendar
//             showDayHeading={true}
//             dayHeadings={['Su','Mo','Tu','We','Th','Fr','Sa']}
//             onDateSelect={this.onDateSelect.bind(this)}
//             startDate={moment().format('YYYY-MM-DD')}
//             selectedDate={moment((new Date()).toISOString()).format('YYYY-MM-DD')}
//             numberOfDaysToShow={7}
//             enabledDaysOfTheWeek={['Mo','We','Fr']}
//             isoWeek={false}
//             disablePreviousDays={true}
//             disableToday={false}
//             dayStyle={{ textAlign: 'center', lineHeight: 56 }}
//             headingStyle={{backgroundColor: 'navy', lineHeight: 26}}
//             activeDayStyle={{backgroundColor: 'green', color: 'white'}}
//             disabledDayStyle={{backgroundColor: 'grey', color: 'darkgrey'}}
//             selectedDayStyle={{backgroundColor: 'orange', color: 'black'}}
//           />
//         </View>
//       </View>
//     );
//   }
// }
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View, Text, Alert, ImageBackground, Image, TouchableHighlight } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Carousel from 'react-native-carousel'
import moment from "moment";
import { Ionicons } from '@expo/vector-icons';
import { Constants } from 'expo';
import ExploreCampaign from '../screens/ExploreCampaign';
export default class Calender extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
       iconColour: "#bb5a51"
    };
    this.onDateChange = this.onDateChange.bind(this);
  }
  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
  }

  colorChange(value) {
    if (value=='Patient') {

    }
}
  render() {
    let dates = ['2019-06-09','2019-06-20','2019-06-26','2019-07-26']
    let customDatesStyles = [];
    for (var i = 0; i < dates.length; i++) {
        customDatesStyles.push({
          date: dates[i],
          style: {backgroundColor: '#ffffff'},
          textStyle: {color: '#e34949'},
          containerStyle: [],
        });
    }
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    return (
      <View style={{flex:1}}>
        <View style={{height:Constants.statusBarHeight,backgroundColor:'#cd3534'}}></View>
          <View style={styles.container}>
            <View style={{flex:1,backgroundColor:'#ffffff',paddingBottom:14}}>
              <CalendarPicker
                onDateChange={this.onDateChange}
                todayTextStyle={{fontWeight: 'bold'}}
                todayBackgroundColor={'#dedede'}
                customDatesStyles={customDatesStyles}
                selectedDayColor="transparent"
                selectedDayTextColor="#faf137"
                // minDate={today}
              />
              </View>

            </View>
        </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop:10,
  },

   cont1:{
      padding:10,
      flex:1,
      backgroundColor:'#ffffff',
      borderRadius:10,
      height:75,
      flexDirection: 'row',
      justifyContent: 'center'

     },

});
