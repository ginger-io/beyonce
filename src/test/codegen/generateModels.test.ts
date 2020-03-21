import { generateModels } from "../../main/codegen/generateModels"

it("should generate a simple model", () => {
  const result = generateModels(`
Tables:
  Library:
    Partitions:
      Author: ["author", "_.authorId"]

    Models:
      Author:
        partition: Author
        sort: ["author", "_.authorId"]
        id: string
        name: string
`)

  expect(result).toEqual(`import { key, Model } from "@ginger.io/beyonce"

export enum ModelType {
  Author = "Author"
}

export interface Author extends Model {
  model: ModelType.Author
  id: string
  name: string
}

export function author(fields: Omit<Author, "model">): Author {
  return {
    ...fields,
    model: ModelType.Author
  }
}

export const LibraryTable = {
  name: "Library",

  pk: {
    Author: key<{ authorId: string }, Author>("pk", _ => ["author", _.authorId])
  },
  sk: {
    [ModelType.Author]: key<{ authorId: string }, Author>("sk", _ => [
      "author",
      _.authorId
    ])
  }
}
`)
})

it("should generate two models model", () => {
  const result = generateModels(`
Tables:
  Library:
    Partitions:
      Author: ["author", "_.authorId"]

    Models:
      Author:
        partition: Author
        sort: ["author", "_.authorId"]
        id: string
        name: string

      Book:
        partition: Author
        sort: ["book", "_.bookId"]
        id: string
        name: string
`)

  expect(result).toEqual(`import { key, Model } from "@ginger.io/beyonce"

export enum ModelType {
  Author = "Author",
  Book = "Book"
}

export interface Author extends Model {
  model: ModelType.Author
  id: string
  name: string
}

export interface Book extends Model {
  model: ModelType.Book
  id: string
  name: string
}

export function author(fields: Omit<Author, "model">): Author {
  return {
    ...fields,
    model: ModelType.Author
  }
}

export function book(fields: Omit<Book, "model">): Book {
  return {
    ...fields,
    model: ModelType.Book
  }
}

export const LibraryTable = {
  name: "Library",

  pk: {
    Author: key<{ authorId: string }, Author | Book>("pk", _ => [
      "author",
      _.authorId
    ])
  },
  sk: {
    [ModelType.Author]: key<{ authorId: string }, Author>("sk", _ => [
      "author",
      _.authorId
    ]),
    [ModelType.Book]: key<{ bookId: string }, Book>("sk", _ => [
      "book",
      _.bookId
    ])
  }
}
`)
})