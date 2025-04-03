import amp from "../effects/amp";
import comp from "../effects/comp";
import delay from "../effects/delay";
import efx from "../effects/efx";
import eq from "../effects/eq";
import gate from "../effects/gate";
import ir from "../effects/ir";
import mod from "../effects/mod";
import reverb from "../effects/reverb";
import wah from "../effects/wah";
import type { EffectConfig } from "../types";
import sr from "./sr";
import vol from "./vol";

const EFFECT_CONFIG: EffectConfig.EffectType = {
  ...wah,
  ...comp,
  ...gate,
  ...efx,
  ...amp,
  ...delay,
  ...reverb,
  ...sr,
  ...vol,
  ...ir,
  ...eq,
  ...mod,
};

export default EFFECT_CONFIG;
