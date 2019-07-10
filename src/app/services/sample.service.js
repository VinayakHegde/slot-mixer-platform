import Register from './registery.service';

class SimpleService{
    getMessage(){
        return 'Hello AngularJS + ES6';
    }
}

Register.service('simpleService', SimpleService);