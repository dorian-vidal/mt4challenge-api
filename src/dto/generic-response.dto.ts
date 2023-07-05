import GeneralEnum from "../enum/general.enum";

export class GenericResponseDto {
  public data: string;

  constructor(data: string) {
    this.data = data;
  }

  public static ok() {
    return new GenericResponseDto(GeneralEnum.OK);
  }
}
