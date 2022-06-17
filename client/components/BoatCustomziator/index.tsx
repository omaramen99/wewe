import { useEffect, useRef, useState } from "react";
import { Menu } from "react-feather";
import Sketch, { Config } from "./Sketch";


import EnginesAnimationCustomizator from "./UI/EnginesAnimationCustomizator"

import style from "./style.module.scss";
import StyleCustomizator from "./UI/StyleCustomizator";
import VisibilityCustomizator from "./UI/VisibilityCustomizator";

export interface BoatCustomizatorConfig {
  config: Config;
}

export default function BoatCustomizator({ config }: BoatCustomizatorConfig) {
  const [activePlaceholder, setActivePlaceholder] = useState<string | null>(
    null
  );

  const parentRef = useRef<HTMLDivElement>(null);
  const sketchRef = useRef<Sketch>();

  useEffect(() => {
    // const Sketch = require("./Sketch") as typeof _Sketch;
    const sketch = new Sketch(parentRef.current, config);
    /**
     * Update component state when any placeholder gets clicked
     */
    sketch.addEventListener("placeholderClick", ({ placeholderKey }) =>
      setActivePlaceholder(placeholderKey)
    );

    sketchRef.current = sketch;

    return () => sketch.dispose();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.headerContainer}>
        <div className={style.headerTitle}>Company Name</div>
        <Menu className={style.headerIcon} />
      </div>
      <div className={style.canvasContainer} ref={parentRef}></div>
      {/**
       * Show Placeholder configuration
       */}
      {activePlaceholder && (
        <div className={style.customizationContainer}>
          <div className={style.customizationHeader}>
            <div
              className={style.title}
            >{`Edit ${config.customization[activePlaceholder].placeholderLabel}`}</div>
            <button>Done</button>
          </div>

          {/**
           * Show Visibility customizator if any
           */}
          {activePlaceholder &&
            config.customization[
              activePlaceholder
            ].visibilityCustomization?.map((customization, index) => (
              <VisibilityCustomizator
                key={index}
                customization={customization}
                /**
                 * Update Boat with selected customization option
                 */
                onSelect={(option) =>
                  sketchRef.current?.boat.setVisibilityCustomizationOption( 
                    customization,
                    option
                  )
                }
              />
            ))}
          {/**
           * Show Style customizator if any
           */}
          {activePlaceholder &&
            config.customization[activePlaceholder].styleCustomization?.map(
              (customization, index) => (
                <StyleCustomizator
                  key={index}
                  customization={customization}
                  /**
                   * Update Boat with selected customization option option
                   */
                  onSelect={(option) =>
                    sketchRef.current?.boat.setStyleCustomizationOption(
                      customization,
                      option
                    )
                  }
                />
              )
            )}


           {/**
           * Show Animation Buttons if the activePlaceholder is Engine
           */}
          {activePlaceholder == "placeholder_engine"? (<EnginesAnimationCustomizator title={'Engine Pose'}/>):("")}



        </div>
      )}
    </div>
  );
}
