import { Component } from '@angular/core';
import { IonicPage,
  NavController,
  Loading,
  LoadingController,
  AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { IntroPage } from '../intro/intro';

@IonicPage({
  name: 'signup'
})
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm: FormGroup;
  public loading: Loading;
  private deviceInfo: {
    uuid: "",
    model: "",
    manufacturer: "",
  };
  constructor(public navCtrl: NavController, public authProvider: AuthProvider, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
      this.signupForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['',Validators.compose([Validators.minLength(6), Validators.required])],
        name: ['',Validators.compose([Validators.minLength(6), Validators.required])],
        instituicao: ['',Validators.compose([Validators.minLength(6), Validators.required])],
        cargo: ['',Validators.compose([Validators.minLength(6), Validators.required])]
      });
    }

    signupUser(){
      if (!this.signupForm.valid){
        console.log(this.signupForm.value);
      } else {
        this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name, this.signupForm.value.role, this.signupForm.value.instituicao, this.deviceInfo).then(() => {
          this.loading.dismiss().then( () => {
            this.navCtrl.setRoot(IntroPage);
          });
        }, (error) => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'Cancelar'
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
  }