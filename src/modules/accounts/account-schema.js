import {string, required, isEmail, Schema, isEqualToField } from '../../sapin'

const baseAccountSchema = {
  id: string,
  username: string([required, isEmail]),
  name: string(required),
  password: string(required)
}

export const accountSchema = new Schema(baseAccountSchema)

export const newAccountSchema = new Schema({
  ...baseAccountSchema,
  password: string(required),
  confirm: string([required, isEqualToField('password', 'Mot de passe')])
})
