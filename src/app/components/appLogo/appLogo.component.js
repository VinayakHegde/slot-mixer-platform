import Register from './../../services/registery.service';
import logo from '../../../img/logo.png';

class AppLogoController{
    constructor(){
        this.logo = logo;
    }
} 

const appLogo = {
    bindings : {},
    controllerAs: '$ctrl',
    template : require('./appLogo.component.html'),   
    controller: AppLogoController
}

Register.component('appLogo', appLogo);