import {parseInvoiceFileContent} from '../invoice-parser'

describe('parseInvoiceFileContent', () => {
  it('returns valid invoices when given a valid file', () => {
    const testFileLines =[
      'fachdr	DateFact	NoFacture	NoTable	SousTotal	STPromo	Total	Pourboire	HeureFact	Clients	ServiPar	Taxes	Paiement',
      'dtlhdr	DateFact	NoFacture	Catg	HeureCmd	Quantite	Item	Montant',
      'fac	2020-02-16	259192-1	13	22.95		26.39		12:04:53	1	Astrid	3.44	26.39',
      'dtl	2020-02-16	259192-1	dtl	10:51:16	1.00	BRUNCH COMPLET	22.95',
      'dtl	2020-02-16	259192-1	dtl	11:33:38	13.00	XTRA Brunch	0.00',
      'dtl	2020-02-16	259192-1	dtl	11:33:38	6.00	Saucisse dej	0.00',
      'dtl	2020-02-16	259192-1	dtl	11:33:38	1.00	feves dej	0.00',
      'dtl	2020-02-16	259192-1	dtl	11:33:38	3.00	petakes dej	0.00',
      'dtl	2020-02-16	259192-1	dtl	11:33:38	3.00	crepe dej	0.00',
      'dtl	2020-02-16	259192-1	tax			T.V.Q.	2.29',
      'dtl	2020-02-16	259192-1	tax			T.P.S.	1.15',
      'dtl	2020-02-16	259192-1	med			ARGENT	26.39',
      'fac	2020-02-16	259193-1	13	23	25	26.39	4.11	12:04:53	1	La chose	3.44	30.50',
      'dtl	2020-02-16	259193-1	dtl	10:51:16	1.00	BRUNCH COMPLET	22.95',
      'dtl	2020-02-16	259193-1	tax			T.V.Q.	2.29',
      'dtl	2020-02-16	259193-1	tax			T.P.S.	1.15',
      'dtl	2020-02-16	259193-1	med			PAIEMENT DIRECT	30.50'
    ]
    const testFileContent = testFileLines.join('\n')
    const invoices = parseInvoiceFileContent(testFileContent);
    expect(invoices.length).toEqual(2)

    expect(invoices[0].id).toEqual('259192-1')
    expect(invoices[0].subTotal).toEqual(parseFloat('22.95'))
    expect(invoices[0].total).toEqual(parseFloat('26.39'))
    expect(invoices[0].time).toEqual('12:04')
    expect(invoices[0].server).toEqual('Astrid')
    expect(invoices[0].paymentMethod).toEqual('ARGENT')
    expect(invoices[0].date).toEqual(new Date('2020-02-16T00:00:00.000Z'))
    expect(invoices[0].items.length).toEqual(6)
    let items = invoices[0].items
    expect(items[0].qty).toEqual(1.0)
    expect(items[0].item).toEqual('BRUNCH COMPLET')

    expect(invoices[1].id).toEqual('259193-1')
    expect(invoices[1].subTotal).toEqual(parseFloat('23'))
    expect(invoices[1].subTotalPromo).toEqual(parseFloat('25'))
    expect(invoices[1].total).toEqual(parseFloat('26.39'))
    expect(invoices[1].time).toEqual('12:04')
    expect(invoices[1].server).toEqual('La chose')
    expect(invoices[1].paymentMethod).toEqual('PAIEMENT DIRECT')
    expect(invoices[1].date).toEqual(new Date('2020-02-16T00:00:00.000Z'))
    expect(invoices[1].items.length).toEqual(1)

  })

})