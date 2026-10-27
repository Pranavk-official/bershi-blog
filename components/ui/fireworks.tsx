"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";

interface FireworksProps {
  className?: string;
  duration?: number;
}

export const Fireworks = ({ className, duration = 10000 }: FireworksProps) => {
  const [init, setInit] = useState(false);

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    if (container) {
      console.log("Fireworks particles loaded");
    }
  }, []);

  const options = useMemo(
    () => ({
      autoPlay: true,
      background: {
        color: {
          value: "transparent",
        },
      },
      fullScreen: {
        enable: true,
        zIndex: 9999,
      },
      detectRetina: true,
      fpsLimit: 120,
      emitters: {
        direction: "top" as const,
        life: {
          count: 0,
          duration: duration / 1000,
          delay: 0,
        },
        rate: {
          delay: 0.1,
          quantity: 1,
        },
        size: {
          width: 100,
          height: 0,
        },
        position: {
          y: 100,
          x: 50,
        },
      },
      particles: {
        number: {
          value: 0,
        },
        color: {
          value: ["#FF1461", "#18FF92", "#5A87FF", "#FBF38C"],
        },
        shape: {
          type: ["circle", "square"],
        },
        opacity: {
          value: 1,
          animation: {
            enable: true,
            minimumValue: 0,
            speed: 2,
            startValue: "max" as const,
            destroy: "min" as const,
          },
        },
        size: {
          value: 4,
          random: {
            enable: true,
            minimumValue: 2,
          },
        },
        links: {
          enable: false,
        },
        life: {
          duration: {
            sync: true,
            value: 5,
          },
          count: 1,
        },
        move: {
          enable: true,
          gravity: {
            enable: true,
            acceleration: 10,
          },
          speed: {
            min: 10,
            max: 20,
          },
          decay: 0.1,
          direction: "none" as const,
          straight: false,
          outModes: {
            default: "destroy" as const,
            top: "none" as const,
          },
        },
      },
    }),
    [duration]
  );

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      className={className}
    />
  );
};
