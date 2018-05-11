import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShowListPage } from './show-list';

@NgModule({
  declarations: [
    ShowListPage,
  ],
  imports: [
    IonicPageModule.forChild(ShowListPage),
  ],
})
export class ShowListPageModule {}
