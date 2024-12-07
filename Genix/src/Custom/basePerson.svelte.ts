import Person from '../types/Person.svelte'

const base:Person = {
    name:'Nome',
    dateOfBirth:Date(),
    age:undefined,
    gender:'male',
    ailments:[],
    deceased:false
  }

export {base};