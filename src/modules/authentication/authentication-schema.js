import {string, isEmail, required, boolean, Schema } from '../../sapin'

export const loginSchema = new Schema({
  username: string([required, isEmail]),
  password: string(required),
  keepLoggedIn: boolean
})