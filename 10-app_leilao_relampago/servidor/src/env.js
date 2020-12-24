/* eslint-disable no-console */
// @flow

// Heroku define a porta na variável process.env.PORT

export const PORTA: number = parseInt(process.env.PORT || 3000, 10)
export const LOCAL: boolean = process.env.LOCAL === 'sim'