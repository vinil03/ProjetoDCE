import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class AuthProvider {

  constructor() {
    console.log('Hello AuthProvider Provider');
  }


  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string, nome: string, cargo: string, instituicao: string, deviceInfo: { uuid: string, model: string, manufacturer: string }): Promise<any> { //fazer uma verificação de senha fraca? Usar regex?
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        let newUser = firebase.database().ref('/userProfile').push();
        newUser.set
          ({
            name: nome,
            institution: instituicao,
            role: cargo,
            email: email,
            admin: false, //por padrão é uma conta comum
            verified: false, //por padrão, não tem autorização do admin para acessar
            key: newUser.key,
            deviceInfo: deviceInfo
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
}
