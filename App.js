import React,{useState,useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  PermissionsAndroid,
  ScrollView,
  Button,
  TouchableOpacity
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import useInterval from 'use-interval';

function App(){

  var [totalLocation,setTotalLocation] = useState([]);
  var [lati,setLati] = useState();
  var [longi,setLongi] = useState();
var [currentLocation,setCurrentLocation] = useState();
var [stateLocation,setStateLocation] = useState();

useEffect(async ()=>{
    
  await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
        title:"get the user location",
        buttonPositive:'OK',
        buttonNegative:'CANCEL',
    }
    );

  Geolocation.getCurrentPosition(
    async (position) => {

      fetch('https://api.opencagedata.com/geocode/v1/json?q='+position.coords.latitude+'+'+position.coords.longitude+'&key=f2974643d519439ba02d13e99c4d4124')
      .then(response => response.json())
        .then(data => {
          setCurrentLocation(data.results[0].formatted);
          
          if(totalLocation<30){
          if(totalLocation.indexOf(data.results[0].formatted) == -1){
            totalLocation.push(data.results[0].formatted);
            console.log(data.results[0].formatted);
          }
          }
        
      });
    },
    (error) => {
        alert("permission is not granted");
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 15000 }
);

const postData = { location_name: currentLocation,time:Date.now()};

//it is not returning json data thats why it gives error but posting is happen
fetch('https://httpstat.us/200', {
  method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
    })
  .then(response => response.json())
    .then(data => {
     console.log(data);
  }).catch((error)=>{
});
},[]); //it is 5 seconds if you want to 5 minutes  (1000*60*5) 

  useInterval(async ()=>{
    console.log("It is working");
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
          title:"get the user location",
          buttonPositive:'OK',
          buttonNegative:'CANCEL',
      }
      );

    Geolocation.getCurrentPosition(
      async (position) => {

        fetch('https://api.opencagedata.com/geocode/v1/json?q='+position.coords.latitude+'+'+position.coords.longitude+'&key=f2974643d519439ba02d13e99c4d4124')
        .then(response => response.json())
          .then(data => {
            console.log(data);
            setCurrentLocation(data.results[0].formatted);
            
            if(totalLocation.length<30){
              totalLocation.push(data.results[0].formatted);
              console.log(totalLocation);
              setStateLocation(totalLocation);
              
            }
          
        });
      },
      (error) => {
          alert("permission is not granted");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 15000 }
  );
  setStateLocation(Math.random());
},4000); //it is 5 seconds if you want to 5 minutes  (1000*60*5) 

  return (
    <SafeAreaView style={{flex:1}}>

<View style={{alignItems:'center',justifyContent:'center'}}>
  <Text>Current Location</Text>
  <Text style={{margin:10,fontSize:20}}>{currentLocation}</Text>
</View>

      <ScrollView>
      <Text>Pervious Location(Click To Delete)</Text>
      {totalLocation.map((val,index)=><View style={{alignItems:'center',justifyContent:'center'}}>
        <TouchableOpacity onPress={()=>{ totalLocation.splice(index, 1) }}>
          <Text style={{margin:10,fontSize:20}}>{currentLocation}</Text>
        </TouchableOpacity>
      </View>)}
    
      </ScrollView>

<View>
  <Button title='Clear All' onPress={()=>{ setTotalLocation([]); }} />
</View>

    </SafeAreaView>
  );
};

export default App;
