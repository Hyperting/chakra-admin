export const expectToThrow = (func) => {
  // Even though the error is caught, it still gets printed to the console
  // so we mock that out to avoid the wall of red text.
  jest.spyOn(console, 'error')
  const oldConsoleError = console.error
  console.error = jest.fn().mockImplementation(() => {})

  expect(func).toThrow()

  console.error = oldConsoleError
}
