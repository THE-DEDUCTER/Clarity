import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useRef } from "react";
import * as riveCanvas from "@rive-app/react-canvas";
import * as riveWebGL from "@rive-app/react-webgl2";
import { addPropertyControls, ControlType, RenderTarget } from "framer";
var isRiveRenderer = false;
var rivePackage = () => {
  if (isRiveRenderer) {
    return riveWebGL;
  } else {
    return riveCanvas;
  }
}; // Mapping for fit options to Fit enum
const getFitValue = (fit) => {
  const Fit = rivePackage().default.Fit;
  switch (fit) {
    case "layout":
      return Fit.Layout;
    case "contain":
      return Fit.Contain;
    case "cover":
      return Fit.Cover;
    case "fill":
      return Fit.Fill;
    case "fitWidth":
      return Fit.FitWidth;
    case "fitHeight":
      return Fit.FitHeight;
    case "none":
      return Fit.None;
    case "scaleDown":
      return Fit.ScaleDown;
    default:
      return Fit.Contain;
  }
}; // Mapping for alignment options to Alignment enum
const getAlignmentValue = (alignment) => {
  const Alignment = rivePackage().default.Alignment;
  switch (alignment) {
    case "center":
      return Alignment.Center;
    case "topLeft":
      return Alignment.TopLeft;
    case "topCenter":
      return Alignment.TopCenter;
    case "topRight":
      return Alignment.TopRight;
    case "centerLeft":
      return Alignment.CenterLeft;
    case "centerRight":
      return Alignment.CenterRight;
    case "bottomLeft":
      return Alignment.BottomLeft;
    case "bottomCenter":
      return Alignment.BottomCenter;
    case "bottomRight":
      return Alignment.BottomRight;
    default:
      return Alignment.Center;
  }
};
function useRiveInputs(rive, stateMachines, inputsJSON) {
  const inputConfigs = useMemo(() => {
    try {
      return JSON.parse(inputsJSON || "[]");
    } catch (error) {
      console.error("Error parsing inputsJSON:", error);
      return [];
    }
  }, [inputsJSON]);
  return inputConfigs.map((config) => {
    const { useStateMachineInput } = rivePackage();
    const handler = useStateMachineInput(
      rive,
      stateMachines,
      config.name,
      config.type === "Trigger" ? true : config.value
    );
    return { ...config, handler };
  });
}
/**
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 * @framerDisableUnlink
 */ export default function RivePlayer_vX(props) {
  const { riveRenderer } = props;
  isRiveRenderer = riveRenderer;
  const [renderer, setRenderer] = useState(riveRenderer);
  useEffect(() => {
    setRenderer(riveRenderer);
  }, [riveRenderer]);
  return /*#__PURE__*/ _jsx(
    "div",
    {
      style: { width: "100%", height: "100%" },
      children: /*#__PURE__*/ _jsx(RivePlayerInternal, {
        ...props,
        riveRenderer: renderer,
      }),
    },
    renderer ? "webgl" : "canvas"
  );
}
function RivePlayerInternal(props) {
  const {
    src,
    artboard,
    stateMachines,
    riveRenderer,
    autoplay,
    autoBind,
    handleEvents,
    fit,
    alignment,
    play,
    playOnCanvas,
    onEventTriggered,
    inputsJSON,
    isTouchScrollEnabled,
    layoutScaleFactor,
  } = props;
  const rivePackage = useMemo(
    () => (riveRenderer ? riveWebGL : riveCanvas),
    [riveRenderer]
  );
  const { useRive } = rivePackage;
  const Layout = rivePackage.default.Layout;
  const layout = useMemo(
    () =>
      new Layout({
        fit: getFitValue(fit),
        alignment: getAlignmentValue(alignment),
        ...(fit === "layout" && { layoutScaleFactor }),
      }),
    [fit, alignment, layoutScaleFactor]
  );
  const { rive, RiveComponent } = useRive({
    src,
    artboard,
    stateMachines,
    autoplay,
    autoBind,
    automaticallyHandleEvents: handleEvents,
    layout,
    isTouchScrollEnabled: isTouchScrollEnabled,
  });
  const inputs = useRiveInputs(rive, stateMachines, inputsJSON);
  const prevInputsRef = useRef(inputs);
  useEffect(() => {
    if (rive && inputs.length) {
      inputs.forEach((input, index) => {
        if (input.handler) {
          const prevInput = prevInputsRef.current[index];
          if (
            input.type === "Trigger" &&
            input.value &&
            (!prevInput || !prevInput.value)
          ) {
            input.handler.fire();
          } else if (input.type !== "Trigger" && "value" in input) {
            input.handler.value = input.value;
          }
        }
      });
    }
    prevInputsRef.current = inputs;
  }, [rive, inputs]);
  useEffect(() => {
    if (rive) {
      const handleEvent = (event) => {
        // console.log("Rive event triggered:", event)
        if (onEventTriggered) {
          onEventTriggered(event.data); // console.log("Event data:", event.data)
        }
      };
      rive.on("riveevent", handleEvent);
      return () => {
        rive.off("riveevent", handleEvent);
      };
    }
  }, [rive, onEventTriggered]);
  useEffect(() => {
    if (rive) {
      const shouldPlay =
        RenderTarget.current() === RenderTarget.canvas ? playOnCanvas : play;
      shouldPlay ? rive.play() : rive.pause();
    }
  }, [rive, play, playOnCanvas]);
  useEffect(() => {
    if (rive) {
      rive.layout = layout;
    }
  }, [rive, layout]);
  return /*#__PURE__*/ _jsx("div", {
    style: { width: "100%", height: "100%" },
    children: /*#__PURE__*/ _jsx(RiveComponent, {
      style: { width: "100%", height: "100%" },
    }),
  });
} // Property controls
addPropertyControls(RivePlayer_vX, {
  src: { title: "Source", type: ControlType.String },
  artboard: { title: "Artboard", type: ControlType.String },
  stateMachines: { title: "State Machines", type: ControlType.String },
  riveRenderer: {
    title: "Rive Renderer",
    type: ControlType.Boolean,
    hidden: () => true,
  },
  autoplay: {
    title: "Autoplay",
    type: ControlType.Boolean,
    hidden: () => true,
  },
  autoBind: { title: "Auto Bind", type: ControlType.Boolean },
  handleEvents: { title: "Handle Events", type: ControlType.Boolean },
  isTouchScrollEnabled: {
    title: "Touch Screen Enabled",
    type: ControlType.Boolean,
  },
  fit: {
    title: "Fit",
    type: ControlType.Enum,
    options: [
      "layout",
      "contain",
      "cover",
      "fill",
      "fitWidth",
      "fitHeight",
      "none",
      "scaleDown",
    ],
    optionTitles: [
      "Layout",
      "Contain",
      "Cover",
      "Fill",
      "Fit Width",
      "Fit Height",
      "None",
      "Scale Down",
    ],
    defaultValue: "contain",
  },
  layoutScaleFactor: {
    title: "Layout Scale Factor",
    type: ControlType.Number,
    defaultValue: 1,
    min: 0.25,
    max: 10,
    displayStepper: true,
    step: 0.25,
    hidden: (props) => props.fit !== "layout",
  },
  alignment: {
    title: "Alignment",
    type: ControlType.Enum,
    options: [
      "center",
      "topLeft",
      "topCenter",
      "topRight",
      "centerLeft",
      "centerRight",
      "bottomLeft",
      "bottomCenter",
      "bottomRight",
    ],
    optionTitles: [
      "Center",
      "Top Left",
      "Top Center",
      "Top Right",
      "Center Left",
      "Center Right",
      "Bottom Left",
      "Bottom Center",
      "Bottom Right",
    ],
    defaultValue: "center",
  },
  play: { title: "Auto-Play", type: ControlType.Boolean },
  playOnCanvas: { title: "Play on Canvas", type: ControlType.Boolean },
  onEventTriggered: { type: ControlType.EventHandler },
  inputsJSON: {
    title: "Inputs JSON",
    type: ControlType.String,
    hidden: () => true,
  },
}); // Default props
RivePlayer_vX.defaultProps = {
  src: "https://public.rive.app/hosted/63978/135405/cRjq3a7l40ScM-l2peKfBQ.riv",
  artboard: "AB_BG",
  stateMachines: "SM_BG",
  riveRenderer: false,
  autoplay: true,
  autoBind: true,
  handleEvents: true,
  fit: "contain",
  alignment: "center",
  play: true,
  playOnCanvas: true,
  onEventTriggered: (eventData) => null,
  inputsJSON: "[]",
  isTouchScrollEnabled: false,
  layoutScaleFactor: 1,
};
export const __FramerMetadata__ = {
  exports: {
    default: {
      type: "reactComponent",
      name: "RivePlayer_vX",
      slots: [],
      annotations: {
        framerSupportedLayoutHeight: "any-prefer-fixed",
        framerContractVersion: "1",
        framerDisableUnlink: "",
        framerSupportedLayoutWidth: "any-prefer-fixed",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
//# sourceMappingURL=./RivePlayer_vX.map
