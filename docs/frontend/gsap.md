---
id: gsap
title: GSAP — Animaciones Web
sidebar_label: GSAP
sidebar_position: 3
description: GreenSock Animation Platform — tweens, timelines, ScrollTrigger, GSAP en React y Framer Motion.
tags: [frontend, gsap, animaciones, javascript, scrolltrigger, framer-motion]
---

# GSAP — GreenSock Animation Platform

<span className="badge-tech">JavaScript</span>
<span className="badge-tech">SVG</span>
<span className="badge-tech">ScrollTrigger</span>
<span className="badge-tech">React</span>
<span className="badge-tech">Framer Motion</span>

GSAP es la librería de animaciones más potente y compatible de la web. Anima cualquier propiedad CSS, atributos SVG, Canvas, objetos JS con control total de tiempo y easing.

:::tip ¿Por qué GSAP sobre CSS animations?
CSS animations son limitadas: no puedes secuenciar fácilmente, pausar, revertir, o animar propiedades arbitrarias de JS. GSAP hace todo eso con una API unificada y un rendimiento superior.
:::

---

## Instalación

```bash
npm install gsap

# Plugins premium (requieren membresía Club GreenSock o cuenta gratis con limitaciones)
npm install @gsap/react   # Hook oficial para React
```

---

## Los tres métodos base

```javascript
import gsap from 'gsap';

// gsap.to() — desde el estado ACTUAL hacia los valores dados
// "Lleva el elemento HACIA acá"
gsap.to('.card', {
  duration: 1,
  opacity: 1,
  y: 0,
  ease: 'power2.out'
});

// gsap.from() — DESDE los valores dados hacia el estado actual
// "El elemento viene DESDE acá"
gsap.from('.hero-title', {
  duration: 0.8,
  y: -50,
  opacity: 0,
  ease: 'back.out(1.7)'
});

// gsap.fromTo() — control total de inicio Y fin
// "Va DESDE acá HACIA acá"
gsap.fromTo('.btn',
  { scale: 0.8, opacity: 0 },          // estado inicial
  { scale: 1,   opacity: 1, duration: 0.5 } // estado final
);

// gsap.set() — asigna valores instantáneamente (sin animación)
gsap.set('.modal', { display: 'none', opacity: 0 });
```

---

## Propiedades más usadas

| Propiedad | Qué anima | Ejemplo |
|---|---|---|
| `x`, `y` | Posición (transform) | `x: 100` → mueve 100px a la derecha |
| `xPercent`, `yPercent` | Posición en % | `xPercent: -50` → centra horizontalmente |
| `opacity` | Transparencia | `opacity: 0` → invisible |
| `scale` | Escala uniforme | `scale: 1.2` → 20% más grande |
| `scaleX`, `scaleY` | Escala por eje | `scaleX: 0` → aplasta |
| `rotation` | Rotación en grados | `rotation: 360` → giro completo |
| `width`, `height` | Dimensiones | `width: '100%'` |
| `backgroundColor` | Color de fondo | `backgroundColor: '#22d3ee'` |
| `borderRadius` | Radio de borde | `borderRadius: '50%'` |

---

## Easing — Curvas de animación

```javascript
// Easings más usados
ease: 'none'            // lineal
ease: 'power1.out'      // desaceleración suave
ease: 'power2.out'      // desaceleración media (muy usado)
ease: 'power3.out'      // desaceleración fuerte
ease: 'power4.out'      // desaceleración muy fuerte
ease: 'back.out(1.7)'   // rebote al final (overshoot)
ease: 'bounce.out'      // rebote como pelota
ease: 'elastic.out(1, 0.3)' // elástico
ease: 'circ.out'        // circular suave
ease: 'expo.out'        // exponencial
```

