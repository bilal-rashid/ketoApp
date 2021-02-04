import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import * as SQLite from 'expo-sqlite';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        SQLite.openDatabase("keto_db.db","1.0",undefined,undefined,(db)=>{
          db.transaction(tx => {
            tx.executeSql(
                "create table if not exists meals (id integer primary key autoincrement, protein real,fat real,carb real, name text, group_name text);"
                ,null,(error)=>{},);
          },(error)=>{});
          db.transaction(tx => {
            tx.executeSql(
                "create table if not exists dailylogs (id integer primary key autoincrement, date text);"
            );
          });
          db.transaction(tx => {
            tx.executeSql(
                "create table if not exists mealquantity (id integer primary key autoincrement, log_id integer," +
                "meal_type integer,meal_name text,protein real,fat real, carb real,protein_percent real," +
                "fat_percent real,carb_percent real ,quantity real, meal_id integer);"
            );
          });
          db.transaction(tx => {
            tx.executeSql(
                "create table if not exists recipe (id integer primary key autoincrement, protein real,fat real,carb real,quantity real, name text, description text);"
                ,null,(error)=>{},);
          },(error)=>{});
        });
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
