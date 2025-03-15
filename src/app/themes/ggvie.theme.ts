import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { palette } from '@primeng/themes';

export const GGViePreset = definePreset(Aura, {
  semantic: {
    primary: palette('#c80162'),
  },
});
