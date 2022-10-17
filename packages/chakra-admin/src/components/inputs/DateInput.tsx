/* eslint-disable react/require-default-props */
import React, { ChangeEvent, useContext, useEffect, useRef, useState } from 'react'
import {
  Box,
  BoxProps,
  Grid,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  useMultiStyleConfig,
  useOutsideClick,
  Text,
  InputGroup,
  InputRightElement,
  Icon,
} from '@chakra-ui/react'
import {
  CalendarDate,
  Calendar,
  CalendarControls,
  CalendarPrevButton,
  CalendarNextButton,
  CalendarMonths,
  CalendarMonth,
  CalendarMonthName,
  CalendarDays,
  CalendarValues,
  CalendarMonthStyles,
  CalendarContext,
} from '@uselessdev/datepicker'
import { format, isValid, startOfWeek, addDays, Locale } from 'date-fns'
import { FieldValues, useController } from 'react-hook-form'
import { BsCalendar2EventFill } from 'react-icons/bs'
import { CAInputProps } from '../../core/react/system-form'

function weekdays(weekdayFormat: string, locale?: Locale) {
  const start = startOfWeek(new Date(), { locale })
  return [0, 1, 2, 3, 4, 5, 6].map((i) => format(addDays(start, i), weekdayFormat, { locale }))
}

export function CalendarWeek() {
  const styles = useMultiStyleConfig('CalendarMonth', {}) as CalendarMonthStyles
  const { locale, weekdayFormat } = useContext(CalendarContext)
  const week = weekdays(weekdayFormat ?? 'E', locale)

  return (
    <Grid sx={styles.week}>
      {week.map((weekday) => (
        <Text key={weekday} sx={styles.weekday}>
          {weekday}
        </Text>
      ))}
    </Grid>
  )
}

type DateInputProps<TItem extends FieldValues> = {
  locale?: Locale
  placeholder?: string
} & CAInputProps<TItem> &
  BoxProps

export function DateInput<TItem extends FieldValues = Record<string, any>>({
  source,
  label,
  resource,
  required,
  min,
  max,
  maxLength,
  minLength,
  pattern,
  validate,
  valueAsNumber,
  valueAsDate,
  value: propValue,
  setValueAs,
  shouldUnregister,
  onChange: propOnChange,
  onBlur: propOnBlur,
  disabled,
  deps,
  locale,
  placeholder,
  ...rest
}: DateInputProps<TItem>) {
  const {
    field: { onChange, onBlur, name, value, ref },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name: source as any,
    control: (rest as any).control,
    rules: { required, min, max, maxLength, minLength, pattern, validate },
    shouldUnregister,
  })

  const [textValue, setTextValue] = useState('')

  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = useRef(null)
  const calendarRef = useRef(null)

  const handleSelectDate = (date: CalendarDate | CalendarValues) => {
    onChange(date as CalendarDate)
    setTextValue(() => (isValid(date) ? format(date as CalendarDate, 'dd/MM/yyyy') : ''))
    onClose()
  }

  const match = (value: string) => value.match(/(\d{2})\/(\d{2})\/(\d{4})/)

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    setTextValue(target.value)

    if (match(target.value)) {
      onClose()
    }
  }

  useOutsideClick({
    ref: calendarRef,
    handler: onClose,
    enabled: isOpen,
  })

  useEffect(() => {
    if (match(textValue)) {
      const [day, month, year] = textValue.split('/')
      const date = new Date(`${year}-${month}-${day}`)

      onChange(date)
    }
  }, [onChange, textValue])

  useEffect(() => {
    if (value) {
      const newDate = new Date(value as string)
      if (newDate) {
        setTextValue(format(newDate, 'dd/MM/yyyy'))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <Popover placement="bottom" isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef} isLazy>
      <PopoverTrigger>
        <Box onClick={onOpen} ref={initialRef} flex="1" {...rest}>
          <InputGroup>
            <Input ref={ref} placeholder={placeholder} value={textValue} onChange={handleInputChange} />
            <InputRightElement children={<Icon color="gray.300" as={BsCalendar2EventFill} />} />
          </InputGroup>
        </Box>
      </PopoverTrigger>

      <PopoverContent
        p={0}
        w="min-content"
        border="none"
        outline="none"
        _focus={{ boxShadow: 'none' }}
        ref={calendarRef}
      >
        <Calendar
          value={{ start: value as CalendarDate }}
          onSelectDate={handleSelectDate}
          singleDateSelection
          locale={locale}
        >
          <PopoverBody p={0}>
            <CalendarControls>
              <CalendarPrevButton />
              <CalendarNextButton />
            </CalendarControls>

            <CalendarMonths>
              <CalendarMonth>
                <CalendarMonthName />
                <CalendarWeek />
                <CalendarDays />
              </CalendarMonth>
            </CalendarMonths>
          </PopoverBody>
        </Calendar>
      </PopoverContent>
    </Popover>
  )
}
