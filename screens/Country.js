var React = require('react-native');
var {
    StyleSheet,
    View,
    Image
} = React;

var CountryPicker = require('react-native-country-picker');
var Button = require('react-native-simple-button');

module.exports = React.createClass({
    getInitialState() {
        return { code: null };
    },

    getSelectedCountry() {
        var _this = this;
        CountryPicker.show({
          title: 'Title',
          searchHintText: 'Search',
          preferredCountryCocde: 'HK JP',
          countryList: ['HK|+852|Hong Kong', 'JP|...'],  // Optional
          function(country){
            _this.setState({ code: country.code });
        });
    },

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.code}</Text>
                <Button onPress={this.getSelectedCountry.bind(this)}>
                    Launch Country Picker
                </Button>
            </View>
        );
    },
});


var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent',
        paddingVertical:150,
    }
});
