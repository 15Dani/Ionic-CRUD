import { ContactService } from './../shared/contact.service';
import { Component, OnInit } from '@angular/core';
import { Contact } from '../shared/contact';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
})
export class ContactListPage implements OnInit {
  contacts: Contact[] = [];

  constructor(
     private contactService: ContactService,
     private toastCtrl: ToastController,
     private alertCtrl: AlertController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.loadContacts();
  }

  async loadContacts(){
    this.contacts = await this.contactService.getAll();
  }

  // limpar a tela
  doSerchClear(){
    this.loadContacts();

  }

  // Filtro
  async doSerchBarChange($event: any){

    const value = $event.target.value;
    if (value && value.length >= 2){
      this.contacts = await this.contactService.filter(value);
    }
  }

  async delete(contact: Contact){
    const alert = await this.alertCtrl.create({
      header: 'Deletar?',
      message: 'Deseja excluir o contato: ${contact.name}?',
      buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Excluir',
        handler: () => {
          this.executeDelete(contact);
        }
      }
      ]
    });
  }
  // Removendo do banco de dados
  async executeDelete(contact: Contact){
     try {
       await this.contactService.delete(contact.id);

       // Removendo do array
       const index = this.contacts.indexOf(contact);
       this.contacts.splice(index, 1);

       const toast = await this.toastCtrl.create({
        header: 'Sucesso',
        message: 'Contato excluido com sucesso',
        color: 'sucesss',
        position: 'bottom',
        duration: 3000
     });
        // tslint:disable-next-line: align
        toast.present();
      } catch (error){

      }
  }
}

