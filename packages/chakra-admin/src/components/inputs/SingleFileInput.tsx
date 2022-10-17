import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { Box, Text, Icon, BoxProps } from '@chakra-ui/react'
import { useDropzone } from 'react-dropzone'
import { useTranslate } from 'ca-i18n'
import { FaUpload } from 'react-icons/fa'
import { FieldValues, useController } from 'react-hook-form'
import { CAInputProps } from '../../core/react/system-form'

type SingleFileInputProps<TItem extends FieldValues = Record<string, any>> = {} & CAInputProps<TItem> & BoxProps

interface FileWithPreview extends File {
  // preview?: string
}

/**
 *
 * WIP: Component that add a single image to the form data.
 *
 * @example
 *
 * <SingleImageInput source="image" />
 */
export function SingleFileInput<TItem extends FieldValues = Record<string, any>>({
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
  ...rest
}: SingleFileInputProps<TItem>) {
  const t = useTranslate({ keyPrefix: 'ca.input.single_image' })

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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        // if ((value as FileWithPreview)?.preview) {
        //   URL.revokeObjectURL((value as FileWithPreview)?.preview!)
        // }

        const newFile = Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        })
        onChange(newFile)
        // setFile(newFile)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  // useEffect(() => {
  //   return () => {
  //     if ((value as FileWithPreview)?.preview) {
  //       URL.revokeObjectURL((value as FileWithPreview)?.preview!)
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <Box
      borderRadius="lg"
      borderWidth="1px"
      borderStyle="dashed"
      borderColor={invalid ? 'red.500' : isDragActive ? 'gray.900' : 'gray.200'}
      bgPos={['center', 'center']}
      bgSize="cover"
      cursor="pointer"
      minW="130px"
      minH="120px"
      px={2}
      pos="relative"
      {...rest}
      {...getRootProps()}
    >
      <input {...getInputProps({ name })} />
      {!value || isDragActive ? (
        <Box
          pos="absolute"
          d="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          top="0"
          right="0"
          bottom="0"
          left="0"
          bgColor="whiteAlpha.200"
        >
          <Icon boxSize="36px" as={FaUpload} color={isDragActive ? 'gray.900' : 'gray.200'} />
          <Text textAlign="center" mx={4} mt={1} fontSize="xs">
            {isDragActive ? t('while_dragging') : t('label')}
          </Text>
        </Box>
      ) : (
        <Box
          pos="absolute"
          d="flex"
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          top="0"
          right="0"
          bottom="0"
          left="0"
          bgColor="whiteAlpha.200"
        >
          File
        </Box>
      )}
    </Box>
  )
}
