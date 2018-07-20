import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController } from 'ionic-angular';
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
  private  messageEmail: string;
  private  messagePassword: string;
  private  messageName: string;
  //private deviceInfo: {uuid: "", model: "", manufacturer: ""};
  private deviceInfo: "temp";

  constructor(public navCtrl: NavController, public authProvider: AuthProvider, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
      this.signupForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['',Validators.compose([Validators.minLength(5), Validators.required])],
        name: ['',Validators.compose([Validators.minLength(6), Validators.required])],
        instituicao: ['',Validators.compose([Validators.required])],
        cargo: ['',Validators.compose([Validators.minLength(6), Validators.required])]
      });
      this.messageEmail = "";
      this.messagePassword = "";
      this.messageName = "";
      //this.deviceInfo= {string:"s","s","s"};
      //this.deviceInfo.uuid = "testeuuid";
      //console.log("UID: ", this.deviceInfo.uuid)
    }

    signupUser(){
      if (!this.signupForm.valid){
        let { emailV, passwordV, nameV } = this.signupForm.controls;
        if (!emailV.valid) {  
          //this.errorEmail = true;
          this.messageEmail = "Email inválido";
        } else {
          this.messageEmail = "";
        }
  
        if (!passwordV.valid) {
          //this.errorPassword = true;
          this.messagePassword ="A senha precisa ter no mínimo 6 caracteres"
        } else {
          this.messagePassword = "";
        }

        if (!nameV.valid) {
          //this.errorPassword = true;
          this.messageName ="Digite seu sobrenome"
        } else {
          this.messageName = "";
        }


        console.log(this.signupForm.value);
      } else {
        this.deviceInfo = "temp"; //ARRUMAR
        this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name, this.signupForm.value.cargo, this.signupForm.value.instituicao, this.deviceInfo).then(() => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: "Conta criada com sucesso!",
              buttons: [
                {
                  text: "Ok",
                  handler: data =>{
                    this.navCtrl.setRoot(IntroPage);
                  }
                }
              ]
              
            });
            alert.present();            
          });
        }, (error) => {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: error.message,
              buttons: [
                {
                  text: "Ok",
                  role: 'Cancel'
                }
              ]
            });
            alert.present();
          });
        });
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        console.log("Form",this.signupForm.value);
        console.log();
      
      }
    }

    sendNotification(){
      
    }
  }