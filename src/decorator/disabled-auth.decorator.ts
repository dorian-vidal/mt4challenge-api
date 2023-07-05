import GeneralEnum from '../enum/general.enum';
import { SetMetadata } from '@nestjs/common';

export const DisabledAuth = () => SetMetadata(GeneralEnum.DISABLED_AUTH, true);
