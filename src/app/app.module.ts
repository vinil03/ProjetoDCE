import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { CameraPage } from '../pages/camera/camera';
import { LoginPage } from '../pages/login/login';
import { HistoricoPage } from '../pages/historico/historico';
import { HttpModule } from '@angular/http';
import { CheckerApi } from '../shared/checker-api';
import { IntroPage } from '../pages/intro/intro';
import { Device } from '@ionic-native/device';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    CameraPage,
    LoginPage,
    HistoricoPage,
    IntroPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    CameraPage,
    LoginPage,
    HistoricoPage,
    IntroPage
  ],
  providers: [
    StatusBar,
    BarcodeScanner,
    CheckerApi,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
