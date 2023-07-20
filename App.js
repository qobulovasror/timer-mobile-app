import { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { AntDesign } from "react-native-vector-icons";
import { styles } from "./assets/styles";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [secund, setSecund] = useState(0);
  const [isStart, setIsStart] = useState(false);

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const runTimer = ()=> {
    if(!isStart || (secund==0 && minute==0 && hour==0)) {
      stop()
      return;
    }
    if(secund!=0){
      setSecund(secund-1);
    }else{
      if (minute!=0) {
        setSecund(59)
        setMinute(minute-1)
      }else{
        setSecund(59)
        setMinute(59)
        setHour(hour-1)
      }
    }
  }
  const setValues = (name, sign) => {
    if (name == "h") {
      if (hour + sign > -1) setHour(hour + sign);
    }
    if (name == "m") {
      setMinute(
        minute + sign == -1 ? 59 : minute + sign == 60 ? 0 : minute + sign
      );
    }
    if (name == "s") {
      setSecund(
        secund + sign == -1 ? 59 : secund + sign == 60 ? 0 : secund + sign
      );
    }
  };
  const reset = () => {
    setHour(0);
    setMinute(0);
    setSecund(0);
    stop()
  };
  const start = () => {
    setIsStart(true);
  };
  const stop = async () => {
    setIsStart(false);
    await schedulePushNotification();
  };
  useEffect(() => {
    if(isStart)
      setInterval(() => {
          runTimer()
      }, 1000);

    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {});

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [runTimer]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
    }),
  });
  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.text, { fontSize: 40 }]}>Timer</Text>
      {isStart ? (
        <View style={styles.anim}>
          <Text style={{ fontSize: 35 }}>
            {hour < 10 ? "0" + hour : hour}:
            {minute < 10 ? "0" + minute : minute}:
            {secund < 10 ? "0" + secund : secund}
          </Text>
        </View>
      ) : (
        <View style={styles.row}>
          <View style={[styles.column, { marginEnd: 10 }]}>
            <Text style={[styles.text, { textAlign: "center" }]}>HH</Text>
            <TouchableOpacity
              style={styles.setBtn}
              onPress={() => setValues("h", 1)}
            >
              <AntDesign name="up" size={35} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.text3}>{hour}</Text>
            <TouchableOpacity
              style={styles.setBtn}
              onPress={() => setValues("h", -1)}
            >
              <AntDesign name="down" size={35} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={[styles.column, { marginEnd: 10 }]}>
            <Text style={[styles.text, { textAlign: "center" }]}>MM</Text>
            <TouchableOpacity
              style={styles.setBtn}
              onPress={() => setValues("m", 1)}
            >
              <AntDesign name="up" size={35} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.text3}>{minute}</Text>
            <TouchableOpacity
              style={styles.setBtn}
              onPress={() => setValues("m", -1)}
            >
              <AntDesign name="down" size={35} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={[styles.column, { marginEnd: 10 }]}>
            <Text style={[styles.text, { textAlign: "center" }]}>SS</Text>
            <TouchableOpacity
              style={styles.setBtn}
              onPress={() => setValues("s", 1)}
            >
              <AntDesign name="up" size={35} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.text3}>{secund}</Text>
            <TouchableOpacity
              style={styles.setBtn}
              onPress={() => setValues("s", -1)}
            >
              <AntDesign name="down" size={35} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={[styles.row, { marginTop: 10 }]}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#0f0" }]}
          disabled={hour == 0 && minute == 0 && secund == 0}
          onPress={start}
        >
          <Text style={styles.text2}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#f00" }]}
          disabled={!isStart}
          onPress={stop}
        >
          <Text style={styles.text2}>Stop</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: "#ff0" }]}
          onPress={reset}
        >
          <Text style={styles.text2}>Reset</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Timer: time is up",
      body: "Click here to reset the timer",
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  return token;
}
