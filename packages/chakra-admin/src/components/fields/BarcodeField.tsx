import React, { FC } from 'react'
/**
 * format	"auto" (CODE128)	String
width	2	Number
height	100	Number
displayValue	true	Boolean
text	undefined	String
fontOptions	""	String
font	"monospace"	String
textAlign	"center"	String
textPosition	"bottom"	String
textMargin	2	Number
fontSize	20	Number
background	"#ffffff"	String (CSS color)
lineColor	"#000000"	String (CSS color)
margin	10	Number
marginTop	undefined	Number
marginBottom	undefined	Number
marginLeft	undefined	Number
marginRight	undefined	Number
flat	false	Boolean
valid	function(valid){}	Function
 */
const Barcode = require('react-barcode')

export type BarcodeFieldProps = {
  format?: 'auto' | string
  width?: number
  height?: number
  text?: string
  fontOptions?: string
  font?: string
  textAlign?: string
  textPosition?: string
  textMargin?: number
  fontSize?: number
  background?: string
  lineColor?: string
  margin?: number
  marginTop?: number
  marginBottom?: number
  marginLeft?: number
  marginRight?: number
  flat?: boolean
  value: string
}

export const BarcodeField: FC<BarcodeFieldProps> = (props) => {
  return <Barcode {...props} />
}
