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

export default {
  effects: {
    ...wah,
    ...comp,
    ...gate,
    ...efx,
    ...amp,
    ...delay,
    ...reverb,
    sr: {
      byte: 23,
      category: "📡 S/R",
      options: [{ id: "S_R", title: "S/R", onByte: "00", offByte: "01" }],
    },
    vol: {
      byte: 25,
      category: "🔊 Volume",
      options: [{ id: "VOL", title: "Volume", onByte: "01", offByte: "41" }],
    },
    ...ir,
    ...eq,
    ...mod,
  },
};
