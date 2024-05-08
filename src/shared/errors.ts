export class UserAlreadyExists extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class UserNotFound extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class AddressNotFound extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class WrongSuperpassError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class NotFoundException extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class ParametersParsingError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}

export class LinkExpiredError extends Error {
  constructor(msg: string) {
    super(msg);
  }
}
