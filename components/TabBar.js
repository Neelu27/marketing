import React from 'react';
import {
  StyleSheet,Text,View,
  TouchableOpacity,
} from 'react-native';
import { Ionicons ,FontAwesome,MaterialCommunityIcons } from '@expo/vector-icons';

class TabBar extends React.Component {
  icons = [];
  constructor(props) {
    super(props);
    this.icons = [];
  }

  componentDidMount() {
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
  }

  setAnimationValue({ value, }) {
    this.icons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {
          color: this.iconColor(progress),
        },
      });
    });
  }

  //color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 0 + (255 - 0) * progress;
    const green = 0 + (255 - 0) * progress;
    const blue = 0 + (255 - 0) * progress;
    return '#ffffff';
  }

  render() {
    return <View style={[styles.tabs, this.props.style, ]}>
      {this.props.tabs.map((tab, i) => {
        return <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={[styles.tab,{backgroundColor: i === 0?'#982a2a':'#1d237d' ,borderBottomWidth:this.props.activeTab === i?5:0,borderBottomColor:this.props.activeTab === i?'#000000':'transparent'}]}>
         {i == 0&&
           <MaterialCommunityIcons
             name=''
             size={18}
             color={this.props.activeTab === i ? '#ffffff' : '#ffffff'}
             ref={(icon) => { this.icons[i] = icon; }}
           />
         }
         {i == 1&&
          <FontAwesome
            name=''
            size={18}
            color={this.props.activeTab === i ? '#ffffff' : '#ffffff'}
            ref={(icon) => { this.icons[i] = icon; }}
          />
        }
          <Text style={{color:'#ffffff',marginLeft:5,fontSize:16}}>
          {tab}
          </Text>
        </TouchableOpacity>;
      })}
    </View>;
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection:'row',
    paddingBottom: 10,
    paddingTop:10,
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor:'transparent',
  },

});

export default TabBar;
