import GeneralEnum from '../enum/general.enum';
import { SetMetadata } from '@nestjs/common';

export const DisabledChallengeStatusCheck = () =>
  SetMetadata(GeneralEnum.DISABLED_CHALLENGE_STATUS_CHECK, true);
