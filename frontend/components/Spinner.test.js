import Spinner from "./Spinner"
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from "react"

//$ Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
test('spinner displays correctly', () => {
  let on = true
  render(<Spinner on={on} />)
  expect(screen.queryByText('Please wait...')).toBeInTheDocument()
})
test('spinner displays incorrectly', () => {
  let on = true
  render(<Spinner on={!on} />)
  expect(screen.queryByText('Please wait...')).not.toBeInTheDocument()
})