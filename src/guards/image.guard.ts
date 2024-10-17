import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ async: false, name: 'img' })
export class IsImageFile implements ValidatorConstraintInterface {
  validate(mimeType: string, args: ValidationArguments) {

    const acceptMimeTypes = ['image/png', 'image/jpeg'];

    const fileType = acceptMimeTypes.find((type) => type === mimeType);

    if (!fileType) return false;

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'The file type was not accepted.';
  }
}