:::tip Visualizador de easings
Prueba todos los easings en [gsap.com/ease-visualizer](https://gsap.com/docs/v3/Eases/)
:::

---

## Timeline — Secuencias de animación

```javascript
// Timeline = contenedor de animaciones con control de tiempo
const tl = gsap.timeline({
  defaults: { ease: 'power3.out', duration: 0.6 }, // valores por defecto para todos los tweens
  repeat: -1,    // repetir infinitamente (opcional)
  yoyo: true,    // ida y vuelta (opcional)
});

tl.from('.navbar',    { y: -80, opacity: 0 })
  .from('.hero-text', { x: -60, opacity: 0 }, '-=0.3')  // 0.3s antes de que termine el anterior
  .from('.hero-img',  { x:  60, opacity: 0 }, '<')       // al mismo tiempo que el anterior
  .from('.cards',     { y: 40,  opacity: 0, stagger: 0.15 }) // stagger = uno por uno
  .from('.footer',    { opacity: 0 }, '+=0.5');              // 0.5s de pausa antes
```

```javascript title="Control del timeline"
tl.pause();           // pausar
tl.play();            // reproducir
tl.reverse();         // revertir
tl.restart();         // reiniciar desde el principio
tl.seek(1.5);         // ir al segundo 1.5
tl.timeScale(2);      // reproducir al doble de velocidad
```

---

## Stagger — Animar múltiples elementos

```javascript
// Anima cada .item con 0.1s de retraso entre ellos
gsap.from('.item', {
  opacity: 0,
  y: 30,
  duration: 0.5,
  stagger: 0.1,         // retraso entre cada elemento
  ease: 'power2.out',
});

// Stagger avanzado
gsap.from('.card', {
  opacity: 0,
  scale: 0.8,
  stagger: {
    amount: 0.8,        // tiempo total distribuido entre todos
    from: 'center',     // empieza desde el centro (también: 'start', 'end', 'random')
    grid: 'auto',       // detecta grids automáticamente
  }
});
```

---

## ScrollTrigger

```javascript
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);  // siempre registrar antes de usar

// Animación básica al hacer scroll
gsap.from('.seccion', {
  scrollTrigger: {
    trigger: '.seccion',   // elemento que dispara la animación
    start: 'top 80%',      // cuando el TOP del trigger llega al 80% del viewport
    end: 'top 30%',        // cuando el TOP del trigger llega al 30%
    toggleActions: 'play none none reverse', // onEnter, onLeave, onEnterBack, onLeaveBack
  },
  y: 60,
  opacity: 0,
  duration: 0.8,
});
```

```javascript title="Scrub — Animación ligada al scroll"
gsap.to('.parallax-img', {
  scrollTrigger: {
    trigger: '.parallax-section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,         // true = instantáneo, número = smoothing en segundos
  },
  y: -150,           // se mueve -150px mientras el usuario scrollea la sección
});
```

```javascript title="Pin — Fijar elemento mientras el scroll avanza"
gsap.to('.contenido', {
  scrollTrigger: {
    trigger: '.seccion',
    start: 'top top',
    end: '+=500',          // 500px de scroll "consumido" mientras está fijo
    pin: true,             // fija el elemento
    scrub: true,
  },
  x: -1000,               // se mueve horizontalmente mientras el elemento está fijo
});
```

---

## GSAP en React

```bash
npm install @gsap/react
```

```jsx title="Animación básica con useGSAP"
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

function HeroSection() {
  const container = useRef(null);

  useGSAP(() => {
    // Las animaciones dentro de useGSAP se limpian automáticamente
    gsap.from('.hero-title', { y: -50, opacity: 0, duration: 0.8 });
    gsap.from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.8, delay: 0.3 });
  }, { scope: container }); // scope limita los selectores al contenedor

  return (
    <section ref={container}>
      <h1 className="hero-title">Título</h1>
      <p className="hero-subtitle">Subtítulo</p>
    </section>
  );
}
```

```jsx title="ScrollTrigger en React"
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function Tarjetas({ items }) {
  const container = useRef(null);

  useGSAP(() => {
    gsap.from('.card', {
      scrollTrigger: {
        trigger: container.current,
        start: 'top 75%',
      },
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.6,
    });
  }, { scope: container });

  return (
    <div ref={container}>
      {items.map(item => (
        <div key={item.id} className="card">{item.nombre}</div>
      ))}
    </div>
  );
}
```

---

## Framer Motion — Alternativa declarativa

Framer Motion es ideal para animaciones en React por su sintaxis declarativa, especialmente para animaciones de presencia/ausencia de componentes.

```bash
npm install framer-motion
```

```jsx title="Animaciones básicas con Framer Motion"
import { motion, AnimatePresence } from 'framer-motion';

// Componente animado
function Tarjeta({ nombre }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}        // estado inicial
      animate={{ opacity: 1, y: 0 }}          // estado final
      exit={{ opacity: 0, y: -30 }}           // al desmontar
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}             // al hacer hover
      whileTap={{ scale: 0.97 }}               // al hacer click
    >
      {nombre}
    </motion.div>
  );
}
```

```jsx title="AnimatePresence — Animar montaje/desmontaje"
import { AnimatePresence, motion } from 'framer-motion';

function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1 }}
            exit={{    scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

```jsx title="Variantes — Animaciones coordinadas"
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

function Lista({ items }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {items.map(item => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.nombre}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

---

## GSAP vs Framer Motion

| | GSAP | Framer Motion |
|---|---|---|
| **Sintaxis** | Imperativa (JS) | Declarativa (JSX props) |
| **Curva de aprendizaje** | Mayor | Menor |
| **Control** | Total | Limitado (pero suficiente) |
| **ScrollTrigger** | ✅ Muy potente | Básico (`useScroll`) |
| **Tamaño** | ~67kb | ~150kb |
| **Animaciones de presencia** | Manual | ✅ AnimatePresence |
| **Mejor para** | Animaciones complejas, SVG | UI de React, modales, listas |

:::tip Úsalos juntos
En proyectos como Isamar, GSAP para el hero y scroll, Framer Motion para interacciones de componentes (modales, menús, hover cards).
:::
