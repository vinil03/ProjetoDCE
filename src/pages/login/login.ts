import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { IntroPage } from '../intro/intro';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { ResetPasswordPage } from '../../pages/reset-password/reset-password';
import { SignupPage } from '../../pages/signup/signup';
//import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: FormGroup;
  public loading: Loading;
  private toast = this.toastCtrl.create({
    message: "Funcionalidade não disponível nessa versão",
    showCloseButton: true,
    closeButtonText: 'Ok'
  });

  constructor(public navCtrl: NavController, public navParams: NavParams, public authProvider: AuthProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public formBuilder: FormBuilder, private toastCtrl: ToastController) {//, public afAuth: AngularFireAuth) {

    this.loginForm = formBuilder.group({
      email: ['',
        Validators.compose([Validators.minLength(6), Validators.required, EmailValidator.isValid])],
      password: ['',
        Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  verifyUser() {
    if (!this.loginForm.valid) {
      console.log(this.loginForm.value);
    } else {
      this.authProvider.loginUser(this.loginForm.value.email,
        this.loginForm.value.password)
        .then(authData => {
          this.loading.dismiss().then(() => {
            this.navCtrl.setRoot(IntroPage);
          });
        }, error => { // algumas mensagens de erro podem não estar sendo mostradas
          this.loading.dismiss().then(() => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
            alert.present();
          });
        });
      this.loading = this.loadingCtrl.create();
      this.loading.present();
    }

  }

  createLogin() {
    this.navCtrl.push(SignupPage);
  }

  verifyUser_FB() { //substistuir por verificar login
    console.log("Deu certo Login por Facebook!!!");
    this.toast.present();
  }

  verifyUser_G() {
    console.log("Deu certo Login por Google!!!");
    this.toast.present();

    /*this.signInWithGoogle()
      .then(
        () => this.navCtrl.setRoot(IntroPage),
        error => console.log(error.message)
      );
      */

  }

  resetPassword() {
    this.navCtrl.push(ResetPasswordPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  private signInWithGoogle() {
    console.log('Sign in with google');


    //return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
  }
  /*
  
    private oauthSignIn(provider: GoogleAuthProvider) {
      if (!(<any>window).cordova) {
        return this.afAuth.auth.signInWithPopup(provider);
      } else {
        return this.afAuth.auth.signInWithRedirect(provider)
          .then(() => {
            return this.afAuth.auth.getRedirectResult().then(result => {
              // This gives you a Google Access Token.
              // You can use it to access the Google API.
              let token = result.credential.accessToken;
              // The signed-in user info.
              let user = result.user;
              console.log(token, user);
            }).catch(function (error) {
              // Handle Errors here.
              alert(error.message);
            });
          });
      }
    }*/

}
