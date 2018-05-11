import { Component } from '@angular/core';
import { Platform, Tabs } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { IntroPage } from '../pages/intro/intro';
import { LoginPage } from '../pages/login/login';
import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  private config = {
    authDomain: "dcechecker.firebaseapp.com",
    databaseURL: "https://dcechecker.firebaseio.com",
    projectId: "dcechecker",
    storageBucket: "dcechecker.appspot.com",
    messagingSenderId: "1021352355630"
  };

  constructor(platform: Platform, statusBar: StatusBar) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.overlaysWebView(true);
      statusBar.styleDefault();
    });

    firebase.initializeApp(this.config);

    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.rootPage = LoginPage;
        unsubscribe();
      } else {
        this.rootPage = IntroPage;
        unsubscribe();
      }
    });
  }
}
