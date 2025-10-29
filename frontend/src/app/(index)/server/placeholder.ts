"use server"

import {
  adjectives,
  animals,
  colors,
  names,
  uniqueNamesGenerator,
} from "unique-names-generator"

export const getRandomUsername = async () => {
  const randomNumber = Math.floor(Math.random() * 100)
  const randomUsername = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, names, colors],
    style: "capital",
    separator: "",
    length: 2,
  })
  return `${randomUsername}${randomNumber}`
}
