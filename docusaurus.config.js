// @ts-check
// docusaurus.config.js — Cuaderno Informativo Técnico
// Yuri · Full-Stack Dev · Medellín

import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Cuaderno Técnico',
  tagline: 'Apuntes de Desarrollo Full-Stack',
  favicon: 'img/favicon.ico',

 
  // URL de producción (ajusta cuando despliegues en GitHub Pages / Vercel)
url: 'https://yuranimar.github.io',
baseUrl: '/cuaderno-tecnico-react/',

organizationName: 'yuranimar',
projectName: 'cuaderno-tecnico-react',

  // Si un enlace roto rompe el build, lo avisamos
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  // ─── PLUGINS ──────────────────────────────────────────────────────────────
  plugins: [
    // Permite importar estilos SCSS si los necesitas
    // ['@docusaurus/plugin-ideal-image', {}],
  ],

  // ─── PRESETS ──────────────────────────────────────────────────────────────
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: '/',          // La raíz del sitio ES el cuaderno
          showLastUpdateTime: true,
          showLastUpdateAuthor: false,
        },
        blog: false,                   // No usamos blog
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  // ─── TEMA ─────────────────────────────────────────────────────────────────
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Forzar dark mode por defecto, deshabilitar el switch
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,           // Siempre dark — identidad del proyecto
        respectPrefersColorScheme: false,
      },

      // ── Barra de anuncio (opcional, puedes quitar) ──
      announcementBar: {
        id: 'wip',
        content: '🚧 Cuaderno en construcción continua — Se agregan temas semanalmente',
        backgroundColor: '#0d1117',
        textColor: '#22d3ee',
        isCloseable: true,
      },

      // ── Navbar ──────────────────────────────────────────────────────────
      navbar: {
        title: 'Cuaderno Técnico',
        logo: {
          alt: 'Logo Cuaderno',
          src: 'img/logo.svg',
        },
        style: 'dark',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'cuadernoSidebar',
            position: 'left',
            label: '📚 Apuntes',
          },
          {
           href: 'https://github.com/yuranimar/cuaderno-tecnico-react',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },

      // ── Footer ──────────────────────────────────────────────────────────
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Backend',
            items: [
              { label: 'NestJS',   to: '/backend/nestjs' },
              { label: 'Django',   to: '/backend/django' },
              { label: 'APIs REST',to: '/backend/apis' },
            ],
          },
          {
            title: 'Frontend',
            items: [
              { label: 'React',    to: '/frontend/react' },
              { label: 'GSAP',     to: '/frontend/gsap' },
              { label: 'TypeScript', to: '/frontend/typescript' },
            ],
          },
          {
            title: 'DevOps & Más',
            items: [
              { label: 'Git & GitHub', to: '/devops/git' },
              { label: 'AWS',          to: '/devops/aws' },
              { label: 'Metodologías', to: '/metodologias/agiles' },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} · Cuaderno Técnico · Construido con Docusaurus`,
      },

      // ── Resaltado de código (Prism) ─────────────────────────────────────
      prism: {
        theme: prismThemes.oneDark,          // Dark theme para bloques de código
        darkTheme: prismThemes.oneDark,
        additionalLanguages: [
          'bash',
          'typescript',
          'python',
          'sql',
          'json',
          'yaml',
          'docker',
          'nginx',
          'http',
        ],
      },

      // ── Tabla de contenidos ─────────────────────────────────────────────
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },

      // ── Metadatos para SEO ──────────────────────────────────────────────
      metadata: [
        { name: 'keywords', content: 'nestjs, django, react, apis, full-stack, apuntes, desarrollo web' },
        { name: 'theme-color', content: '#0b0f17' },
      ],
    }),
};

export default config;
