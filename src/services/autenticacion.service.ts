import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Persona} from '../models';
import {PersonaRepository} from '../repositories';
import { Llaves } from '../config/llaves';
const generador = require("password-generator");
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(PersonaRepository)
    public PersonaRepository: PersonaRepository
    ) {}

GenerarClave(){
  let clave = generador(8, false);
  return clave;
}

CifrarClave (clave: string){
  let clavecifrada =  cryptoJS.MD5(clave).toString();
  return clavecifrada;
}

IdentificarPersona(usuario: string, clave: string){
  try{
    let p = this.PersonaRepository.findOne({where:{correo: usuario, clave: clave}});
    if(p){
      return p;
    }
    return false;
  }catch{
    return false;
  }
}

GenerarTokenJWT(persona: Persona){
  let token = jwt.sign({
    data:{
      id: persona.id,
      correo: persona.correo,
      nombre: persona.nombres + " " + persona.apellidos
    }
  },
     Llaves.claveJWT);
     return token;
}

ValidarTokenJWT(token: string){
  try{
    let datos = jwt.verify(token, Llaves.claveJWT);
    return datos;
  }catch{
    return false;
  }
}

}
