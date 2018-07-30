import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { resolveDefinition } from '../../../node_modules/@angular/core/src/view/util';

@Injectable()
export class AuthProvider {

  constructor() {
    //console.log('AuthProvider Loaded');
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string, nome: string, cargo: string, instituicao: string, deviceInfo: any): Promise<any> { //fazer uma verificação de senha fraca? Usar regex?
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        var auth = false;
        if(instituicao == "DCE Celso Furtado" && email.split("@")[1]=="dcefacamp.com"){
          auth = true;
        }
        firebase.database().ref('/userProfile/' + firebase.auth().currentUser.uid).set({
          "name": nome,
          "institution": instituicao,
          "role": cargo,
          "email": email,
          "admin": false, //por padrão é uma conta comum
          "verified": false, //por padrão, não tem autorização do admin para acessar
          "searchAuth": auth, //se consegue realizar buscas além da instituição que pertence
          "verifiedBy": "",
          "deviceInfo": deviceInfo
        });
      });
  }

  resetPassword(email: string): Promise<void> {
    console.log("Password reset sent!");
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  sendConfirmationEmail(){
    firebase.auth().currentUser.sendEmailVerification().then(()=> {
      console.log("email sent");
      return;
     }, error => {
      console.log("email not sent", error);
     });
  }
}
