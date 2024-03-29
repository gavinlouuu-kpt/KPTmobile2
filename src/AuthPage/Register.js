import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Animated, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { Input, FormControl, Button, Radio } from "native-base";

import { useAuth } from "../Authentication/AuthProvider";
import { useHeaderHeight } from '@react-navigation/elements';

import { ValidateEmail, replaceString } from "../utils";

export default function Register() {

  const { Register, AddUser } = useAuth();
  const headerHeight = useHeaderHeight();

  const slideAnime = useRef(new Animated.Value(0)).current;

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false)
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [username, setUsername] = useState("")
  const [usergroup, setUsergroup] = useState("Student")
  const [hyperText, setHyperText] = useState(null)

  const handleSubmit = async () => {
    if (email === "" || password === "" || confirmPassword === "") {
      return setHyperText("Column must not empty!")
    } else {
      setHyperText(null)
      if (!ValidateEmail(email)) {
        return setEmailError(!ValidateEmail(email))
      }
      if (password !== confirmPassword) {
        return setPasswordError(true)
      }
      setPasswordError(false)
      setEmailError(false)
      try {
        const account = await Register(
          email, password
        );
        await AddUser(account, username, email, usergroup)
      } catch (error) {
        console.log(error)
        return setHyperText(replaceString(error.code, error.message))
      }
    }
  }

  useEffect(() => {
    Animated.timing(slideAnime, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [slideAnime])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, backgroundColor: "#ffffff", justifyContent: "flex-end" }}>
        <Animated.View style={{
          transform: [
            {
              translateY: slideAnime.interpolate({
                inputRange: [0, 1],
                outputRange: [600, 0]
              })
            }
          ],
          flex: 0.99,
          backgroundColor: "#ffffff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 6,
          },
          shadowOpacity: 0.37,
          shadowRadius: 7.49,
          elevation: 12,
        }}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={headerHeight}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <View style={{ flex: 1, margin: 20 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>Registration</Text>
                <FormControl isRequired isInvalid={emailError}>
                  <Input variant="underlined" placeholder="example@example.com" px={0} onChangeText={(Text) => setEmail(Text)} isInvalid={emailError} />
                  {emailError ?
                    <FormControl.ErrorMessage>
                      Invalid Email! Please Try Again!
                    </FormControl.ErrorMessage> :
                    <FormControl.HelperText>
                      Email
                    </FormControl.HelperText>}
                </FormControl>
                <FormControl isRequired isInvalid={passwordError}>
                  <Input type="password" variant="underlined" placeholder="password" px={0} onChangeText={(Text) => setPassword(Text)} />
                  {passwordError ?
                    <FormControl.ErrorMessage>
                      Password not the same!
                    </FormControl.ErrorMessage> :
                    <FormControl.HelperText>
                      Password
                    </FormControl.HelperText>}
                </FormControl>
                <FormControl isRequired isInvalid={passwordError}>
                  <Input type="password" variant="underlined" placeholder="ConfirmPassword" px={0} onChangeText={(Text) => setConfirmPassword(Text)} />
                  {passwordError ?
                    <FormControl.ErrorMessage>
                      Password not the same!
                    </FormControl.ErrorMessage> :
                    <FormControl.HelperText>
                      ConfirmPassword
                    </FormControl.HelperText>}
                </FormControl>
                <FormControl isRequired >
                  <Input variant="underlined" placeholder="username" px={0} onChangeText={(Text) => setUsername(Text)} />
                  <FormControl.HelperText>
                    Username
                  </FormControl.HelperText>
                </FormControl>
                <FormControl style={{ flexDirection: "row", }}>
                  <FormControl.HelperText>
                    User's Group:
                  </FormControl.HelperText>
                  <Radio.Group name="userSelect" defaultValue='Student' style={{ flexDirection: "row" }} onChange={value => setUsergroup(value)}>
                    <Radio value="Student" m={1} size="sm">
                      Student
                    </Radio>
                    <Radio value="Instructor" m={1} size="sm">
                      Instructor
                    </Radio>
                  </Radio.Group>
                </FormControl>
                <FormControl isInvalid={hyperText !== null}>
                  <FormControl.ErrorMessage>
                    {hyperText}
                  </FormControl.ErrorMessage>
                </FormControl>
              </View>
              <View style={{ alignSelf: "flex-end" }}>
                <Button size="md" onPress={handleSubmit}>
                  Register
                </Button>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  )
}