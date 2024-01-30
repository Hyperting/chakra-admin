import React, { FC, useCallback } from 'react'
import { Box, Input, InputProps } from '@chakra-ui/react'
import Datetime, { DatetimepickerProps } from 'react-datetime'
import { ca } from 'ca-system'

export type DatetimeInputProps = {
  inputProps?: InputProps
} & Omit<DatetimepickerProps, 'inputProps'>

export const DatetimeInputBase: FC<DatetimeInputProps> = (props) => {
  const renderInput = useCallback((props: any, openCalendar: Function, closeCalendar: Function) => {
    return <Input {...props} />
  }, [])

  return (
    <Box
      __css={{
        /* !
         * https://github.com/arqex/react-datetime
         */

        '.rdt': {
          position: 'relative',
        },
        '.rdtPicker': {
          display: 'none',
          position: 'absolute',
          minWidth: '250px',
          padding: '4px',
          marginTop: '1px',
          zIndex: '99999 !important',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,.1)',
          border: '1px solid #f9f9f9',
        },
        '.rdtOpen .rdtPicker': {
          display: 'block',
        },
        '.rdtStatic .rdtPicker': {
          boxShadow: 'none',
          position: 'static',
        },

        '.rdtPicker .rdtTimeToggle': {
          textAlign: 'center',
        },

        '.rdtPicker table': {
          width: '100%',
          margin: '0',
        },
        '.rdtPicker td, .rdtPicker th': {
          textAlign: 'center',
          height: '28px',
        },
        '.rdtPicker td': {
          cursor: 'pointer',
        },

        '.rdtPicker td.rdtDay:hover, .rdtPicker td.rdtHour:hover, .rdtPicker td.rdtMinute:hover, .rdtPicker td.rdtSecond:hover, .rdtPicker .rdtTimeToggle:hover':
          {
            background: '#eeeeee',
            cursor: 'pointer',
          },

        '.rdtPicker td.rdtOld, .rdtPicker td.rdtNew': {
          color: '#999999',
        },
        '.rdtPicker td.rdtToday': {
          position: 'relative',
          fontWeight: 'bold',
        },
        '.rdtPicker td.rdtToday:before': {
          content: "''",
          display: 'inline-block',
          borderLeft: '7px solid transparent',
          borderBottom: '7px solid #428bca',
          borderTopColor: 'rgba(0, 0, 0, 0.2)',
          position: 'absolute',
          bottom: '4px',
          right: '4px',
        },
        '.rdtPicker td.rdtActive, .rdtPicker td.rdtActive:hover': {
          backgroundColor: '#428bca',
          color: '#fff',
          textShadow: '0 -1px 0 rgba(0, 0, 0, 0.25)',
          fontWeight: 'bold',
        },
        '.rdtPicker td.rdtActive.rdtToday:before': {
          borderBottomColor: '#fff',
        },
        '.rdtPicker td.rdtDisabled, .rdtPicker td.rdtDisabled:hover': {
          background: 'none',
          color: '#999999',
          cursor: 'not-allowed',
        },

        '.rdtPicker td span.rdtOld': {
          color: '#999999',
        },
        '.rdtPicker td span.rdtDisabled, .rdtPicker td span.rdtDisabled:hover': {
          background: 'none',
          color: '#999999',
          cursor: 'not-allowed',
        },
        '.rdtPicker th': {
          borderBottom: '1px solid #f9f9f9',
        },
        '.rdtPicker .dow': {
          width: '14.2857%',
          borderBottom: 'none',
          cursor: 'default',
          textTransform: 'capitalize',
          fontWeight: 400,
          color: '#B7BAC8',
          fontSize: '11px',
        },
        '.rdtPicker th.rdtSwitch': {
          width: '100px',
          fontWeight: 'bold',
          fontSize: 'md',
          lineHeight: 6,
          height: 8,
          color: '#333333',
          textTransform: 'capitalize',
        },
        '.rdtPicker th.rdtNext, .rdtPicker th.rdtPrev': {
          fontSize: '21px',
          verticalAlign: 'top',
          fontWeight: 400,
        },

        '.rdtPrev span, .rdtNext span': {
          display: 'block',
          WebkitTouchCallout: 'none' /* iOS Safari */,
          WebkitUserSelect: 'none' /* Chrome/Safari/Opera */,
          KhtmlUserSelect: 'none' /* Konqueror */,
          MozUserSelect: 'none' /* Firefox */,
          msUserSelect: 'none' /* Internet Explorer/Edge */,
          userSelect: 'none',
        },

        '.rdtPicker th.rdtDisabled, .rdtPicker th.rdtDisabled:hover': {
          background: 'none',
          color: '#999999',
          cursor: 'not-allowed',
        },
        '.rdtPicker thead tr:first-of-type th': {
          cursor: 'pointer',
        },
        '.rdtPicker thead tr:first-of-type th:hover': {
          background: '#eeeeee',
        },

        '.rdtPicker tfoot': {
          borderTop: '1px solid #f9f9f9',
        },

        '.rdtPicker button': {
          border: 'none',
          background: 'none',
          cursor: 'pointer',
        },
        '.rdtPicker button:hover': {
          backgroundColor: '#eee',
        },

        '.rdtPicker thead button': {
          width: '100%',
          height: '100%',
        },

        'td.rdtMonth, td.rdtYear': {
          height: '50px',
          width: '25%',
          cursor: 'pointer',
        },
        'td.rdtMonth:hover, td.rdtYear:hover': {
          background: '#eee',
        },

        '.rdtCounters': {
          display: 'inline-block',
        },

        '.rdtCounters > div': {
          float: 'left',
        },

        '.rdtCounter': {
          height: '100px',
          width: '40px',
        },

        '.rdtCounterSeparator': {
          lineHeight: '100px',
        },

        '.rdtCounter .rdtBtn': {
          height: '40%',
          lineHeight: '40px',
          cursor: 'pointer',
          display: 'block',

          WebkitTouchCallout: 'none' /* iOS Safari */,
          WebkitUserSelect: 'none' /* Chrome/Safari/Opera */,
          KhtmlUserSelect: 'none' /* Konqueror */,
          MozUserSelect: 'none' /* Firefox */,
          msUserSelect: 'none' /* Internet Explorer/Edge */,
          userSelect: 'none',
        },
        '.rdtCounter .rdtBtn:hover': {
          background: '#eee',
        },
        '.rdtCounter .rdtCount': {
          height: '20%',
          fontSize: '1.2em',
        },

        '.rdtMilli': {
          verticalAlign: 'middle',
          paddingLeft: '8px',
          width: '48px',
        },

        '.rdtMilli input': {
          width: '100%',
          fontSize: '1.2em',
          marginTop: '37px',
        },

        '.rdtTime td': {
          cursor: 'default',
        },

        '.chakra-input.form-control.css-p2yc5s': {
          textAlign: 'center',
        },
      }}
    >
      <Datetime renderInput={renderInput} {...(props as any)} />
    </Box>
  )
}

export const DatetimeInput = ca.fi(DatetimeInputBase, { type: 'control' })
