'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createReactClass from 'create-react-class';

import {
  StyleSheet,
  TextInput,
  LayoutAnimation,
  Animated,
  Easing,
  Text,
  View,
  Platform,
  ViewPropTypes,
  Image,
  TouchableOpacity
} from 'react-native';
const SHOW = require('../../node_modules/react-native-floating-labels/view.png')
const HIDE = require('../../node_modules/react-native-floating-labels/hide.png')

var textPropTypes = Text.propTypes || ViewPropTypes
var textInputPropTypes = TextInput.propTypes || textPropTypes
var propTypes = {
  ...textInputPropTypes,
  inputStyle: textInputPropTypes.style,
  labelStyle: textPropTypes.style,
  disabled: PropTypes.bool,
  style: ViewPropTypes.style,
}

var FloatingLabel = createReactClass({
  propTypes: propTypes,

  getInitialState() {
    var state = {
      text: this.props.value,
      dirty: (this.props.value || this.props.placeholder),
      isPasswordSecured: true
    };

    var style = state.dirty ? this.props.dirtyStyle : this.props.cleanStyle
    state.labelStyle = {
      fontSize: new Animated.Value(style.fontSize),
      top: new Animated.Value(style.top)
    }

    return state
  },

  componentWillReceiveProps(props) {
    if (typeof props.value !== 'undefined' && props.value !== this.state.text) {
      this.setState({ text: props.value, dirty: !!props.value })
      this._animate(!!props.value)
    }
  },

  _animate(dirty) {
    var nextStyle = dirty ? this.props.dirtyStyle : this.props.cleanStyle
    var labelStyle = this.state.labelStyle
    var anims = Object.keys(nextStyle).map(prop => {
      return Animated.timing(
        labelStyle[prop],
        {
          toValue: nextStyle[prop],
          duration: 200
        },
        Easing.ease
      )
    })

    Animated.parallel(anims).start()
  },

  _onFocus() {
    this._animate(true)
    this.setState({ dirty: true })
    if (this.props.onFocus) {
      this.props.onFocus(arguments);
    }
  },

  _onBlur() {
    if (!this.state.text) {
      this._animate(false)
      this.setState({ dirty: false });
    }

    if (this.props.onBlur) {
      this.props.onBlur(arguments);
    }
  },

  onChangeText(text) {
    this.setState({ text })
    if (this.props.onChangeText) {
      this.props.onChangeText(text)
    }
  },

  updateText(event) {
    var text = event.nativeEvent.text
    this.setState({ text })

    if (this.props.onEndEditing) {
      this.props.onEndEditing(event)
    }
  },

  _renderLabel() {
    return (
      <Animated.Text
        ref='label'
        style={[this.state.labelStyle, styles.label, this.props.labelStyle]}
      >
        {this.props.children}
      </Animated.Text>
    )
  },
  handleOnEyePress() {
    this.setState({ isPasswordSecured: !this.state.isPasswordSecured })
  },
  renderPasswordShowButton() {
    if (this.props.passwordEyeEnabled) {
      return (
        this.state.isPasswordSecured ?
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={this.handleOnEyePress}
          >
            <Image source={SHOW} style={styles.eye} />
          </TouchableOpacity>
          :
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={this.handleOnEyePress}
          >
            <Image source={HIDE} style={styles.eye} />
          </TouchableOpacity>
      )
    }
  },
  render() {
    var props = {
      ref: this.props.inputRef,
      autoCapitalize: this.props.autoCapitalize,
      autoCorrect: this.props.autoCorrect,
      autoFocus: this.props.autoFocus,
      bufferDelay: this.props.bufferDelay,
      clearButtonMode: this.props.clearButtonMode,
      clearTextOnFocus: this.props.clearTextOnFocus,
      controlled: this.props.controlled,
      editable: this.props.editable,
      enablesReturnKeyAutomatically: this.props.enablesReturnKeyAutomatically,
      keyboardType: this.props.keyboardType,
      multiline: this.props.multiline,
      numberOfLines: this.props.numberOfLines,
      onBlur: this._onBlur,
      onChange: this.props.onChange,
      onChangeText: this.onChangeText,
      onEndEditing: this.updateText,
      onFocus: this._onFocus,
      onSubmitEditing: this.props.onSubmitEditing,
      password: ((this.props.password || this.props.secureTextEntry) && this.state.isPasswordSecured) , // Compatibility
      placeholder: this.props.placeholder,
      secureTextEntry: ((this.props.secureTextEntry || this.props.password) && this.state.isPasswordSecured), // Compatibility
      returnKeyType: this.props.returnKeyType,
      selectTextOnFocus: this.props.selectTextOnFocus,
      selectionState: this.props.selectionState,
      selectionColor: this.props.selectionColor,
      style: [styles.input],
      testID: this.props.testID,
      value: this.state.text,
      underlineColorAndroid: this.props.underlineColorAndroid, // android TextInput will show the default bottom border
      onKeyPress: this.props.onKeyPress
    },
      elementStyles = [styles.element];

    if (this.props.inputStyle) {
      props.style.push(this.props.inputStyle);
    }

    if (this.props.style) {
      elementStyles.push(this.props.style);
    }

    return (
      <View style={elementStyles}>
        {this._renderLabel()}
        <TextInput
          {...props}
        >
        </TextInput>
        {this.renderPasswordShowButton()}
      </View>
    );
  },
});

var labelStyleObj = {
  marginTop: 21,
  paddingLeft: 9,
  color: '#AAA',
  position: 'absolute'
}

if (Platform.OS === 'web') {
  labelStyleObj.pointerEvents = 'none'
}

var styles = StyleSheet.create({
  element: {
    position: 'relative'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    borderWidth: 1,
    color: 'black',
    fontSize: 20,
    borderRadius: 4,
    paddingLeft: 0,
    marginTop: 20,
  },
  label: labelStyleObj,
  eye: {
    width: 30,
    height: 30,
    tintColor:'#fff'
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    height:'100%',
    justifyContent: 'center',
    alignItems:'center',
    paddingHorizontal:10,
    paddingTop: 15,
  }
})

// var cleanStyle = {
//   fontSize: 20,
//   top: 7
// }

// var dirtyStyle = {
//   fontSize: 12,
//   top: -17,
// }

FloatingLabel.defaultProps = {
  cleanStyle: {
    fontSize: 16,
    top: 10
  },
  dirtyStyle: {
    fontSize: 12,
    top: -10,
  }
}
module.exports = FloatingLabel;
