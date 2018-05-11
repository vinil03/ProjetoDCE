import { Component } from '@angular/core';
import { IonicPage, NavController, Loading, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { IntroPage } from '../intro/intro';
import { Device } from '@ionic-native/device';

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
  private hasError = true;
  private errorMsg = "Digite os campos!";
  private deviceInfo: any = {
    uuid: "",
    model: "",
    manufacturer: ""
  };


  constructor(public navCtrl: NavController, public authProvider: AuthProvider,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, private device: Device, private toastCtrl: ToastController) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      name: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      instituicao: ['', Validators.compose([Validators.required])],
      cargo: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
    this.onChanges();
    this.deviceInfo.uuid = this.device.uuid;
    this.deviceInfo.model = this.device.model;
    this.deviceInfo.manufacturer = this.device.manufacturer;
  }

  signupUser() {
    console.log(this.signupForm.value);
    let control = this.signupForm.controls;
    if (!this.signupForm.valid || this.hasError || (control["email"].value.split("@")[1] != "dcefacamp.com" && control["instituicao"].value == "DCE Celso Furtado")) {
      //this.errorMsg = "erro";
      const toast = this.toastCtrl.create({
        message: this.errorMsg,
        duration: 1000,
        showCloseButton: true,
        closeButtonText: 'Ok'
      });

      toast.present();
      //console.log(this.signupForm.value);
    } else {
      console.log("No errors");
      this.authProvider.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name, this.signupForm.value.cargo, this.signupForm.value.instituicao, this.deviceInfo).then(() => {
         this.loading.dismiss().then( () => {
           let alert = this.alertCtrl.create({
             message: "Conta criada com sucesso! \n Entre no seu email para ativar",
             buttons: [
               {
                 text: "Ok",
                 handler: data =>{
                   this.authProvider.sendConfirmationEmail();
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
    }
  }

  private onChanges(): void {
    //console.log("On change");
    this.signupForm.valueChanges.subscribe(val => {
      let control = this.signupForm.controls;
      let emailMsg, nameMsg, passwordMsg, instMsg, cargoMsg;
      if (!control["cargo"].valid) {
        instMsg = "Preecha a instituição!";
        this.hasError = true;
      } else {
        this.hasError = false;
        instMsg = "";
      }
      if (!control["cargo"].valid) {
        cargoMsg = "Preecha o cargo!";
        this.hasError = true;
      } else {
        this.hasError = false;
        cargoMsg = "";
      }
      if (!control["email"].valid) {
        emailMsg = "Email inválido!";
        this.hasError = true;
      } else {
        this.hasError = false;
        emailMsg = "";
      }
      if (control["email"].value.split("@")[1] != "dcefacamp.com" && control["instituicao"].value == "DCE Celso Furtado") {
        emailMsg = "Digite o seu email DCE!";
        this.hasError = true;
      }
      if (!control["password"].valid) {
        passwordMsg = "A senha precisa ter no mínimo 6 caracteres!";
        this.hasError = true;
      } else {
        this.hasError = false;
        passwordMsg = "";
      }
      if (!control["name"].valid) {
        nameMsg = "Digite seu sobrenome!";
        this.hasError = true;
      } else {
        this.hasError = false;
        nameMsg = "";
      }
      this.errorMsg = "";
      if (nameMsg != "") {
        this.errorMsg += nameMsg + "\n";
      }
      if (instMsg != "") {
        this.errorMsg += instMsg + "\n";
      }
      if (cargoMsg != "") {
        this.errorMsg += cargoMsg + "\n";
      }
      if (emailMsg != "") {
        this.errorMsg += emailMsg + "\n";
      }
      if (passwordMsg != "") {
        this.errorMsg += passwordMsg;
      }
      //console.log("Form is valid? ", this.signupForm.valid, "hasErrors?", this.hasError);
    });
  }
}