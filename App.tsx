import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar, FAB, Provider, Button } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';


export default function App() {

  //Näkymän valinta
  const [view, setView] = useState<'home' | 'camera' | 'webview'>("home");

  // QR-koodin luku
  const [url, setUrl] = useState<string>("");

  // Kuvauksen tietoja ja kuvan ottoa
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </View>
    );
  }


  return (
    //Kamera näkymä
    view === "camera"
    ? <SafeAreaProvider>
      <View style={styles.container}>
      <CameraView
        onBarcodeScanned={({data}) => {
          if (data.startsWith('http://') || data.startsWith('https://')) {
            setUrl(data);
            setView("webview")
          } else {
            alert('Virhe! QR-koodi ei sisällä kelvollista verkko-osoitetta.');
          }
        }}
        barcodeScannerSettings={{barcodeTypes: ["qr"]}}
        style={styles.camera}>
        <FAB
          style={styles.nappiSulje}
          icon="close"
          label="Sulje"
          onPress={() => setView("home")}
        />
      </CameraView>
    </View>
    </SafeAreaProvider>

    // Normi näkymä
      : view === "home" ?
      <SafeAreaProvider>
        <Provider>
      <Appbar.Header>
        <Appbar.Content title="Avaa nettisivu QR-koodilla"/>
      </Appbar.Header>
      <View>
        <Text style={styles.text}>Avaa kamera alla olevasta napista ja kohdista se QR-koodiin!</Text>  
        <Button style={styles.button} icon="camera" mode="contained" onPress={() => setView("camera")}>Avaa kamera</Button>  
      </View>
      </Provider>
      </SafeAreaProvider>

      //Nettisivu QR koodista
    :
    <>
        <WebView style={{marginTop: 48}} source={{uri: url}}/>
        <FAB style={{position: "absolute", bottom: 40, right: 20}} label="Palaa Etusivulle" onPress={() => setView('home')} />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  button: {
    marginTop: 20,
    padding: 5,
    alignSelf: "center",
    alignItems: 'center',
    width: "80%"
  },
  text: {
    fontSize: 24,
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center"
  },
  nappiSulje: {
    position: "absolute",
    margin: 20,
    top: 60,
    left: 0
  }
});