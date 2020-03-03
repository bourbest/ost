import {date, number, string, required, Schema } from '../../sapin'

export const invoiceClaimSchema = new Schema({
  id: string,
  invoiceId: number(required),
  invoiceDate: date(required),
  invoiceTime: string(required)
})

export const useScrollSchema = new Schema({
  id: string(required)
})

export const usePerkSchema = new Schema({
  characterPerkId: string(required),
  staffCode: string(required)
})