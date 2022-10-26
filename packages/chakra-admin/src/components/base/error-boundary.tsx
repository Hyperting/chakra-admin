import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/react'
import React, { Component } from 'react'

export class ErrorBoundary extends Component<{ children?: React.ReactElement }, { hasError: boolean; error?: any }> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          py={6}
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {this.state.error?.message || 'Something went wrong.'}
          </AlertTitle>
          <AlertDescription>
            {this.state.error?.stack && (
              <pre>
                <code>{this.state.error?.stack}</code>
              </pre>
            )}
          </AlertDescription>
        </Alert>
      )
    }

    return this.props.children
  }
}
