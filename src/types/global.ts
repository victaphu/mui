export type CallResponse = {
  error?
  response?
}

export type ContractAbi = {
  methods?
  bytecode?
}

export interface KeyableObject {
  [key: string]: unknown
}
