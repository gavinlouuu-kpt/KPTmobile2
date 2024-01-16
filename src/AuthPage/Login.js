import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, Dimensions } from 'react-native'
import { Input, FormControl, Button } from "native-base";
import { useHeaderHeight } from '@react-navigation/elements';

import { useAuth } from "../Authentication/AuthProvider"

import { replaceString } from "../utils";

export default function Login({ navigation }) {

  const windowWidth = Dimensions.get('window').width;

  const { Login } = useAuth();
  const headerHeight = useHeaderHeight();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)

  const handleLogin = async () => {
    if (email !== '' && password !== '') {
      try {
        await Login(email, password);
      } catch (error) {
        return setErrorMessage(replaceString(error.code, error.message))
      }
    } else {
      setErrorMessage('Email or Password is empty!');
    }
  }

  const handleRegister = () => {
    setErrorMessage(null)
    navigation.navigate('Register')
  }

  const handleResetPassword = () => {
    setErrorMessage(null)
    navigation.navigate('ForgetPassword')
  }

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={headerHeight}
          style={{ flex: 1, backgroundColor: "#ffffff" }}
        >
          <View style={{ flex: 5}}>
            <View style={{ backgroundColor: "#ffffff", justifyContent: "center", paddingHorizontal: 10 }}>
              <Image source={require('../image/logo_wall.png')} style={{ width: windowWidth - 20 }} resizeMode="contain" />
            </View> 
          </View>
          
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ color: '#000', fontSize: 30, fontWeight: "bold" }}>Public Sector Trial Scheme</Text>
          </View>

          <View style={{ flex: 2, justifyContent: "center", marginHorizontal: 20 }}>
            <Text>This project was jointly developed by King's Phase Technologes Co., Ltd., a member of the Hong Kong Science Park, and The Chinese University of Hong Kong.</Text>
          </View>

          <View style={{ flex: 4, marginHorizontal: 20 }}>
            <FormControl style={{ marginBottom: 10 }}>
              <Input 
                variant="underlined" 
                placeholder="example@example.com" 
                px={0} 
                onChangeText={(Text) => setEmail(Text)} 
                style={{ fontSize: 14 }}
              />
              <FormControl.HelperText>
                <Text style={{ fontSize: 18 }}>
                Email
                </Text>
              </FormControl.HelperText>
            </FormControl>



            <FormControl>
              <Input 
                type="password" 
                variant="underlined" 
                placeholder="password" 
                px={0} 
                onChangeText={(Text) => setPassword(Text)}
                style={{ fontSize: 18 }}
              />
              <FormControl.HelperText>
                Password
              </FormControl.HelperText>
            </FormControl>
            
            <FormControl isInvalid={errorMessage !== null}>
              <FormControl.ErrorMessage>
                {errorMessage}
              </FormControl.ErrorMessage>
            </FormControl>
            <View style={{ marginVertical: 20, flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
                <TouchableOpacity onPress={handleResetPassword}>
                  <Text>
                    Forget Password?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRegister}>
                  <Text>
                    Register
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Button size="md" onPress={handleLogin}>
                  LOGIN
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  )
}