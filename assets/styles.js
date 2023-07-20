import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  row: {
    display: "flex",
    flexDirection: "row",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  text: {
    fontSize: 30,
    marginTop: 40,
  },
  setBtn: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#00f",
  },
  input: {
    padding: 10,
    fontSize: 28,
    borderWidth: 1,
    borderColor: "#000",
    textAlign: "center",
  },
  btn: {
    borderRadius: 5,
    padding: 10,
    margin: 5,
  },
  text2: {
    fontSize: 25,
  },
  text3: {
    fontSize: 35,
    textAlign: "center",
    borderColor: "#000",
    borderWidth: 1,
    padding: 5,
  },
  anim: {
    borderColor: "#000",
    borderWidth: 2,
    borderRadius: 200,
    padding: 50,
    paddingHorizontal: 50,
    paddingVertical: 90,
    marginVertical: 20,
  },
});
